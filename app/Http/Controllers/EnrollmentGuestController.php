<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentAlpha;
use App\Models\HouseholdStatus;
use App\Models\EnrollmentAddress;
use App\Models\EnrollmentGuardian;
use App\Models\EnrollmentPwd;
use App\Models\EnrollmentInfo;
use App\Models\DistanceAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;

class EnrollmentGuestController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $payload = $request->all();

        return DB::transaction(function () use ($payload) {
            $alpha = EnrollmentAlpha::create([
                'fk_cai_id' => $payload['alpha']['fk_cai_id'] ?? null,
                'lastname' => $payload['alpha']['lastname'] ?? null,
                'firstname' => $payload['alpha']['firstname'] ?? null,
                'middlename' => $payload['alpha']['middlename'] ?? null,
                'birthdate' => $payload['alpha']['birthdate'] ?? null,
                'gender' => $payload['alpha']['gender'] ?? null,
                'extension_name' => $payload['alpha']['extension_name'] ?? null,
                'mobile_no' => $payload['alpha']['mobile_no'] ?? null,
                'email_address' => $payload['alpha']['email_address'] ?? null,
                'religion' => $payload['alpha']['religion'] ?? null,
                'mother_tongue' => $payload['alpha']['mother_tongue'] ?? null,
                'civil_status' => $payload['alpha']['civil_status'] ?? null,
                'learner_ref_no' => $payload['alpha']['learner_ref_no'] ?? null,
                'date_enrolled' => $payload['alpha']['date_enrolled'] ?? now()->toDateString(),
                'enrollee_status' => 'Applied',
            ]);

            HouseholdStatus::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'isIndegenous' => $payload['household']['isIndegenous'] ?? null,
                'ipCommunityName' => $payload['household']['ipCommunityName'] ?? null,
                'is4PsMember' => $payload['household']['is4PsMember'] ?? null,
                'household_Id_4Ps' => $payload['household']['household_Id_4Ps'] ?? null,
            ]);

            EnrollmentAddress::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'cur_house_no' => $payload['address']['cur_house_no'] ?? null,
                'cur_streetname' => $payload['address']['cur_streetname'] ?? null,
                'cur_barangay' => $payload['address']['cur_barangay'] ?? null,
                'cur_municipality' => $payload['address']['cur_municipality'] ?? null,
                'cur_province' => $payload['address']['cur_province'] ?? null,
                'cur_zip_code' => $payload['address']['cur_zip_code'] ?? null,
                'perm_house_no' => $payload['address']['perm_house_no'] ?? null,
                'perm_streetname' => $payload['address']['perm_streetname'] ?? null,
                'perm_barangay' => $payload['address']['perm_barangay'] ?? null,
                'perm_municipality' => $payload['address']['perm_municipality'] ?? null,
                'perm_province' => $payload['address']['perm_province'] ?? null,
                'perm_zip_code' => $payload['address']['perm_zip_code'] ?? null,
            ]);

            EnrollmentGuardian::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'pa_lastname' => $payload['guardian']['pa_lastname'] ?? null,
                'pa_firstname' => $payload['guardian']['pa_firstname'] ?? null,
                'pa_middlename' => $payload['guardian']['pa_middlename'] ?? null,
                'pa_occupation' => $payload['guardian']['pa_occupation'] ?? null,
                'ma_lastname' => $payload['guardian']['ma_lastname'] ?? null,
                'ma_firstname' => $payload['guardian']['ma_firstname'] ?? null,
                'ma_middlename' => $payload['guardian']['ma_middlename'] ?? null,
                'ma_occupation' => $payload['guardian']['ma_occupation'] ?? null,
            ]);

            EnrollmentPwd::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'is_pwd' => $payload['pwd']['is_pwd'] ?? null,
                'disability_name' => !empty($payload['pwd']['disability_name']) ? json_encode($payload['pwd']['disability_name']) : null,
                'spec_health_prob' => $payload['pwd']['spec_health_prob'] ?? null,
                'visual_impairment' => $payload['pwd']['visual_impairment'] ?? null,
            ]);

            EnrollmentInfo::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'lastLevelCompleted' => $payload['education']['lastLevelCompleted'] ?? null,
                'nonCompletionReason' => $payload['education']['nonCompletionReason'] ?? null,
                'custom_reason' => $payload['education']['custom_reason'] ?? null,
                'hasAttendedAls' => $payload['education']['hasAttendedAls'] ?? null,
                'alsProgramAttended' => $payload['education']['alsProgramAttended'] ?? null,
                'hasCompletedAls' => $payload['education']['hasCompletedAls'] ?? null,
                'alsNonCompletedReason' => $payload['education']['alsNonCompletedReason'] ?? null,
            ]);

            DistanceAvailability::create([
                'fk_enrollment_id' => $alpha->enrollment_id,
                'distance_clc_km' => implode('|', array_filter([
                    $payload['clc']['distance_km'] ?? null,
                    $payload['clc']['distance_hours'] ?? null,
                    $payload['clc']['distance_mins'] ?? null,
                ])),
                'travel_hours_minutes' => (($payload['clc']['distance_hours'] ?? '') . ':' . ($payload['clc']['distance_mins'] ?? '')),
                'transport_mode' => $payload['clc']['transport_mode'] ?? null,
                'mon' => ($payload['clc']['mon'] ?? false) ? ($payload['clc']['mon_time'] ?? null) : null,
                'tue' => ($payload['clc']['tue'] ?? false) ? ($payload['clc']['tue_time'] ?? null) : null,
                'wed' => ($payload['clc']['wed'] ?? false) ? ($payload['clc']['wed_time'] ?? null) : null,
                'thur' => ($payload['clc']['thur'] ?? false) ? ($payload['clc']['thur_time'] ?? null) : null,
                'fri' => ($payload['clc']['fri'] ?? false) ? ($payload['clc']['fri_time'] ?? null) : null,
                'sat' => ($payload['clc']['sat'] ?? false) ? ($payload['clc']['sat_time'] ?? null) : null,
                'sun' => ($payload['clc']['sun'] ?? false) ? ($payload['clc']['sun_time'] ?? null) : null,
            ]);

            return redirect()->route('enrollment.page')->with('success', 'Enrollment submitted successfully.');
        });
    }
}



