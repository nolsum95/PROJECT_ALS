<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Cai;
use App\Models\Clc;
use Inertia\Inertia;
use App\Models\Learner;
use App\Models\Modules;
use App\Models\Classwork;
use App\Models\Attendance;
use App\Models\Questionnaire;
use App\Models\Question;
use App\Models\Subject;
use App\Models\FileStorage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\LearnerAttempt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class CaiDashboardController extends Controller
{
    /**
     * Display the CAI (Community ALS Implementors) dashboard with statistics and overview
     */
    public function dashboard()
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return Inertia::render('CAI/Dashboard', [
                'auth' => ['user' => $user],
                'error' => 'CAI profile not found. Please contact your administrator.',
                'stats' => [
                    'totalLearners' => 0,
                    'totalClcs' => 0,
                    'modulesCreated' => 0,
                    'modulesAssigned' => 0,
                    'attendanceToday' => 0
                ]
            ]);
        }

        // Get learners assigned directly to this CAI
        $directlyAssignedLearners = Learner::where('assigned_cai', $cai->cai_id)->get();
        $directlyAssignedIds = $directlyAssignedLearners->pluck('learner_id');
        
        // Get learners under CAI's CLC
        $clcLearners = Learner::where('assigned_clc', $cai->assigned_clc)->get();
        $clcLearnerIds = $clcLearners->pluck('learner_id');

        // Count CLCs handled by this CAI
        $clcsHandled = Cai::where('cai_id', $cai->cai_id)->distinct('assigned_clc')->count();

        // Count modules created by this CAI
        $modulesCreated = Modules::where('fk_cai_id', $cai->cai_id)->count();

        // Today's attendance (use CLC learners for broader scope)
        $attendanceToday = Attendance::whereIn('learner_id', $clcLearnerIds)
            ->whereDate('attendance_date', Carbon::today())
            ->where('status', 'Present')
            ->count();

        // Get recent learners (last 10 learners under CAI's management)
        $recentLearners = Learner::where('assigned_clc', $cai->assigned_clc)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get recent modules created by this CAI
        $recentModules = Modules::where('fk_cai_id', $cai->cai_id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $stats = [
            'directlyAssignedLearners' => $directlyAssignedLearners->count(),
            'clcLearners' => $clcLearners->count(),
            'clcsHandled' => $clcsHandled,
            'totalClcs' => $clcsHandled,
            'modulesCreated' => $modulesCreated,
            'attendanceToday' => $attendanceToday
        ];

        return Inertia::render('CAI/Dashboard', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'stats' => $stats,
            'recentLearners' => $recentLearners,
            'recentModules' => $recentModules
        ]);
    }

    /**
     * Display CAI Exams creation page (Pretest/Posttest only)
     */
    public function exams(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $classworks = Classwork::where('fk_cai_id', $cai->cai_id)
            ->whereIn('test_level', ['pretest', 'posttest'])
            ->with(['questionnaires.questions', 'questionnaires.subject'])
            ->orderByDesc('created_at')
            ->get();

        $subjects = \App\Models\Subject::all();

        return Inertia::render('CAI/Exams', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'classworks' => $classworks,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Save CAI-created Exam (Pretest/Posttest)
     */
    public function storeExam(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'test_level' => 'required|in:pretest,posttest',
            'questionnaire.subject_id' => 'nullable|exists:subject_tb,subject_id',
            'questionnaire.title' => 'nullable|string|max:255',
            'questionnaire.description' => 'nullable|string',
            'questionnaire.time_duration' => 'nullable|integer|min:1|max:300',
            'available_at' => 'nullable|date',
            'scheduled_post_at' => 'nullable|date',
            'available_until' => 'nullable|date|after:available_at',
        ]);

        // Normalize datetime-local (assumed entered in Asia/Manila) to app timezone
        $tzInput = 'Asia/Manila';
        $appTz = config('app.timezone') ?: 'UTC';
        $availableAt = $request->available_at ? \Carbon\Carbon::parse($request->available_at, $tzInput)->setTimezone($appTz) : null;
        $scheduledPostAt = $request->scheduled_post_at ? \Carbon\Carbon::parse($request->scheduled_post_at, $tzInput)->setTimezone($appTz) : null;
        $availableUntil = $request->available_until ? \Carbon\Carbon::parse($request->available_until, $tzInput)->setTimezone($appTz) : null;

        $classwork = Classwork::create([
            'fk_cai_id' => $cai->cai_id,
            'test_level' => $request->test_level,
            // Exams default to draft just like reviewer classworks
            'posting_status' => 'draft',
            // Optional scheduling
            'scheduled_post_at' => $scheduledPostAt,
            'available_at' => $availableAt ?? $scheduledPostAt,
            'available_until' => $availableUntil,
        ]);

        if ($request->has('questionnaire') && ($request->questionnaire['subject_id'] ?? null) && ($request->questionnaire['title'] ?? null)) {
            \App\Models\Questionnaire::create([
                'fk_classwork_id' => $classwork->classwork_id,
                'fk_subject_id' => $request->questionnaire['subject_id'],
                'title' => $request->questionnaire['title'],
                'description' => $request->questionnaire['description'] ?? '',
                'time_duration' => $request->questionnaire['time_duration'] ?? 30,
            ]);
        }

        return redirect()->route('cai.exams')->with('success', 'Exam created successfully!');
    }

    /**
     * Store questions for CAI-created Exam
     */
    public function storeExamQuestions(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

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

        // Verify questionnaire belongs to a classwork owned by this CAI
        $questionnaire = \App\Models\Questionnaire::where('qn_id', $request->questionnaire_id)
            ->whereHas('classwork', function($query) use ($cai) {
                $query->where('fk_cai_id', $cai->cai_id);
            })
            ->first();

        if (!$questionnaire) {
            return back()->with('error', 'Unauthorized access to questionnaire.');
        }

        // Create questions
        foreach ($request->questions as $questionData) {
            \App\Models\Question::create([
                'fk_qn_id' => $request->questionnaire_id,
                'question_text' => $questionData['question_text'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'ans_key' => $questionData['ans_key'],
            ]);
        }

        return redirect()->route('cai.exams')->with('success', 'Questions added successfully!');
    }

    /**
     * Display CAI's assigned learners with profile and reports functionality
     */
    public function learners(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

        // Get learners assigned directly to this CAI
        $query = Learner::where('assigned_cai', $cai->cai_id);

        // Apply search filter
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('fullname', 'like', '%' . $request->search . '%')
                  ->orWhere('learner_re_no', 'like', '%' . $request->search . '%');
            });
        }

        // Apply status filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $learners = $query->paginate(15);

        // Add comprehensive data for each learner
        $learners->getCollection()->transform(function ($learner) {
            // Module progress - removed since we no longer track module assignments
            $completedModules = 0;
            $inProgressModules = 0;
            $totalModules = 0;
            
            // Attendance data
            $totalAttendance = Attendance::where('learner_id', $learner->learner_id)->count();
            $presentDays = Attendance::where('learner_id', $learner->learner_id)
                ->where('status', 'Present')
                ->count();
            
            $learner->progress = $totalModules > 0 ? round(($completedModules / $totalModules) * 100, 1) : 0;
            $learner->completedModules = $completedModules;
            $learner->inProgressModules = $inProgressModules;
            $learner->totalModules = $totalModules;
            $learner->attendanceRate = $totalAttendance > 0 ? round(($presentDays / $totalAttendance) * 100, 1) : 0;
            $learner->totalAttendanceDays = $totalAttendance;
            $learner->presentDays = $presentDays;
            
            return $learner;
        });

        return Inertia::render('CAI/Learners', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'learners' => $learners,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => Learner::where('assigned_cai', $cai->cai_id)->count(),
                'active' => Learner::where('assigned_cai', $cai->cai_id)->where('status', 'Active')->count(),
                'inactive' => Learner::where('assigned_cai', $cai->cai_id)->where('status', 'Inactive')->count(),
                'highPerformers' => 0, // Removed module-based performance tracking
            ]
        ]);
    }

    /**
     * Get detailed learner profile with personal info, module assignments, attendance history
     */
    public function learnerProfile($learnerId)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

        $learner = Learner::where('learner_id', $learnerId)
            ->where('assigned_clc', $cai->assigned_clc)
            ->firstOrFail();

        // Module assignments removed - no longer tracking module assignments
        $moduleAssignments = collect();

        // Get attendance history (last 30 days)
        $attendanceHistory = Attendance::where('learner_id', $learnerId)
            ->orderBy('attendance_date', 'desc')
            ->limit(30)
            ->get();

        // Calculate statistics - removed module tracking
        $completedModules = 0;
        $totalModules = 0;
        $progress = $totalModules > 0 ? round(($completedModules / $totalModules) * 100, 1) : 0;
        
        $totalAttendance = $attendanceHistory->count();
        $presentDays = $attendanceHistory->where('status', 'Present')->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentDays / $totalAttendance) * 100, 1) : 0;

        return Inertia::render('CAI/LearnerProfile', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'learner' => $learner,
            'moduleAssignments' => $moduleAssignments,
            'attendanceHistory' => $attendanceHistory,
            'stats' => [
                'progress' => $progress,
                'completedModules' => $completedModules,
                'totalModules' => $totalModules,
                'attendanceRate' => $attendanceRate,
                'presentDays' => $presentDays,
                'totalAttendanceDays' => $totalAttendance
            ]
        ]);
    }

    /**
     * Display attendance management with Mark Attendance, Records view, and Reports
     */
    public function attendance(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

        $selectedDate = $request->date ? Carbon::parse($request->date) : Carbon::today();
        $view = $request->view ?? 'mark'; // mark, records, reports
        
        // Get learners assigned to this CAI
        $learners = Learner::where('assigned_cai', $cai->cai_id)->get();
        $learnerIds = $learners->pluck('learner_id');
        
        if ($view === 'mark') {
            // Mark Attendance View - daily input for present/absent/excused with remarks
            $attendanceRecords = Attendance::whereIn('learner_id', $learnerIds)
                ->whereDate('attendance_date', $selectedDate)
                ->get()
                ->keyBy('learner_id');

            $learnersWithAttendance = $learners->map(function ($learner) use ($attendanceRecords) {
                $attendance = $attendanceRecords->get($learner->learner_id);
                return [
                    'learner' => $learner,
                    'attendance' => $attendance,
                    'status' => $attendance ? $attendance->status : null,
                    'remarks' => $attendance ? $attendance->remarks : null
                ];
            });

            $stats = [
                'present' => $attendanceRecords->where('status', 'Present')->count(),
                'absent' => $attendanceRecords->where('status', 'Absent')->count(),
                'excused' => $attendanceRecords->where('status', 'Excused')->count(),
                'total' => $learners->count()
            ];

            return Inertia::render('CAI/Attendance', [
                'auth' => ['user' => $user],
                'cai' => $cai,
                'view' => $view,
                'learners' => $learnersWithAttendance,
                'selectedDate' => $selectedDate->format('Y-m-d'),
                'stats' => $stats
            ]);
        }
        
        if ($view === 'records') {
            // Attendance Records View - review past attendance
            $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subDays(30);
            $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();
            
            $attendanceRecords = Attendance::whereIn('learner_id', $learnerIds)
                ->whereBetween('attendance_date', [$startDate, $endDate])
                ->with('learner')
                ->orderBy('attendance_date', 'desc')
                ->paginate(50);

            return Inertia::render('CAI/Attendance', [
                'auth' => ['user' => $user],
                'cai' => $cai,
                'view' => $view,
                'attendanceRecords' => $attendanceRecords,
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d')
            ]);
        }
        
        if ($view === 'reports') {
            // Attendance Reports View - summaries (monthly %, per learner)
            $month = $request->month ? Carbon::parse($request->month) : Carbon::now();
            $startOfMonth = $month->copy()->startOfMonth();
            $endOfMonth = $month->copy()->endOfMonth();
            
            // Monthly attendance summary per learner
            $learnerReports = $learners->map(function ($learner) use ($startOfMonth, $endOfMonth) {
                $totalDays = Attendance::where('learner_id', $learner->learner_id)
                    ->whereBetween('attendance_date', [$startOfMonth, $endOfMonth])
                    ->count();
                    
                $presentDays = Attendance::where('learner_id', $learner->learner_id)
                    ->whereBetween('attendance_date', [$startOfMonth, $endOfMonth])
                    ->where('status', 'Present')
                    ->count();
                    
                $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;
                
                return [
                    'learner' => $learner,
                    'totalDays' => $totalDays,
                    'presentDays' => $presentDays,
                    'attendanceRate' => $attendanceRate
                ];
            });
            
            // Overall monthly statistics
            $monthlyStats = [
                'totalLearners' => $learners->count(),
                'averageAttendanceRate' => $learnerReports->avg('attendanceRate'),
                'highAttendance' => $learnerReports->where('attendanceRate', '>=', 90)->count(),
                'lowAttendance' => $learnerReports->where('attendanceRate', '<', 70)->count()
            ];

            return Inertia::render('CAI/Attendance', [
                'auth' => ['user' => $user],
                'cai' => $cai,
                'view' => $view,
                'learnerReports' => $learnerReports,
                'monthlyStats' => $monthlyStats,
                'selectedMonth' => $month->format('Y-m')
            ]);
        }
    }

    /**
     * Store or update attendance record
     */
    public function storeAttendance(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

        $request->validate([
            'learner_id' => 'required|exists:learner_tb,learner_id',
            'attendance_date' => 'required|date',
            'attendance_status' => 'required|in:Present,Absent,Late,Excused',
            'attendance_remarks' => 'nullable|string|max:255'
        ]);

        // Get the learner to find their assigned CLC
        $learner = Learner::findOrFail($request->learner_id);
        
        Attendance::updateOrCreate([
            'learner_id' => $request->learner_id,
            'attendance_date' => $request->attendance_date
        ], [
            'cai_id' => $cai->cai_id,
            'clc_id' => $learner->assigned_clc,
            'status' => $request->attendance_status,
            'remarks' => $request->attendance_remarks
        ]);

        return back()->with('success', 'Attendance updated successfully.');
    }

    /**
     * Display modules assigned to CAI's CLC
     */
    public function modules(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        // Get modules assigned to this CAI's CLC
        try {
            // Try new schema first (after migration)
            $modules = Modules::with(['clc', 'createdByAdmin'])
                ->where('fk_clc_id', $cai->assigned_clc)
                ->where('status', 'active')
                ->whereNotNull('created_by_admin') // Only admin-created modules
                ->orderByDesc('assigned_at')
                ->get();
        } catch (\Exception $e) {
            // Fallback to old schema (before migration)
            $modules = Modules::where('fk_cai_id', $cai->cai_id)
                ->orderByDesc('created_at')
                ->get();
        }

        // Get reviewer materials uploaded by admin for this CLC (from file storage)
        $reviewerMaterials = FileStorage::with(['clc', 'uploadedBy'])
            ->where(function($query) use ($cai) {
                $query->where('fk_clc_id', $cai->assigned_clc)
                      ->orWhereNull('fk_clc_id'); // Global materials
            })
            ->whereJsonContains('metadata->material_type', 'reviewer')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('CAI/Modules', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'modules' => $modules,
            'reviewerMaterials' => $reviewerMaterials,
        ]);
    }

    /**
     * Download a module file
     */
    public function downloadModule($moduleId)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

        // Verify module access
        try {
            // Try new schema first (after migration)
            $module = Modules::where('module_id', $moduleId)
                ->where('fk_clc_id', $cai->assigned_clc)
                ->where('status', 'active')
                ->first();
        } catch (\Exception $e) {
            // Fallback to old schema (before migration)
            $module = Modules::where('module_id', $moduleId)
                ->where('fk_cai_id', $cai->cai_id)
                ->first();
        }

        if (!$module) {
            return back()->with('error', 'Module not found or not accessible.');
        }

        if (!$module->file_path || !Storage::disk('public')->exists($module->file_path)) {
            return back()->with('error', 'Module file not found.');
        }

        return Storage::disk('public')->download($module->file_path, $module->file_name);
    }

    /**
     * Store a new module
     */
    public function storeModule(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'content_type' => 'required|in:text,file,mixed',
            'content' => 'required_if:content_type,text,mixed|nullable|string',
            'file' => 'required_if:content_type,file,mixed|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif,txt,ppt,pptx|max:10240', // 10MB max
        ]);

        $moduleData = [
            'fk_cai_id' => $cai->cai_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'content_type' => $request->content_type,
            'content' => $request->content ?? '',
        ];

        // Handle file upload if present
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('', $fileName, 'modules');
            
            $moduleData['file_path'] = $filePath;
            $moduleData['file_name'] = $file->getClientOriginalName();
            $moduleData['file_type'] = $file->getClientOriginalExtension();
            $moduleData['file_size'] = $file->getSize();
        }

        Modules::create($moduleData);

        return redirect()->route('cai.modules')->with('success', 'Module created successfully!');
    }

    /**
     * Assign module to learners
     */
    public function assignModule(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'module_id' => 'required|exists:modules_tb,module_id',
            'learner_ids' => 'required|array',
            'learner_ids.*' => 'exists:learner_tb,learner_id',
        ]);

        // Verify module belongs to this CAI
        $module = Modules::where('module_id', $request->module_id)
            ->where('fk_cai_id', $cai->cai_id)
            ->first();

        if (!$module) {
            return redirect()->route('cai.modules')->with('error', 'Module not found or access denied.');
        }

        // Module assignment functionality removed
        // This endpoint is no longer used as we don't track module assignments
        return redirect()->route('cai.modules')->with('error', 'Module assignment feature has been removed.');
    }

    /**
     * Display reports and analytics
     */
    public function reports(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return redirect()->route('login')->with('error', 'CAI profile not found.');
        }

        $assignedLearners = Learner::where('assigned_cai', $cai->cai_id)->get();
        $learnerIds = $assignedLearners->pluck('learner_id');

        // Attendance report
        $attendanceReport = [];
        $last30Days = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $presentCount = Attendance::whereIn('learner_id', $learnerIds)
                ->whereDate('attendance_date', $date)
                ->where('status', 'Present')
                ->count();
            
            $attendanceReport[] = [
                'date' => $date->format('Y-m-d'),
                'present' => $presentCount,
                'total' => $learnerIds->count(),
            ];
        }

        // Module completion report - only modules created by this CAI (removed assignment tracking)
        $caiModules = Modules::where('fk_cai_id', $cai->cai_id)->get();
        $moduleReport = $caiModules->map(function ($module) {
            // Removed module assignment tracking
            $totalAssigned = 0;
            $completed = 0;
            
            return [
                'module' => $module,
                'completed' => $completed,
                'total' => $totalAssigned,
                'percentage' => $totalAssigned > 0 ? round(($completed / $totalAssigned) * 100, 1) : 0,
            ];
        });

        // Learner performance report (removed module tracking)
        $performanceReport = $assignedLearners->map(function ($learner) use ($cai) {
            // Removed module assignment tracking
            $totalAssignedModules = 0;
            $completedModules = 0;
            
            $attendanceCount = Attendance::where('learner_id', $learner->learner_id)
                ->where('status', 'Present')
                ->whereMonth('attendance_date', Carbon::now()->month)
                ->count();
            
            $totalAttendanceDays = Attendance::where('learner_id', $learner->learner_id)
                ->whereMonth('attendance_date', Carbon::now()->month)
                ->count();
            
            $attendancePercentage = $totalAttendanceDays > 0 ? round(($attendanceCount / $totalAttendanceDays) * 100, 1) : 0;
            
            return [
                'learner' => $learner,
                'completedModules' => $completedModules,
                'totalModules' => $totalAssignedModules,
                'monthlyAttendance' => $attendanceCount,
                'attendancePercentage' => $attendancePercentage,
                'progress' => $totalAssignedModules > 0 ? round(($completedModules / $totalAssignedModules) * 100, 1) : 0,
            ];
        });

        return Inertia::render('CAI/Reports', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'attendanceReport' => $attendanceReport,
            'moduleReport' => $moduleReport,
            'performanceReport' => $performanceReport,
        ]);
    }

    /**
     * Display enrollment management for CAI
     */
    public function enrollments(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        // Get enrollments for CAI's assigned CLC area
        $enrollmentQuery = \App\Models\EnrollmentAlpha::query()
            ->leftJoin('enrollment_address_tb as addr', 'addr.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_guardian_tb as gu', 'gu.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_information_tb as info', 'info.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('enrollment_pwd_tb as pwd', 'pwd.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('household_status_tb as hh', 'hh.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('distance_availability_tb as clc', 'clc.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
            ->leftJoin('user_tb as u', 'u.email_address', '=', 'enrollment_alpha_tb.email_address');

        // Filter by CAI's CLC area if needed (you may want to add location-based filtering)
        // For now, show all enrollments but CAI can only manage those in their area

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
                  ->orWhere('enrollment_alpha_tb.mobile_no', 'like', "%$search%");
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
                // Address
                'addr.cur_house_no',
                'addr.cur_streetname',
                'addr.cur_barangay',
                'addr.cur_municipality',
                'addr.cur_province',
                'addr.cur_zip_code',
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
                'clc.distance_clc_km', 'clc.travel_hours_minutes', 'clc.transport_mode',
                // User creation tracking
                'enrollment_alpha_tb.created_user_id',
            ])
            ->orderBy('enrollment_alpha_tb.enrollment_id', 'desc')
            ->paginate(10)
            ->appends($request->only(['status', 'search']));

        // Get available CAIs in the same CLC for assignment
        $availableCais = Cai::where('assigned_clc', $cai->assigned_clc)
            ->orderBy('lastname')
            ->get(['cai_id', 'firstname', 'middlename', 'lastname']);

        return Inertia::render('CAI/Enrollments', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'enrollments' => $enrollments,
            'availableCais' => $availableCais,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update enrollment status (CAI can manage enrollments in their area)
     */
    public function updateEnrollmentStatus(Request $request, $enrollmentId)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'status' => 'required|in:Applied,Pre-enrolled,Enrolled',
        ]);

        // Update status and set fk_cai_id to track who updated it
        $affected = \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)
            ->update([
                'enrollee_status' => $request->status,
                'fk_cai_id' => $cai->cai_id  // Track which CAI updated this enrollment
            ]);

        return back()->with($affected ? 'success' : 'error', 
            $affected ? 'Enrollment status updated successfully!' : 'Failed to update status.');
    }

    /**
     * Get real-time enrollment status for conflict prevention
     */
    public function getEnrollmentStatus(Request $request, $enrollmentId)
    {
        $enrollment = \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)
            ->select('enrollee_status', 'updated_at')
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Enrollment not found'], 404);
        }

        return response()->json([
            'status' => $enrollment->enrollee_status,
            'updated_at' => $enrollment->updated_at->toISOString()
        ]);
    }

    /**
     * Display classwork management for CAI
     */
    public function classwork(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return redirect()->route('dashboard');
        }

        // Get reviewer classwork created by this CAI (exclude exams)
        $classworks = Classwork::where('fk_cai_id', $cai->cai_id)
            ->where('test_level', 'reviewer')
            ->with(['questionnaires.subject', 'questionnaires.questions'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get available subjects
        $subjects = \App\Models\Subject::all();

        // Count unique learners who have completed reviewer attempts for this CAI
        $reviewerSuccessCount = LearnerAttempt::whereNotNull('completed_at')
            ->whereHas('classwork', function($q) use ($cai) {
                $q->where('fk_cai_id', $cai->cai_id)
                  ->where('test_level', 'reviewer');
            })
            ->distinct('fk_learner_id')
            ->count('fk_learner_id');

        return Inertia::render('CAI/Classwork', [
            'auth' => ['user' => $user],
            'cai' => $cai,
            'classworks' => $classworks,
            'subjects' => $subjects,
            'reviewerSuccessCount' => $reviewerSuccessCount,
            'view' => $request->get('view', 'list')
        ]);
    }

    /**
     * Store a new classwork
     */
    public function storeClasswork(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'test_level' => 'required|in:reviewer,pretest,posttest',
            'test_title' => 'required|string|max:255',
            'test_description' => 'nullable|string',
            // Validate questionnaire fields if provided
            'questionnaire.subject_id' => 'nullable|exists:subject_tb,subject_id',
            'questionnaire.title' => 'nullable|string|max:255',
            'questionnaire.description' => 'nullable|string',
            'questionnaire.time_duration' => 'nullable|integer|min:1|max:300',
        ]);

        // Create the classwork with default 'draft' status
        $classwork = Classwork::create([
            'fk_cai_id' => $cai->cai_id,
            'fk_clc_id' => $cai->assigned_clc,
            'test_level' => $request->test_level,
            'test_title' => $request->test_title,
            'test_description' => $request->test_description,
            'posting_status' => 'draft', // Default to draft status
        ]);

        // If questionnaire data is provided, create the questionnaire
        if ($request->has('questionnaire') && $request->questionnaire['subject_id'] && $request->questionnaire['title']) {
            \App\Models\Questionnaire::create([
                'fk_classwork_id' => $classwork->classwork_id,
                'fk_subject_id' => $request->questionnaire['subject_id'],
                'title' => $request->questionnaire['title'],
                'description' => $request->questionnaire['description'] ?? '',
                'time_duration' => $request->questionnaire['time_duration'] ?? 30,
            ]);
        }

        return redirect()->route('cai.classwork')->with('success', 'Reviewer classwork created successfully!');
    }

    /**
     * Store a new questionnaire for classwork
     */
    public function storeQuestionnaire(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();

        if (!$cai) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'classwork_id' => 'required|exists:classwork_tb,classwork_id',
            'subject_id' => 'required|exists:subject_tb,subject_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'time_duration' => 'required|integer|min:1|max:300', // 1-300 minutes
        ]);

        // Verify classwork belongs to this CAI
        $classwork = Classwork::where('classwork_id', $request->classwork_id)
            ->where('fk_cai_id', $cai->cai_id)
            ->first();

        if (!$classwork) {
            return back()->with('error', 'Unauthorized access to classwork.');
        }

        $questionnaire = \App\Models\Questionnaire::create([
            'fk_classwork_id' => $request->classwork_id,
            'fk_subject_id' => $request->subject_id,
            'title' => $request->title,
            'description' => $request->description,
            'time_duration' => $request->time_duration,
        ]);

        return redirect()->route('cai.classwork')->with('success', 'Questionnaire created successfully!')
            ->with('questionnaire', $questionnaire);
    }

    /**
     * Store questions for a questionnaire
     */
    public function storeQuestions(Request $request)
    {
        $user = Auth::user();
        $cai = Cai::where('fk_userId', $user->user_id)->first();
        
        if (!$cai) {
            return back()->with('error', 'CAI profile not found.');
        }

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

        // Verify questionnaire belongs to this CAI through classwork
        $questionnaire = \App\Models\Questionnaire::whereHas('classwork', function($query) use ($cai) {
            $query->where('fk_cai_id', $cai->cai_id);
        })->where('qn_id', $request->questionnaire_id)->first();

        if (!$questionnaire) {
            return back()->with('error', 'Unauthorized access to questionnaire.');
        }

        // Create questions
        foreach ($request->questions as $questionData) {
            \App\Models\Question::create([
                'fk_qn_id' => $request->questionnaire_id,
                'question_text' => $questionData['question_text'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'ans_key' => $questionData['ans_key'],
            ]);
        }

        return redirect()->route('cai.classwork')->with('success', 'Questions added successfully!');
    }

    /**
     * Display reviewer monitoring for CAI
     */
    public function reviewers()
    {
        $cai = auth()->user()->cai;
        
        if (!$cai) {
            return Inertia::render('CAI/ReviewerMonitoring', [
                'reviewers' => [],
                'stats' => [
                    'total_reviewers' => 0,
                    'total_pretests' => 0,
                    'total_posttests' => 0,
                    'total_questions' => 0,
                    'clc_name' => 'No CLC Assigned'
                ],
                'subjects' => []
            ]);
        }
        
        $clcId = $cai->assigned_clc;

        // Get both admin-created materials AND CAI-created reviewers for this CLC
        $reviewers = Classwork::with(['questionnaires.questions', 'questionnaires.subject', 'clc', 'fileStorage'])
            ->where(function($query) use ($cai, $clcId) {
                // Admin-created tests for this CLC
                $query->where(function($q) use ($clcId) {
                    $q->whereNull('fk_cai_id')
                      ->where(function($subQ) use ($clcId) {
                          $subQ->where('fk_clc_id', $clcId)
                               ->orWhereNull('fk_clc_id');
                      })
                      ->whereIn('posting_status', ['posted', 'draft']);
                })
                // OR CAI-created reviewers by this CAI
                ->orWhere(function($q) use ($cai) {
                    $q->where('fk_cai_id', $cai->cai_id)
                      ->where('test_level', 'reviewer');
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_reviewers' => $reviewers->where('test_level', 'reviewer')->count(),
            'total_pretests' => $reviewers->where('test_level', 'pretest')->count(),
            'total_posttests' => $reviewers->where('test_level', 'posttest')->count(),
            'total_questions' => $reviewers->sum(function($reviewer) {
                return $reviewer->questionnaires->sum(function($questionnaire) {
                    return $questionnaire->questions->count();
                });
            }),
            'clc_name' => $cai->clc->clc_name ?? 'Unknown CLC'
        ];

        // Get available subjects for questionnaire creation
        $subjects = Subject::all();

        return Inertia::render('CAI/ReviewerMonitoring', [
            'reviewers' => $reviewers,
            'stats' => $stats,
            'subjects' => $subjects
        ]);
    }

    /**
     * Create a questionnaire for an admin-created test
     */
    public function storeReviewerQuestionnaire(Request $request)
    {
        $validated = $request->validate([
            'classwork_id' => 'required|exists:classwork_tb,classwork_id',
            'subject_id' => 'required|exists:subject_tb,subject_id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_duration' => 'required|integer|min:1|max:300'
        ]);

        // Verify the classwork belongs to admin and is for this CAI's CLC
        $cai = auth()->user()->cai;
        
        if (!$cai) {
            return redirect()->route('cai.classwork')->withErrors(['error' => 'CAI record not found']);
        }
        
        $classwork = Classwork::where('classwork_id', $validated['classwork_id'])
            ->where(function($query) use ($cai) {
                // Allow both admin-created and CAI-created classworks
                $query->where(function($q) use ($cai) {
                    // Admin-created for this CLC
                    $q->whereNull('fk_cai_id')
                      ->where(function($subQ) use ($cai) {
                          $subQ->where('fk_clc_id', $cai->assigned_clc)
                               ->orWhereNull('fk_clc_id');
                      });
                })->orWhere(function($q) use ($cai) {
                    // CAI-created by this CAI
                    $q->where('fk_cai_id', $cai->cai_id);
                });
            })
            ->firstOrFail();

        $questionnaire = Questionnaire::create([
            'fk_classwork_id' => $validated['classwork_id'],
            'fk_subject_id' => $validated['subject_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_duration' => $validated['time_duration']
        ]);

        return redirect()->route('cai.classwork')->with('success', 'Questionnaire created successfully!');
    }

    /**
     * Add questions to a questionnaire
     */
    public function storeReviewerQuestions(Request $request)
    {
        $validated = $request->validate([
            'questionnaire_id' => 'required|exists:questionnaire_tb,qn_id',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.option_a' => 'required|string',
            'questions.*.option_b' => 'required|string',
            'questions.*.option_c' => 'required|string',
            'questions.*.option_d' => 'required|string',
            'questions.*.ans_key' => 'required|in:A,B,C,D'
        ]);

        // Verify the questionnaire belongs to a test accessible by this CAI
        $cai = auth()->user()->cai;
        
        if (!$cai) {
            return redirect()->route('cai.classwork')->withErrors(['error' => 'CAI record not found']);
        }
        
        $questionnaire = Questionnaire::with('classwork')
            ->where('qn_id', $validated['questionnaire_id'])
            ->whereHas('classwork', function($query) use ($cai) {
                // Allow both admin-created and CAI-created classworks
                $query->where(function($q) use ($cai) {
                    // Admin-created for this CLC
                    $q->whereNull('fk_cai_id')
                      ->where(function($subQ) use ($cai) {
                          $subQ->where('fk_clc_id', $cai->assigned_clc)
                               ->orWhereNull('fk_clc_id');
                      });
                })->orWhere(function($q) use ($cai) {
                    // CAI-created by this CAI
                    $q->where('fk_cai_id', $cai->cai_id);
                });
            })
            ->firstOrFail();

        $createdQuestions = [];
        foreach ($validated['questions'] as $questionData) {
            $question = Question::create([
                'fk_qn_id' => $validated['questionnaire_id'],
                'question_text' => $questionData['question_text'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'ans_key' => $questionData['ans_key']
            ]);
            $createdQuestions[] = $question;
        }

        return redirect()->route('cai.classwork')->with('success', count($createdQuestions) . ' questions added successfully!');
    }

    /**
     * Post classwork to make it visible to learners
     */
    public function postClasswork(Request $request)
    {
        $validated = $request->validate([
            'classwork_id' => 'required|exists:classwork_tb,classwork_id'
        ]);

        $cai = auth()->user()->cai;
        
        if (!$cai) {
            return back()->withErrors(['error' => 'CAI record not found']);
        }

        // Find the classwork and verify it belongs to this CAI
        $classwork = Classwork::where('classwork_id', $validated['classwork_id'])
            ->where('fk_cai_id', $cai->cai_id)
            ->first();

        if (!$classwork) {
            return back()->withErrors(['error' => 'Classwork not found or access denied']);
        }

        // Check if classwork has questions
        $hasQuestions = $classwork->questionnaires()
            ->whereHas('questions')
            ->exists();

        if (!$hasQuestions) {
            return back()->withErrors(['error' => 'Cannot post classwork without questions. Please add questions first.']);
        }

        // Update posting status to 'posted'
        $classwork->update([
            'posting_status' => 'posted',
            'posted_at' => now()
        ]);

        return back()->with('success', 'Classwork posted successfully! It is now visible to learners.');
    }

    /**
     * Archive classwork to hide it from learners
     */
    public function archiveClasswork(Request $request)
    {
        $validated = $request->validate([
            'classwork_id' => 'required|exists:classwork_tb,classwork_id'
        ]);

        $cai = auth()->user()->cai;
        
        if (!$cai) {
            return back()->withErrors(['error' => 'CAI record not found']);
        }

        // Find the classwork and verify it belongs to this CAI
        $classwork = Classwork::where('classwork_id', $validated['classwork_id'])
            ->where('fk_cai_id', $cai->cai_id)
            ->first();

        if (!$classwork) {
            return back()->withErrors(['error' => 'Classwork not found or access denied']);
        }

        // Update posting status to 'archived'
        $classwork->update([
            'posting_status' => 'archived',
            'archived_at' => now()
        ]);

        return back()->with('success', 'Classwork archived successfully! It is now hidden from learners.');
    }

    /**
     * Download admin-uploaded file
     */
    public function downloadFile($classworkId)
    {
        $cai = auth()->user()->cai;
        
        if (!$cai) {
            abort(404, 'CAI record not found');
        }
        
        // Verify the classwork belongs to admin and is for this CAI's CLC
        $classwork = Classwork::with('fileStorage')
            ->where('classwork_id', $classworkId)
            ->whereNull('fk_cai_id') // Admin-created only
            ->where(function($query) use ($cai) {
                $query->where('fk_clc_id', $cai->assigned_clc)
                      ->orWhereNull('fk_clc_id');
            })
            ->firstOrFail();

        if (!$classwork->fileStorage) {
            abort(404, 'File not found');
        }

        $fileStorage = $classwork->fileStorage;
        $filePath = storage_path('app/' . $fileStorage->storage_disk . '/' . $fileStorage->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'File not found on disk');
        }

        return response()->download($filePath, $fileStorage->original_name);
    }

    /**
     * Download file by FileStorage ID (for reviewer materials)
     */
    public function downloadFileStorage($fileId)
    {
        $cai = auth()->user()->cai;
        
        if (!$cai) {
            abort(404, 'CAI record not found');
        }
        
        // Direct FileStorage download for reviewer materials
        $fileStorage = FileStorage::with('clc')
            ->where('id', $fileId)
            ->where(function($query) use ($cai) {
                $query->where('fk_clc_id', $cai->assigned_clc)
                      ->orWhereNull('fk_clc_id'); // Global materials
            })
            ->firstOrFail();

        $filePath = storage_path('app/' . $fileStorage->storage_disk . '/' . $fileStorage->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'File not found on disk');
        }

        return response()->download($filePath, $fileStorage->original_name);
    }
}
