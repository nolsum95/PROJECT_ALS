<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Learner;
use App\Models\User;
use App\Models\EnrollmentAlpha;
use App\Models\Classwork;
use App\Models\Questionnaire;
use App\Models\Question;
use App\Models\LearnerAttempt;
use App\Models\LearnerAnswer;
use App\Models\Modules;
use App\Models\Attendance;
use App\Models\Subject;

class LearnerDashboardController extends Controller
{
    /**
     * Display the learner dashboard
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();
        
        // Compute total exams from CAI-posted classworks (pre/post)
        $totalExams = Classwork::where('fk_cai_id', $learner?->assigned_cai)
            ->whereIn('test_level', ['pretest', 'posttest'])
            ->where('posting_status', 'posted')
            ->count();

        // Get learner statistics
        $stats = [
            'completedReviewers' => LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                ->where('status', 'completed')->count(),
            'totalReviewers' => Questionnaire::whereHas('classwork', function($q) use ($learner) {
                $q->where('fk_clc_id', $learner?->assigned_clc);
            })->count(),
            'examsPassed' => LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                ->where('status', 'completed')
                ->where('score', '>=', 75)
                ->count(),
            'totalExams' => $totalExams,
            'overallProgress' => $this->calculateOverallProgress($learner),
            'attendanceRate' => $this->calculateAttendanceRate($learner),
        ];

        // Get recent activities
        $recentActivities = $this->getRecentActivities($learner);
        
        // Get upcoming exams (same source/logic as Exams page: CAI-posted classworks pre/post)
        $caiExams = Classwork::with(['questionnaires.subject'])
            ->where('fk_cai_id', $learner?->assigned_cai)
            ->whereIn('test_level', ['pretest', 'posttest'])
            ->where('posting_status', 'posted')
            ->get()
            ->flatMap(function ($classwork) {
                return $classwork->questionnaires->map(function ($qn) use ($classwork) {
                    $scheduledAt = $classwork->available_at ?? $classwork->scheduled_post_at;
                    $availableUntil = $classwork->available_until ?? null;
                    $now = now();
                    $status = ($scheduledAt && $now->lt($scheduledAt)) ? 'upcoming' : 'available';
                    return [
                        'id' => 'qn-' . $qn->qn_id,
                        'title' => $qn->title,
                        'subject' => $qn->subject->subject_name ?? 'General',
                        'type' => $classwork->test_level,
                        'time_duration' => $qn->time_duration ?? 30,
                        'available_from' => $scheduledAt ? $scheduledAt->toIso8601String() : $classwork->created_at->toIso8601String(),
                        'available_until' => $availableUntil ? $availableUntil->toIso8601String() : null,
                        'status' => $status,
                    ];
                });
            })
            ->filter(function ($exam) {
                return $exam['status'] === 'upcoming';
            })
            ->sortBy('available_from')
            ->take(5)
            ->values();

        $upcomingExams = $caiExams;

        return Inertia::render('Learner/Dashboard', [
            'learner' => $learner,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingExams' => $upcomingExams,
        ]);
    }

    /**
     * Take a CAI exam (pretest/posttest). The $examId can be 'qn-<id>' or a raw questionnaire id.
     */
    public function takeExam(Request $request, $examId)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        if (!$learner) {
            return redirect()->route('learner.exams')->with('error', 'Learner not found.');
        }

        // Normalize id
        $qnId = (is_string($examId) && str_starts_with($examId, 'qn-')) ? (int) str_replace('qn-', '', $examId) : (int) $examId;

        // Load questionnaire under a posted pre/post classwork that belongs to learner's CAI
        $questionnaire = Questionnaire::with(['questions', 'subject', 'classwork'])
            ->where('qn_id', $qnId)
            ->whereHas('classwork', function ($q) use ($learner) {
                $q->where('fk_cai_id', $learner->assigned_cai)
                  ->whereIn('test_level', ['pretest', 'posttest'])
                  ->where('posting_status', 'posted');
            })
            ->first();

