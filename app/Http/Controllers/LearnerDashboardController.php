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
use App\Models\Assessment;
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
            'totalExams' => Assessment::where('clc_id', $learner?->assigned_clc)->count(),
            'overallProgress' => $this->calculateOverallProgress($learner),
            'attendanceRate' => $this->calculateAttendanceRate($learner),
        ];

        // Get recent activities
        $recentActivities = $this->getRecentActivities($learner);
        
        // Get upcoming exams
        $upcomingExams = Assessment::where('clc_id', $learner?->assigned_clc)
            ->where('schedule_date', '>', now())
            ->orderBy('schedule_date')
            ->take(5)
            ->get();

        return Inertia::render('Learner/Dashboard', [
            'learner' => $learner,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingExams' => $upcomingExams,
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
            ->with(['fileStorage'])
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->module_id,
                    'title' => $module->subject,
                    'subject' => $module->subject,
                    'description' => $module->description,
                    'file_type' => $module->fileStorage?->file_type ?? 'PDF',
                    'file_size' => $module->fileStorage ? $this->formatFileSize($module->fileStorage->file_size) : 'N/A',
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

        // Get available exams
        $availableExams = Assessment::where('clc_id', $learner?->assigned_clc)
            ->where('status', 'active')
            ->get()
            ->map(function ($exam) use ($learner) {
                $attempts = LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
                    ->where('assessment_id', $exam->assessment_id)
                    ->count();

                return [
                    'id' => $exam->assessment_id,
                    'title' => $exam->title,
                    'subject' => 'General', // TODO: Add subject to assessments
                    'type' => $exam->assessment_type,
                    'description' => $exam->description,
                    'questions_count' => 40, // TODO: Add to assessments table
                    'time_duration' => 90, // TODO: Add to assessments table
                    'passing_score' => 75, // TODO: Add to assessments table
                    'available_from' => $exam->schedule_date,
                    'available_until' => $exam->schedule_date ? 
                        \Carbon\Carbon::parse($exam->schedule_date)->addHours(8) : null,
                    'status' => $this->getExamStatus($exam),
                    'attempts_allowed' => 1,
                    'current_attempts' => $attempts,
                ];
            });

        // Get exam history
        $examHistory = LearnerAttempt::where('fk_learner_id', $learner?->learner_id)
            ->with(['questionnaire'])
            ->where('status', 'completed')
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->attempt_id,
                    'exam_title' => $attempt->questionnaire?->title ?? 'Unknown Exam',
                    'subject' => $attempt->questionnaire?->subject?->subject_name ?? 'General',
                    'type' => 'quiz', // TODO: Determine from questionnaire
                    'date_taken' => $attempt->completed_at,
                    'score' => $attempt->score,
                    'passing_score' => 75,
                    'time_taken' => $attempt->time_taken ?? 0,
                    'time_limit' => $attempt->questionnaire?->time_duration ?? 0,
                    'status' => $attempt->score >= 75 ? 'passed' : 'failed',
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
     * Download module
     */
    public function downloadModule(Request $request, $moduleId)
    {
        $module = Modules::with('fileStorage')->findOrFail($moduleId);
        
        if (!$module->fileStorage || !Storage::disk('public')->exists($module->fileStorage->file_path)) {
            return back()->withErrors(['error' => 'File not found.']);
        }

        return Storage::disk('public')->download(
            $module->fileStorage->file_path,
            $module->fileStorage->original_filename
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

    private function getExamStatus($exam)
    {
        $now = now();
        $scheduleDate = \Carbon\Carbon::parse($exam->schedule_date);
        
        if ($scheduleDate->isFuture()) {
            return 'upcoming';
        } elseif ($scheduleDate->isToday() || $scheduleDate->diffInHours($now) <= 8) {
            return 'available';
        } else {
            return 'expired';
        }
    }

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
