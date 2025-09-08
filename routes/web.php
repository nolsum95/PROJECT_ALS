<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

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
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/admin/enrollments/{enrollmentId}/status', [AdminController::class, 'updateEnrollmentStatus'])->name('admin.enrollments.updateStatus');
    Route::post('/admin/enrollments/{enrollmentId}/create-user', [AdminController::class, 'createEnrollmentUser'])->name('admin.enrollments.createUser');
    Route::resource('users', UserController::class);
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
