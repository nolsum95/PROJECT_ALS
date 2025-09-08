<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cai;
use App\Models\Learner;
use App\Models\Clc;
use App\Models\Modules;
use App\Models\EnrollmentAlpha;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrolledUserCreation;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard()
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'users' => User::select('user_id', 'name', 'email_address', 'role_type')
                ->whereIn('role_type', ['CAI', 'Learner'])
                ->orderBy('user_id', 'desc')
                ->paginate(10),
            'enrollments' => \App\Models\EnrollmentAlpha::query()
                ->leftJoin('enrollment_address_tb as addr', 'addr.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                ->leftJoin('enrollment_guardian_tb as gu', 'gu.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                ->leftJoin('enrollment_information_tb as info', 'info.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                ->leftJoin('enrollment_pwd_tb as pwd', 'pwd.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                ->leftJoin('household_status_tb as hh', 'hh.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                ->leftJoin('distance_availability_tb as clc', 'clc.fk_enrollment_id', '=', 'enrollment_alpha_tb.enrollment_id')
                // Persist whether a user exists for this enrollee based on email match
                ->leftJoin('user_tb as u', 'u.email_address', '=', 'enrollment_alpha_tb.email_address')
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
                    // User existence flag
                    'u.user_id as created_user_id',
                ])
                ->orderBy('enrollment_alpha_tb.enrollment_id', 'desc')
                ->paginate(10),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'info' => session('info'),
            ]
        ]);
    }

    /**
     * Update an enrollee's status.
     */
    public function updateEnrollmentStatus(\Illuminate\Http\Request $request, int $enrollmentId)
    {
        $validated = $request->validate([
            'status' => ['required', \Illuminate\Validation\Rule::in(['Applied', 'Pre-enrolled', 'Enrolled'])],
        ]);

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
            'name' => ['required','string','max:255'],
            'email_address' => ['required','email','max:255','unique:user_tb,email_address'],
            'password' => ['required','string','min:8'],
        ]);

        $alpha = \App\Models\EnrollmentAlpha::where('enrollment_id', $enrollmentId)->firstOrFail();

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email_address' => $validated['email_address'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role_type' => 'Learner',
        ]);

        try {
            Mail::to($validated['email_address'])
                ->send(new EnrolledUserCreation($validated['name'], $validated['email_address'], $validated['password']));
        } catch (\Throwable $e) {
            Log::error('Email send failed: '.$e->getMessage());
        }

        return back()->with('success', 'User account created and credentials sent.');
    }
}
