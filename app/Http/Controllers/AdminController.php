<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Cai;
use App\Models\Clc;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Learner;
use App\Models\Modules;
use Illuminate\Http\Request;
use App\Models\EnrollmentAlpha;
use App\Models\Classwork;
use App\Models\Assessment;
use App\Models\FileStorage;

use App\Models\Questionnaire;
use App\Models\Question;
use App\Models\Subject;
use App\Mail\EnrolledUserCreation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;


class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(Request $request, $section = 'dashboard')
    {
        try {
            // Get statistics for the dashboard with safe fallbacks
            $stats = [
                'totalUsers' => User::count(),
                'totalCais' => Cai::count(),
                'totalLearners' => Learner::count(),
                'totalClcs' => Clc::count(),
                'activeModules' => Modules::count(), // Count all modules since no status column
                'enrollments' => EnrollmentAlpha::count(),
            ];
        } catch (\Exception $e) {
            // Log the error and provide fallback stats
            Log::error('Error loading dashboard stats: ' . $e->getMessage());
            
            $stats = [
                'totalUsers' => 0,
                'totalCais' => 0,
                'totalLearners' => 0,
                'totalClcs' => 0,
                'activeModules' => 0,
                'enrollments' => 0,
            ];
        }

        // --- Enrollment Filtering ---
        $enrollmentQuery = \App\Models\EnrollmentAlpha::query()
            ->leftJoin('enrollment_address_tb as addr', 'addr.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_guardian_tb as gu', 'gu.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_information_tb as info', 'info.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_pwd_tb as pwd', 'pwd.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('household_status_tb as hh', 'hh.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('distance_availability_tb as clc', 'clc.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('user_tb as u', 'u.email_address', '=', 'enrollment_alpha_tb.email_address')
            ->leftJoin('cai_tb as cai', 'cai.cai_id', '=', 'enrollment_alpha_tb.fk_cai_id');

        // Filter by status
        $status = $request->query('status');
        if ($status && $status !== 'All') {
            $enrollmentQuery->where('enrollment_alpha_tb.enrollee_status', $status);
        }

        // Filter by search
        $search = $request->query('search');
        if ($search) {
            $enrollmentQuery->where(function($q) use ($search) {
                $q->where('enrollment_alpha_tb.firstname', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.middlename', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.lastname', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.email_address', 'like', "%$search%")
                  ->orWhere('addr.cur_barangay', 'like', "%$search%")
                  ->orWhere('addr.cur_municipality', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.mobile_no', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.birthdate', 'like', "%$search%")
                  ->orWhere('enrollment_alpha_tb.enrollee_status', 'like', "%$search%")
                  ;
            });
        }

        $enrollments = $enrollmentQuery
            ->select([
                'enrollment_alpha_tb.enrollment_id as id',
                'enrollment_alpha_tb.firstname',
                'enrollment_alpha_tb.middlename',
                'enrollment_alpha_tb.lastname',
                'enrollment_alpha_tb.mobile_no',
                'enrollment_alpha_tb.email_address',
                'enrollment_alpha_tb.birthdate',
                'enrollment_alpha_tb.gender',
                'enrollment_alpha_tb.extension_name',
                'enrollment_alpha_tb.religion',
                'enrollment_alpha_tb.mother_tongue',
                'enrollment_alpha_tb.civil_status',
                'enrollment_alpha_tb.date_enrolled',
                'enrollment_alpha_tb.enrollee_status',
                'enrollment_alpha_tb.learner_ref_no',
                'enrollment_alpha_tb.fk_cai_id',
                // CAI info for tracking
                'cai.firstname as cai_firstname',
                'cai.middlename as cai_middlename', 
                'cai.lastname as cai_lastname',
                // Address
                'addr.cur_house_no',
                'addr.cur_streetname',
                'addr.cur_barangay',
                'addr.cur_municipality',
                'addr.cur_province',
                'addr.cur_zip_code',
                'addr.perm_house_no',
                'addr.perm_streetname',
                'addr.perm_barangay',
                'addr.perm_municipality',
                'addr.perm_province',
                'addr.perm_zip_code',
                // Guardian
                'gu.pa_lastname', 'gu.pa_firstname', 'gu.pa_middlename', 'gu.pa_occupation',
                'gu.ma_lastname', 'gu.ma_firstname', 'gu.ma_middlename', 'gu.ma_occupation',
                // Education info
                'info.lastLevelCompleted', 'info.nonCompletionReason', 'info.custom_reason', 'info.hasAttendedAls', 'info.alsProgramAttended', 'info.hasCompletedAls', 'info.alsNonCompletedReason',
                // PWD
                'pwd.is_pwd', 'pwd.disability_name', 'pwd.spec_health_prob', 'pwd.visual_impairment',
                // Household status
                'hh.isIndegenous', 'hh.ipCommunityName', 'hh.is4PsMember', 'hh.household_Id_4Ps',
                // CLC accessibility
                'clc.distance_clc_km', 'clc.travel_hours_minutes', 'clc.transport_mode', 'clc.mon', 'clc.tue', 'clc.wed', 'clc.thur', 'clc.fri', 'clc.sat', 'clc.sun',
                // User creation tracking
                'enrollment_alpha_tb.created_user_id',
            ])
            ->orderBy('enrollment_alpha_tb.enrollment_id', 'desc')
            ->paginate(10)
            ->appends($request->only(['status', 'search', 'section']));

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'users' => User::select('user_id', 'name', 'email_address', 'role_type')
                ->whereIn('role_type', ['CAI', 'Learner'])
                ->orderBy('user_id', 'desc')
                ->paginate(10),
            'enrollments' => $enrollments,
            'lists' => [
                'clcs' => \App\Models\Clc::withCount(['cais', 'learners'])
                    ->orderBy('clc_name')->get(['clc_id','clc_name','barangay']),
                'cais' => \App\Models\Cai::with(['clc:clc_id,clc_name'])
                    ->withCount('learners')
                    ->orderBy('lastname')->get(['cai_id','firstname','middlename','lastname','gender','assigned_clc','status']),
                'learners' => \App\Models\Learner::with(['cai:cai_id,firstname,lastname', 'clc:clc_id,clc_name'])
                    ->orderBy('fullname')->get(['learner_id','fullname','status','assigned_cai','assigned_clc']),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'info' => session('info'),
            ],
            'section' => $section,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update an enrollee's status.
     * Note: Admin updates do NOT modify fk_cai_id to preserve CAI tracking history
     */
    public function updateEnrollmentStatus(\Illuminate\Http\Request $request, int $enrollmentId)
    {
        $validated = $request->validate([
            'status' => ['required', \Illuminate\Validation\Rule::in(['Applied', 'Pre-enrolled', 'Enrolled'])],
        ]);

        // Admin updates only change status, preserving fk_cai_id for tracking
        $affected = \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)
            ->update(['enrollee_status' => $validated['status']]);

        return back()->with($affected ? 'success' : 'error', $affected ? 'Status updated.' : 'Update failed.');
    }

    /**
     * Create a user account for an enrolled enrollee and email credentials.
     */
    public function createEnrollmentUser(\Illuminate\Http\Request $request, int $enrollmentId)
    {
        $validated = $request->validate([
            'email_address' => ['required','email','max:255','unique:user_tb,email_address'],
            'password' => ['required','string','min:8'],
            'assigned_clc' => ['nullable','integer','exists:clc_tb,clc_id'],
            'assigned_cai' => ['nullable','integer','exists:cai_tb,cai_id'],
        ]);

        $alpha = \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)->firstOrFail();

        // Generate username: lastname_firstname0000
        $baseUsername = Str::of(($alpha->lastname ?? 'user').'_'.($alpha->firstname ?? 'als'))
            ->lower()
            ->replace(' ', '_')
            ->replace('__', '_');
        $rand = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $username = (string) $baseUsername.$rand;

        // Build full name for learner/mail greeting
        $fullName = trim(($alpha->firstname ?? '').' '.(($alpha->middlename ?? '') ? ($alpha->middlename.' ') : '').($alpha->lastname ?? ''));

        $user = \App\Models\User::create([
            'name' => $username,
            'email_address' => $validated['email_address'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role_type' => 'Learner',
        ]);

        // Persist created user ID on enrollment for fast lookup in dashboard
        try {
            \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)
                ->update(['created_user_id' => $user->user_id]);
        } catch (\Throwable $e) {
            Log::warning('Failed to set created_user_id on enrollment: '.$e->getMessage());
        }

        try {
            Mail::to($validated['email_address'])
                ->send(new EnrolledUserCreation($fullName !== '' ? $fullName : $username, $validated['email_address'], $validated['password']));
        } catch (\Throwable $e) {
            Log::error('Email send failed: '.$e->getMessage());
        }

        // Optionally create Learner row with assignments when provided
        try {
            if (!empty($validated['assigned_clc']) || !empty($validated['assigned_cai'])) {
                \App\Models\Learner::create([
                    'fk_userId' => $user->user_id,
                    'fullname' => $fullName !== '' ? $fullName : $username,
                    'assigned_clc' => $validated['assigned_clc'] ?? null,
                    'assigned_cai' => $validated['assigned_cai'] ?? null,
                    'status' => 'Active',
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Failed creating learner on enrollment user creation: '.$e->getMessage());
        }

        return back()->with('success', 'User account created and credentials sent.');
    }

    /**
     * Display reviewer management for Admin - File uploads and questionnaire statistics
     */
    public function reviewers()
    {

        // Get CLCs with their assigned CAIs and detailed questionnaire information
        $clcsWithStats = Clc::with([
            'cais' => function($query) {
                $query->with([
                    'questionnaires' => function($q) {
                        $q->with(['questions', 'subject']);
                    }
                ]);
            }
        ])
        ->get()
        ->map(function($clc) {
            $totalQuestionnaires = 0;
            $totalQuestions = 0;
            
            $caisData = $clc->cais->map(function($cai) use (&$totalQuestionnaires, &$totalQuestions) {
                $questionnairesCount = $cai->questionnaires->count();
                $questionsCount = $cai->questionnaires->sum(function($q) {
                    return $q->questions->count();
                });
                
                $totalQuestionnaires += $questionnairesCount;
                $totalQuestions += $questionsCount;
                
                return [
                    'cai_id' => $cai->cai_id,
                    'firstname' => $cai->firstname,
                    'lastname' => $cai->lastname,
                    'questionnaires_count' => $questionnairesCount,
                    'questions_count' => $questionsCount,
                    'questionnaires' => $cai->questionnaires->map(function($questionnaire) {
                        return [
                            'qn_id' => $questionnaire->qn_id,
                            'title' => $questionnaire->title,
                            'description' => $questionnaire->description,
                            'subject_name' => $questionnaire->subject->subject_name ?? 'N/A',
                            'time_duration' => $questionnaire->time_duration,
                            'questions_count' => $questionnaire->questions->count(),
                            'created_at' => $questionnaire->created_at->format('M d, Y')
                        ];
                    })
                ];
            });

            return [
                'clc_id' => $clc->clc_id,
                'clc_name' => $clc->clc_name,
                'barangay' => $clc->barangay,
                'total_cais' => $clc->cais->count(),
                'total_questionnaires' => $totalQuestionnaires,
                'total_questions' => $totalQuestions,
                'cais' => $caisData
            ];
        });

        $stats = [
            'total_cai_reviewers' => $clcsWithStats->sum('total_questionnaires'),
            'total_questionnaires' => $clcsWithStats->sum('total_questionnaires'),
            'total_questions' => $clcsWithStats->sum('total_questions'),
            'active_clcs' => $clcsWithStats->where('total_cais', '>', 0)->count()
        ];

        return Inertia::render('Admin/ReviewerManagement', [
            'clcsWithStats' => $clcsWithStats,
            'stats' => $stats
        ]);
    }

    /**
     * List assessments (Admin uploads of Pretest/Posttest files per CLC)
     */
    public function assessments()
    {
        $assessments = Assessment::with('clc')
            ->orderByDesc('created_at')
            ->get();
        $clcs = Clc::all();
        
        return Inertia::render('Admin/Assessments', [
            'assessments' => $assessments,
            'clcs' => $clcs,
            'stats' => [
                'total_assessments' => $assessments->count(),
                'total_clcs' => $clcs->count()
            ]
        ]);
    }

    /**
     * Store an assessment upload
     */
    public function storeAssessment(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assessment_type' => 'required|in:pretest,posttest',
            'schedule_date' => 'nullable|date',
            'clc_id' => 'required|exists:clc_tb,clc_id',
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480',
        ]);

        $path = $request->file('file')->store('assessments', 'public');

        Assessment::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'file_path' => $path,
            'assessment_type' => $data['assessment_type'],
            'schedule_date' => $data['schedule_date'] ?? null,
            'clc_id' => $data['clc_id'],
            'status' => 'active',
        ]);

        return back()->with('success', 'Assessment uploaded successfully.');
    }

    /**
     * Store a new reviewer/test
     */
    public function storeReviewer(Request $request)
    {
        $validated = $request->validate([
            'test_level' => 'required|in:reviewer',
            'fk_clc_id' => 'required|exists:clc_tb,clc_id',
            'posting_status' => 'nullable|in:draft,scheduled,posted,archived',
            'scheduled_post_at' => 'nullable|date',
        ]);

        $classwork = Classwork::create([
            'test_level' => 'reviewer',
            'fk_cai_id' => null,
            'fk_clc_id' => $validated['fk_clc_id'],
            'posting_status' => $validated['posting_status'] ?? 'draft',
            'scheduled_post_at' => $validated['scheduled_post_at'] ?? null,
        ]);

        return redirect()->route('admin.reviewers')->with('success', 'Reviewer created successfully.');
    }

    /**
     * Store questions for a reviewer/test
     */
    public function storeReviewerQuestions(Request $request)
    {
        $request->validate([
            'questionnaire_id' => 'required|exists:questionnaire_tb,qn_id',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.option_a' => 'required|string',
            'questions.*.option_b' => 'required|string',
            'questions.*.option_c' => 'required|string',
            'questions.*.option_d' => 'required|string',
            'questions.*.ans_key' => 'required|in:A,B,C,D',
        ]);

        // Verify questionnaire exists
        $questionnaire = Questionnaire::where('qn_id', $request->questionnaire_id)->first();
        if (!$questionnaire) {
            return back()->with('error', 'Questionnaire not found.');
        }

        // Create questions
        foreach ($request->questions as $questionData) {
            Question::create([
                'fk_qn_id' => $request->questionnaire_id,
                'question_text' => $questionData['question_text'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'ans_key' => $questionData['ans_key'],
            ]);
        }

        return redirect()->route('admin.assessments')->with('success', 'Assessment uploaded successfully.');
    }

    /**
     * Display Admin module management page
     */
    public function modules()
    {
        // Check if migration has been run by checking if column exists
        try {
            $modules = \App\Models\Modules::with(['clc', 'createdByAdmin'])
                ->whereNotNull('created_by_admin') // Only admin-created modules
                ->orderByDesc('created_at')
                ->get();
        } catch (\Exception $e) {
            // If migration hasn't been run, show all modules for now
            $modules = \App\Models\Modules::with(['cai'])
                ->orderByDesc('created_at')
                ->get();
        }

        $clcs = \App\Models\Clc::all();

        return Inertia::render('Admin/Modules', [
            'modules' => $modules,
            'clcs' => $clcs,
        ]);
    }

    /**
     * Store a new module and assign to CLC
     */
    public function storeModule(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'content_type' => 'required|in:file,text',
            'content' => 'required_if:content_type,text|string',
            'file' => 'required_if:content_type,file|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'fk_clc_id' => 'required|exists:clc_tb,clc_id',
        ]);

        $moduleData = [
            'subject' => $request->subject,
            'description' => $request->description,
            'content_type' => $request->content_type,
            'content' => $request->content_type === 'text' ? $request->content : null,
            'fk_clc_id' => $request->fk_clc_id,
            'assigned_at' => now(),
            'status' => 'active',
            'created_by_admin' => auth()->id(),
        ];

        // Create module first
        $module = \App\Models\Modules::create($moduleData);

        // Handle file upload if content type is file
        if ($request->content_type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $fileUploadService = new \App\Services\FileUploadService();
            
            // Validate file type for modules
            if (!$fileUploadService->validateFileForModel($file, 'App\Models\Modules')) {
                $module->delete(); // Clean up created module
                return redirect()->back()->withErrors(['file' => 'Invalid file type for modules. Only PDF, DOC, DOCX, PPT, and PPTX are allowed.']);
            }
            
            // Upload file and set reference
            $fileUploadService->uploadAndSetReference(
                $file,
                $module,
                'modules',
                'public',
                [
                    'description' => $request->description,
                    'subject' => $request->subject,
                    'clc_id' => $request->fk_clc_id,
                ]
            );
        }

        return redirect()->route('admin.modules')->with('success', 'Module uploaded and assigned successfully.');
    }

    // Note: Module deletion removed for data safety in ALS Center environment
    // Modules should be archived or marked inactive instead of permanently deleted

    /**
     * Upload reviewer material file (PDF/DOCX) and assign to CLC
     * Admin uploads materials only - no classwork creation
     */
    public function uploadReviewerFile(Request $request)
    {
        Log::info('uploadReviewerFile method called - Admin material upload only');
        
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480', // 20MB max
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fk_clc_id' => 'required|exists:clc_tb,clc_id',
        ]);

        try {
            $file = $request->file('file');
            $fileUploadService = new \App\Services\FileUploadService();
            
            // Validate file type
            if (!$fileUploadService->validateFileForModel($file, 'App\Models\Modules')) {
                return response()->json([
                    'message' => 'Invalid file type. Only PDF, DOC, and DOCX are allowed.'
                ], 422);
            }

            // Upload file as standalone reviewer material (similar to modules)
            $fileStorage = $fileUploadService->uploadFile(
                $file,
                'reviewer-materials',
                'public',
                [
                    'title' => $request->title,
                    'description' => $request->description,
                    'material_type' => 'reviewer',
                    'clc_id' => $request->fk_clc_id,
                ],
                $request->fk_clc_id // Associate with CLC
            );

            Log::info('Reviewer material uploaded successfully', [
                'file_id' => $fileStorage->id,
                'clc_id' => $request->fk_clc_id
            ]);

            return redirect()->route('admin.modules')->with('success', 'Reviewer material uploaded successfully');

        } catch (\Exception $e) {
            Log::error('Reviewer material upload failed', [
                'error' => $e->getMessage()
            ]);

            return redirect()->route('admin.modules')->withErrors(['error' => 'Failed to upload reviewer material: ' . $e->getMessage()]);
        }
    }

    /**
     * Update posting status of a test
     */
    public function updatePostingStatus(Request $request, $classworkId)
    {
        $request->validate([
            'posting_status' => 'required|in:draft,posted,scheduled,archived',
            'fk_clc_id' => 'nullable|exists:clc_tb,clc_id',
            'scheduled_post_at' => 'nullable|date|after:now',
            'available_until' => 'nullable|date|after:scheduled_post_at',
        ]);

        $classwork = Classwork::findOrFail($classworkId);
        
        // Verify this is an admin-created test
        if ($classwork->fk_cai_id !== null) {
            return response()->json(['error' => 'Cannot modify CAI-created tests'], 403);
        }

        $updateData = [
            'posting_status' => $request->posting_status,
            'fk_clc_id' => $request->fk_clc_id,
            'scheduled_post_at' => $request->scheduled_post_at,
            'available_until' => $request->available_until,
        ];

        // Set posted_at when status changes to posted
        if ($request->posting_status === 'posted' && $classwork->posting_status !== 'posted') {
            $updateData['posted_at'] = now();
        }

        $classwork->update($updateData);

        return response()->json(['message' => 'Posting status updated successfully']);
    }
}
