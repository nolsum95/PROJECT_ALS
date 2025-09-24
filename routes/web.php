<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CaiController;
use App\Http\Controllers\ClcController;
use App\Http\Controllers\SubjectController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LearnerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CaiDashboardController;

Route::get('/', function () {
    return Inertia::render('Guest/HomePage');
});

Route::get('/enroll', function () {
    return Inertia::render('Guest/EnrollmentPage');
})->name('enrollment.page');
Route::post('/enroll', [\App\Http\Controllers\EnrollmentGuestController::class, 'store'])->name('enrollment.store');
Route::get('/enrollment/receipt', function () {
    $enrollmentData = json_decode(request('enrollmentData'), true);
    return Inertia::render('Guest/ReceiptPage', [
        'enrollmentData' => $enrollmentData
    ]);
})->name('enrollment.receipt');

// Redirect old dashboard route to admin dashboard
Route::get('/dashboard', function () {
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }
    switch ($user->role_type) {
        case 'Admin':
            return redirect()->route('admin.dashboard');
        case 'Cai':
            return redirect()->route('cai.dashboard');
        case 'Learner':
            return redirect()->route('learner.dashboard');
        default:
            return redirect('/'); // or a generic dashboard
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin routes
Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {
    Route::get('/admin/dashboard', function() {
        $section = request('section', 'dashboard');
        return app(\App\Http\Controllers\AdminController::class)->dashboard(request(), $section);
    })->name('admin.dashboard');
    Route::post('/admin/enrollments/{enrollmentId}/status', [AdminController::class, 'updateEnrollmentStatus'])->name('admin.enrollments.updateStatus');
    Route::post('/admin/enrollments/{enrollmentId}/create-user', [AdminController::class, 'createEnrollmentUser'])->name('admin.enrollments.createUser');
    Route::get('/admin/enrollments', function() {
        return app(\App\Http\Controllers\AdminController::class)->dashboard(request(), 'enrollments');
    })->name('enrollments.index');
    
    // CLC Management
    Route::get('/admin/clcs', [ClcController::class, 'index'])->name('clc.index');
    Route::post('/admin/clcs', [ClcController::class, 'store'])->name('clc.store');
    Route::put('/admin/clcs/{clcId}', [ClcController::class, 'update'])->name('clc.update');
    Route::get('/admin/clcs/{clcId}', [ClcController::class, 'show'])->name('clc.show');
    Route::post('/admin/clcs/{clcId}/assign-cais', [ClcController::class, 'assignCais'])->name('clc.assignCais');
    Route::post('/admin/clcs/{clcId}/assign-learners', [ClcController::class, 'assignLearners'])->name('clc.assignLearners');
    Route::get('/admin/clcs/reports/summary', [ClcController::class, 'reports'])->name('clc.reports');

    // CAIs
    Route::get('/admin/cais', [CaiController::class, 'index'])->name('cai.index');
    Route::post('/admin/cais', [CaiController::class, 'store'])->name('cai.store');
    Route::put('/admin/cais/{caiId}', [CaiController::class, 'update'])->name('cai.update');
    Route::get('/admin/cais/{caiId}', [CaiController::class, 'show'])->name('cai.show');
    Route::post('/admin/cais/{caiId}/status', [CaiController::class, 'updateStatus'])->name('cai.updateStatus');

    // Learners
    Route::get('/admin/learners', [LearnerController::class, 'index'])->name('learner.index');
    Route::post('/admin/learners/{learnerId}/status', [LearnerController::class, 'updateStatus'])->name('learners.updateStatus');

    // Attendances
    Route::get('/admin/attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/admin/attendance', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');
    Route::put('/admin/attendance/{attendanceId}', [\App\Http\Controllers\AttendanceController::class, 'update'])->name('attendance.update');
    Route::delete('/admin/attendance/{attendanceId}', [\App\Http\Controllers\AttendanceController::class, 'destroy'])->name('attendance.destroy');

    // Users (API endpoints for modals)
    Route::post('/admin/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/admin/users/{userId}', [UserController::class, 'update'])->name('users.update');
    
    // Admin Reviewer Management (Create tests and manage posting)
    Route::get('/admin/reviewers', [AdminController::class, 'reviewers'])->name('admin.reviewers');
    Route::post('/admin/reviewers', [AdminController::class, 'storeReviewer'])->name('admin.reviewers.store');
    Route::post('/admin/reviewers/upload', [AdminController::class, 'uploadReviewerFile'])->name('admin.reviewers.upload');
    Route::post('/admin/reviewers/questions', [AdminController::class, 'storeReviewerQuestions'])->name('admin.reviewers.questions.store');
    Route::put('/admin/reviewers/{classworkId}/posting-status', [AdminController::class, 'updatePostingStatus'])->name('admin.reviewers.posting-status');

    // Admin Exam Management (Upload Pretest/Posttest files per CLC)
    Route::get('/admin/assessments', [AdminController::class, 'assessments'])->name('admin.assessments');
    Route::post('/admin/assessments', [AdminController::class, 'storeAssessment'])->name('admin.assessments.store');
    
    // Test file upload functionality
    Route::post('/admin/test-upload', [\App\Http\Controllers\TestFileUploadController::class, 'testUpload'])->name('admin.test.upload');
    Route::get('/admin/test-upload', function() {
        return view('test-upload');
    });
    Route::get('/admin/debug-clcs', function() {
        $clcs = \App\Models\Clc::all();
        return response()->json([
            'clcs' => $clcs,
            'count' => $clcs->count()
        ]);
    });
    Route::get('/admin/debug-logs', function() {
        $logFile = storage_path('logs/laravel.log');
        if (!file_exists($logFile)) {
            return response()->json(['error' => 'Log file not found']);
        }
        
        // Get last 100 lines
        $lines = [];
        $file = new SplFileObject($logFile);
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key();
        
        $startLine = max(0, $totalLines - 100);
        $file->seek($startLine);
        
        while (!$file->eof()) {
            $lines[] = $file->current();
            $file->next();
        }
        
        return response()->json([
            'total_lines' => $totalLines,
            'showing_lines' => count($lines),
            'logs' => array_filter($lines) // Remove empty lines
        ]);
    });
    
    // Admin Module Management (Upload and assign modules to CLCs)
    Route::get('/admin/modules', [AdminController::class, 'modules'])->name('admin.modules');
    Route::post('/admin/modules', [AdminController::class, 'storeModule'])->name('admin.modules.store');
    // Note: Delete route removed for data safety - modules should be archived instead
    
    // Note: Exams temporarily uses admin.assessments route until dedicated functionality is built
    // Admin Schedules Management (Manage deadlines, announcements, meetings) - TODO: implement
    // Route::get('/admin/schedules', [AdminController::class, 'schedules'])->name('admin.schedules');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:Cai'])->prefix('cai')->name('cai.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\CaiDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/learners', [\App\Http\Controllers\CaiDashboardController::class, 'learners'])->name('learners');
    Route::get('/attendance', [CaiDashboardController::class, 'attendance'])->name('attendance');
    Route::post('/attendance', [CaiDashboardController::class, 'storeAttendance'])->name('attendance.store');
    Route::post('/attendance/mark', [\App\Http\Controllers\CaiDashboardController::class, 'markAttendance'])->name('attendance.mark');
    Route::get('/modules', [CaiDashboardController::class, 'modules'])->name('modules');
    Route::get('/modules/{moduleId}/download', [CaiDashboardController::class, 'downloadModule'])->name('modules.download');
    Route::get('/files/{fileId}/download', [CaiDashboardController::class, 'downloadFileStorage'])->name('files.download');
    
    // CAI Reviewer Monitoring and Questionnaire Creation
    Route::get('/reviewers', [CaiDashboardController::class, 'reviewers'])->name('reviewers');
    Route::post('/classwork', [CaiDashboardController::class, 'storeClasswork'])->name('classwork.store');
    Route::post('/reviewers/questionnaires', [CaiDashboardController::class, 'storeReviewerQuestionnaire'])->name('reviewers.questionnaires.store');
    Route::post('/reviewers/questions', [CaiDashboardController::class, 'storeReviewerQuestions'])->name('reviewers.questions.store');
    Route::get('/reviewers/{classworkId}/download', [CaiDashboardController::class, 'downloadFile'])->name('reviewers.download');

    // CAI Exam Creation (Pretest/Posttest only)
    Route::get('/exams', [CaiDashboardController::class, 'exams'])->name('exams');
    Route::post('/exams', [CaiDashboardController::class, 'storeExam'])->name('exams.store');
    Route::post('/exams/questions', [CaiDashboardController::class, 'storeExamQuestions'])->name('exams.questions.store');
    
    // Subject Management (for CAI)
    Route::post('/subjects', [SubjectController::class, 'store'])->name('subjects.store');
    
    // CAI Enrollment Management
    Route::get('/enrollments', [CaiDashboardController::class, 'enrollments'])->name('enrollments');
    Route::post('/enrollments/{enrollmentId}/status', [CaiDashboardController::class, 'updateEnrollmentStatus'])->name('enrollments.updateStatus');
    Route::get('/enrollments/{enrollmentId}/status', [CaiDashboardController::class, 'getEnrollmentStatus'])->name('enrollments.getStatus');
    Route::get('/reports', [\App\Http\Controllers\CaiDashboardController::class, 'reports'])->name('reports');
});

// Learner routes
Route::middleware(['auth', 'verified', 'role:Learner'])->prefix('learner')->name('learner.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\LearnerDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [\App\Http\Controllers\LearnerDashboardController::class, 'profile'])->name('profile');
    Route::put('/profile', [\App\Http\Controllers\LearnerDashboardController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [\App\Http\Controllers\LearnerDashboardController::class, 'updatePassword'])->name('password.update');
    
    Route::get('/enrollment', [\App\Http\Controllers\LearnerDashboardController::class, 'enrollmentStatus'])->name('enrollment');
    
    Route::get('/reviewers', [\App\Http\Controllers\LearnerDashboardController::class, 'studyMaterials'])->name('reviewers');
    Route::get('/reviewers/{reviewerId}/take', [\App\Http\Controllers\LearnerDashboardController::class, 'takeReviewer'])->name('reviewers.take');
    Route::get('/modules/{moduleId}/download', [\App\Http\Controllers\LearnerDashboardController::class, 'downloadModule'])->name('modules.download');
    
    Route::get('/exams', [\App\Http\Controllers\LearnerDashboardController::class, 'exams'])->name('exams');
    
    Route::get('/progress', [\App\Http\Controllers\LearnerDashboardController::class, 'progress'])->name('progress');
    
    Route::get('/reports', [\App\Http\Controllers\LearnerDashboardController::class, 'reports'])->name('reports');
    Route::post('/reports/request', [\App\Http\Controllers\LearnerDashboardController::class, 'requestReport'])->name('reports.request');
});

require __DIR__.'/auth.php';
