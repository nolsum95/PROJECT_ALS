<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClcController;
use App\Http\Controllers\CaiController;
use App\Http\Controllers\LearnerController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Guest/HomePage');
});

Route::get('/enroll', function () {
    return Inertia::render('Guest/EnrollmentPage');
})->name('enrollment.page');
Route::post('/enroll', [\App\Http\Controllers\EnrollmentGuestController::class, 'store'])->name('enrollment.store');

// Redirect old dashboard route to admin dashboard
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin routes
Route::middleware(['auth', 'verified'])->group(function () {
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

    // Learners
    Route::get('/admin/learners', [LearnerController::class, 'index'])->name('learner.index');

    // Users (API endpoints for modals)
    Route::post('/admin/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/admin/users/{userId}', [UserController::class, 'update'])->name('users.update');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