        if (!$questionnaire) {
            return redirect()->route('learner.exams')->with('error', 'Exam not found or not available.');
        }

        // Check availability window
        $classwork = $questionnaire->classwork;
        $now = now();
        $availableFrom = $classwork->available_at ?? $classwork->scheduled_post_at ?? $classwork->created_at;
        $availableUntil = $classwork->available_until;
        if (($availableFrom && $now->lt($availableFrom)) || ($availableUntil && $now->gt($availableUntil))) {
            return redirect()->route('learner.exams')->with('error', 'This exam is not currently available.');
        }

        // Check if already completed
        $existingAttempt = LearnerAttempt::where('fk_learner_id', $learner->learner_id)
            ->where('fk_qn_id', $qnId)
            ->where('status', 'completed')
            ->latest('completed_at')
            ->first();

        return Inertia::render('Learner/TakeExam', [
            'learner' => $learner,
            'questionnaire' => $questionnaire,
            'questions' => $questionnaire->questions,
            'existingAttempt' => $existingAttempt,
        ]);
    }

    /**
     * Submit exam answers. Do not show answers/results; just record and return.
     */
    public function submitExam(Request $request)
    {
        $validated = $request->validate([
            'questionnaire_id' => 'required|exists:questionnaire_tb,qn_id',
            'answers' => 'required|array',
            'time_taken' => 'required|integer|min:0'
        ]);

        $user = $request->user();
        $learner = Learner::where('fk_userId', $user->user_id)->first();

        if (!$learner) {
            return back()->withErrors(['error' => 'Learner not found.']);
        }

        // Load questionnaire and ensure it's an exam (pre/post) and posted
        $questionnaire = Questionnaire::with(['questions', 'classwork'])
            ->where('qn_id', $validated['questionnaire_id'])
            ->first();

        if (!$questionnaire || !in_array($questionnaire->classwork?->test_level, ['pretest', 'posttest']) || $questionnaire->classwork?->posting_status !== 'posted') {
            return back()->withErrors(['error' => 'Invalid exam.']);
        }

        // Compute score
        $totalQuestions = $questionnaire->questions->count();
        $correct = 0;
        foreach ($questionnaire->questions as $q) {
            $ans = $validated['answers'][$q->question_id] ?? null;
            if ($ans && $ans === $q->ans_key) {
                $correct++;
            }
        }
        $score = $totalQuestions > 0 ? round(($correct / $totalQuestions) * 100, 2) : 0;

        // Store attempt
        LearnerAttempt::updateOrCreate(
            [
                'fk_learner_id' => $learner->learner_id,
                'fk_qn_id' => $validated['questionnaire_id']
            ],
            [
                'score' => $score,
                'time_taken' => $validated['time_taken'],
                'status' => 'completed',
                'completed_at' => now(),
                'passing_score' => 70,
                'is_passed' => $score >= 70,
            ]
        );

        // Return with result details so frontend can show a results modal
        $wrong = max(0, $totalQuestions - $correct);
        return back()->with([
            'success' => 'Exam submitted successfully.',
            'exam_result' => [
                'total' => $totalQuestions,
                'correct' => $correct,
                'wrong' => $wrong,
                'percentage' => $score,
                'passed' => $score >= 70,
            ]
        ]);
    }

    /**
     * Display learner profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();
        
        // Get enrollment data
        $enrollment = EnrollmentAlpha::where('email_address', $user->email_address)
            ->with(['address', 'guardian', 'info', 'pwd', 'household', 'clc'])
            ->first();

        return Inertia::render('Learner/Profile', [
            'learner' => $learner,
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Update learner profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'mobile_no' => 'nullable|string|max:20',
            'email_address' => ['nullable', 'email', 'max:255', Rule::unique('user_tb')->ignore($user->user_id, 'user_id')],
            'cur_house_no' => 'nullable|string|max:50',
            'cur_streetname' => 'nullable|string|max:100',
            'cur_barangay' => 'nullable|string|max:100',
            'cur_municipality' => 'nullable|string|max:100',
            'cur_province' => 'nullable|string|max:100',
            'cur_zip_code' => 'nullable|string|max:10',
        ]);

        // Update user email if provided
        if (isset($validated['email_address'])) {
            $user->update(['email_address' => $validated['email_address']]);
        }

        // Update enrollment data
        $enrollment = EnrollmentAlpha::where('email_address', $user->email_address)->first();
        if ($enrollment) {
            $enrollment->update(['mobile_no' => $validated['mobile_no']]);
            
            // Update address
            if ($enrollment->address) {
                $enrollment->address->update([
                    'cur_house_no' => $validated['cur_house_no'],
                    'cur_streetname' => $validated['cur_streetname'],
                    'cur_barangay' => $validated['cur_barangay'],
                    'cur_municipality' => $validated['cur_municipality'],
                    'cur_province' => $validated['cur_province'],
                    'cur_zip_code' => $validated['cur_zip_code'],
                ]);
            }
        }

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update learner password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
            'confirm_password' => 'required|same:new_password',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Display enrollment status
     */
    public function enrollmentStatus(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();
        
        $enrollment = EnrollmentAlpha::where('email_address', $user->email_address)
            ->with(['address', 'guardian', 'info', 'pwd', 'household', 'clc'])
            ->first();

        // Get subjects
        $subjects = Subject::all();

        return Inertia::render('Learner/EnrollmentStatus', [
            'learner' => $learner,
            'enrollment' => $enrollment,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Display study materials (reviewers and modules)
     */
    public function studyMaterials(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        // Get available reviewers for learner's CLC
        $classworks = Classwork::with(['questionnaires.subject', 'questionnaires.questions'])
            ->where('fk_clc_id', $learner?->assigned_clc)
            ->where('posting_status', 'posted')
            ->get();
            
            
        $reviewers = collect();
        
        foreach ($classworks as $classwork) {
            foreach ($classwork->questionnaires as $questionnaire) {
                $attempt = LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                    ->where('fk_qn_id', $questionnaire->qn_id)
                    ->latest()
                    ->first();

                $reviewers->push([
                    'id' => $questionnaire->qn_id,
                    'title' => $questionnaire->title,
                    'subject' => $questionnaire->subject->subject_name ?? 'General',
                    'description' => $questionnaire->description,
                    'questions_count' => $questionnaire->questions->count(),
                    'time_duration' => $questionnaire->time_duration,
                    'completion_status' => $attempt ? $attempt->status : 'not_started',
                    'score' => $attempt ? $attempt->score : 0,
                    'attempts' => LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                        ->where('fk_qn_id', $questionnaire->qn_id)
                        ->count(),
                    'available' => true,
                ]);
            }
        }

        // Get available modules
        $modules = Modules::where('fk_clc_id', $learner?->assigned_clc)
            ->with(['file'])
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->module_id,
                    'title' => $module->subject,
                    'subject' => $module->subject,
                    'description' => $module->description,
                    'file_type' => $module->file?->file_type ?? 'PDF',
                    'file_size' => $module->file ? $this->formatFileSize($module->file->file_size) : 'N/A',
                    'uploaded_date' => $module->created_at->toDateString(),
                    'downloaded' => false, // TODO: Track downloads
                ];
            });


        return Inertia::render('Learner/StudyMaterials', [
            'learner' => $learner,
            'reviewers' => $reviewers,
            'modules' => $modules,
        ]);
    }

    /**
     * Take a reviewer/questionnaire
     */
    public function takeReviewer(Request $request, $reviewerId)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        // Get the questionnaire
        $questionnaire = Questionnaire::with(['questions', 'subject', 'classwork'])
            ->where('qn_id', $reviewerId)
            ->whereHas('classwork', function($query) use ($learner) {
                $query->where('fk_clc_id', $learner?->assigned_clc)
                      ->where('posting_status', 'posted');
            })
            ->first();

        if (!$questionnaire) {
            return redirect()->route('learner.reviewers')
                ->with('error', 'Reviewer not found or not available.');
        }

        // Check if learner has already completed this
        $existingAttempt = LearnerAttempt::where('fk_learner_id', $learner->learner_id)
            ->where('fk_qn_id', $reviewerId)
            ->where('status', 'completed')
            ->first();

        return Inertia::render('Learner/TakeReviewer', [
            'learner' => $learner,
            'questionnaire' => $questionnaire,
            'questions' => $questionnaire->questions,
            'existingAttempt' => $existingAttempt,
        ]);
    }

    /**
     * Display exams
     */
    public function exams(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        // Get available exams from CAI-posted classworks (pretest/posttest) assigned to this learner's CAI
        $caiExams = Classwork::with(['questionnaires.subject', 'questionnaires.questions'])
            ->where('fk_cai_id', $learner?->assigned_cai)
            ->whereIn('test_level', ['pretest', 'posttest'])
            ->where('posting_status', 'posted')
            ->orderByDesc('created_at')
            ->get()
            ->flatMap(function ($classwork) use ($learner) {
                // Map each questionnaire under this classwork as an available exam
                return $classwork->questionnaires->map(function ($qn) use ($classwork, $learner) {
                    $attempts = LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                        ->where('fk_qn_id', $qn->qn_id)
                        ->count();

                    // Determine status based on availability window
                    $scheduledAt = $classwork->available_at ?? $classwork->scheduled_post_at;
                    $availableUntil = $classwork->available_until ?? null;
                    $now = now();
                    if ($scheduledAt && $now->lt($scheduledAt)) {
                        $status = 'upcoming';
                    } else {
                        $status = 'available';
                    }

                    return [
                        'id' => 'qn-' . $qn->qn_id,
                        'title' => $qn->title,
                        'subject' => $qn->subject->subject_name ?? 'General',
                        'type' => $classwork->test_level,
                        'description' => $qn->description,
                        'questions_count' => $qn->questions->count(),
                        'time_duration' => $qn->time_duration ?? 30,
                        'passing_score' => 70,
                        'available_from' => $scheduledAt ? $scheduledAt->toIso8601String() : $classwork->created_at->toIso8601String(),
                        'available_until' => $availableUntil ? $availableUntil->toIso8601String() : null,
                        'status' => $status,
                        'attempts_allowed' => 1,
                        'current_attempts' => $attempts,
                    ];
                });
            });

        // Use only CAI exams for learner
        $availableExams = $caiExams->values();

        // Get exam history (only attempts from CAI Exams: pretest/posttest)
        $examHistory = LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
            ->with(['questionnaire.subject', 'questionnaire.classwork'])
            ->where('status', 'completed')
            ->whereHas('questionnaire.classwork', function ($q) {
                $q->whereIn('test_level', ['pretest', 'posttest']);
            })
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->attempt_id,
                    'exam_title' => $attempt->questionnaire?->title ?? 'Unknown Exam',
                    'subject' => $attempt->questionnaire?->subject?->subject_name ?? 'General',
                    'type' => $attempt->questionnaire?->classwork?->test_level ?? 'exam',
                    'date_taken' => $attempt->completed_at,
                    'score' => $attempt->score,
                    'passing_score' => 70,
                    'time_taken' => $attempt->time_taken ?? 0,
                    'time_limit' => $attempt->questionnaire?->time_duration ?? 0,
                    'status' => $attempt->score >= 70 ? 'passed' : 'failed',
                    'attempt_number' => 1, // TODO: Calculate
                ];
            });

        return Inertia::render('Learner/Exams', [
            'learner' => $learner,
            'availableExams' => $availableExams,
            'examHistory' => $examHistory,
        ]);
    }

    /**
     * Display progress tracking
     */
    public function progress(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        // Calculate progress data
        $progressData = [
            'overall_progress' => $this->calculateOverallProgress($learner),
            'current_level' => 'A&E Elementary', // TODO: Get from enrollment
            'subjects_completed' => 3, // TODO: Calculate
            'total_subjects' => 5, // TODO: Get from curriculum
            'study_hours' => 45, // TODO: Track study time
            'target_hours' => 60,
        ];

        // Get exam results for progress tracking
        $examResults = $this->getExamProgressData($learner);
        
        // Get reviewer progress
        $reviewerProgress = $this->getReviewerProgressData($learner);
        
        // Get attendance data
        $attendanceData = $this->getAttendanceData($learner);

        return Inertia::render('Learner/Progress', [
            'learner' => $learner,
            'progressData' => $progressData,
            'examResults' => $examResults,
            'reviewerProgress' => $reviewerProgress,
            'attendanceData' => $attendanceData,
        ]);
    }

    /**
     * Display reports
     */
    public function reports(Request $request)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        return Inertia::render('Learner/Reports', [
            'learner' => $learner,
        ]);
    }

    /**
     * Submit reviewer answers
     */
    public function submitReviewer(Request $request)
    {
        $validated = $request->validate([
            'questionnaire_id' => 'required|exists:questionnaire_tb,qn_id',
            'answers' => 'required|array',
            'time_taken' => 'required|integer|min:0'
        ]);

        $user = $request->user();
        $learner = Learner::where('fk_userId', $user->user_id)->first();
        
        if (!$learner) {
            return back()->withErrors(['error' => 'Learner not found.']);
        }

        // Get the questionnaire with questions
        $questionnaire = Questionnaire::with(['questions'])
            ->where('qn_id', $validated['questionnaire_id'])
            ->first();

        if (!$questionnaire) {
            return back()->withErrors(['error' => 'Questionnaire not found.']);
        }

        // Calculate score
        $totalQuestions = $questionnaire->questions->count();
        $correctAnswers = 0;

        foreach ($questionnaire->questions as $question) {
            $userAnswer = $validated['answers'][$question->question_id] ?? null;
            if ($userAnswer && $userAnswer === $question->ans_key) {
                $correctAnswers++;
            }
        }

        $score = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100, 2) : 0;

        // Create or update learner attempt
        $attempt = LearnerAttempt::updateOrCreate(
            [
                'fk_learner_id' => $learner->learner_id,
                'fk_qn_id' => $validated['questionnaire_id']
            ],
            [
                'score' => $score,
                'time_taken' => $validated['time_taken'],
                'status' => 'completed',
                'completed_at' => now()
            ]
        );

        // Store individual answers (using correct table structure)
        foreach ($validated['answers'] as $questionId => $answer) {
            $question = $questionnaire->questions->where('question_id', $questionId)->first();
            if ($question) {
                LearnerAnswer::updateOrCreate(
                    [
                        'fk_learner_id' => $learner->learner_id,
                        'fk_question_id' => $questionId
                    ],
                    [
                        'selected_option' => $answer,
                        'is_correct' => $answer === $question->ans_key,
                        'answered_at' => now()
                    ]
                );
            }
        }

        return redirect("/learner/reviewers/{$validated['questionnaire_id']}/results")->with('success', 
            "Reviewer completed! Your score: {$score}% ({$correctAnswers}/{$totalQuestions} correct)"
        );
    }

    /**
     * Show reviewer results
     */
    public function reviewerResults(Request $request, $reviewerId)
    {
        $user = $request->user();
        $learner = Learner::with(['clc', 'cai'])->where('fk_userId', $user->user_id)->first();

        if (!$learner) {
            return redirect()->route('learner.reviewers')
                ->with('error', 'Learner not found.');
        }

        // Get the questionnaire with questions
        $questionnaire = Questionnaire::with(['questions', 'subject', 'classwork'])
            ->where('qn_id', $reviewerId)
            ->first();

        if (!$questionnaire) {
            return redirect()->route('learner.reviewers')
                ->with('error', 'Reviewer not found.');
        }

        // Get the learner's latest attempt for this questionnaire
        $attempt = LearnerAttempt::where('fk_learner_id', $learner->learner_id)
            ->where('fk_qn_id', $reviewerId)
            ->where('status', 'completed')
            ->latest('completed_at')
            ->first();

        if (!$attempt) {
            return redirect()->route('learner.reviewers')
                ->with('error', 'No completed attempt found for this reviewer.');
        }

        // Get the learner's answers for this attempt
        $answers = LearnerAnswer::where('fk_learner_id', $learner->learner_id)
            ->whereIn('fk_question_id', $questionnaire->questions->pluck('question_id'))
            ->get();

        return Inertia::render('Learner/ReviewerResults', [
            'learner' => $learner,
            'attempt' => $attempt,
            'questionnaire' => $questionnaire,
            'questions' => $questionnaire->questions,
            'answers' => $answers,
        ]);
    }

    /**
     * Download module
     */
    public function downloadModule(Request $request, $moduleId)
    {
        $module = Modules::with('file')->findOrFail($moduleId);
        
        if (!$module->file || !Storage::disk('public')->exists($module->file->file_path)) {
            return back()->withErrors(['error' => 'File not found.']);
        }

        return Storage::disk('public')->download(
            $module->file->file_path,
            $module->file->original_filename
        );
    }

    /**
     * Request custom report
     */
    public function requestReport(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:academic,attendance,exams,study,portfolio',
            'period' => 'required|string',
            'format' => 'required|in:pdf,excel',
            'email' => 'required|email',
        ]);

        // TODO: Implement report generation queue
        
        return back()->with('success', 'Report requested successfully. You will receive an email when it\'s ready.');
    }

    /**
     * Helper methods
     */
    private function calculateOverallProgress($learner)
    {
        if (!$learner) return 0;
        
        $totalReviewers = Questionnaire::whereHas('classwork', function($q) use ($learner) {
            $q->where('fk_clc_id', $learner->assigned_clc);
        })->count();
        
        $completedReviewers = LearnerAttempt::where('fk_learner_id', $learner->learner_id)
            ->where('status', 'completed')
            ->count();
            
        return $totalReviewers > 0 ? round(($completedReviewers / $totalReviewers) * 100) : 0;
    }

    private function calculateAttendanceRate($learner)
    {
        if (!$learner) return 0;
        
        $totalDays = Attendance::where('learner_id', $learner->learner_id)->count();
        $presentDays = Attendance::where('learner_id', $learner->learner_id)
            ->where('status', 'Present')
            ->count();
            
        return $totalDays > 0 ? round(($presentDays / $totalDays) * 100) : 0;
    }

    private function getRecentActivities($learner)
    {
        // TODO: Implement activity tracking
        return [];
    }

    // Removed getExamStatus() helper as exams now derive from CAI classworks, not assessments

    private function getExamProgressData($learner)
    {
        // TODO: Implement exam progress tracking
        return [];
    }

    private function getReviewerProgressData($learner)
    {
        // TODO: Implement reviewer progress tracking
        return [];
    }

    private function getAttendanceData($learner)
    {
        if (!$learner) {
            return [
                'total_days' => 0,
                'present_days' => 0,
                'absent_days' => 0,
                'attendance_rate' => 0,
            ];
        }

        $totalDays = Attendance::where('learner_id', $learner->learner_id)->count();
        $presentDays = Attendance::where('learner_id', $learner->learner_id)
            ->where('status', 'Present')
            ->count();
        $absentDays = $totalDays - $presentDays;
        $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

        return [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'attendance_rate' => $attendanceRate,
        ];
    }

    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}
