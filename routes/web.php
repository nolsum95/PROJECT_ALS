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
        // Add more roles as needed
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
    Route::post('/modules', [CaiDashboardController::class, 'storeModule'])->name('modules.store');
    Route::post('/modules/assign', [CaiDashboardController::class, 'assignModule'])->name('modules.assign');
    
    // CAI Classwork Management
    Route::get('/classwork', [CaiDashboardController::class, 'classwork'])->name('classwork');
    Route::post('/classwork', [CaiDashboardController::class, 'storeClasswork'])->name('classwork.store');
    Route::post('/classwork/questionnaire', [CaiDashboardController::class, 'storeQuestionnaire'])->name('classwork.questionnaire.store');
    Route::post('/classwork/questions', [CaiDashboardController::class, 'storeQuestions'])->name('classwork.questions.store');
    
    // Subject Management (for CAI)
    Route::post('/subjects', [SubjectController::class, 'store'])->name('subjects.store');
    
    // CAI Enrollment Management
    Route::get('/enrollments', [CaiDashboardController::class, 'enrollments'])->name('enrollments');
    Route::post('/enrollments/{enrollmentId}/status', [CaiDashboardController::class, 'updateEnrollmentStatus'])->name('enrollments.updateStatus');
    Route::get('/enrollments/{enrollmentId}/status', [CaiDashboardController::class, 'getEnrollmentStatus'])->name('enrollments.getStatus');
    Route::get('/reports', [\App\Http\Controllers\CaiDashboardController::class, 'reports'])->name('reports');
});

require __DIR__.'/auth.php';
