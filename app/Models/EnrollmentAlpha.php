<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentAlpha extends Model
{
    use HasFactory;

    protected $table = 'enrollment_alpha_tb';

    protected $primaryKey = 'enrollment_id';

    public $timestamps = false;

    protected $fillable = [
        'fk_cai_id',
        'lastname',
        'firstname',
        'middlename',
        'birthdate',
        'gender',
        'extension_name',
        'mobile_no',
        'email_address',
        'religion',
        'mother_tongue',
        'civil_status',
        'date_enrolled',
        'enrollee_status',
        'learner_ref_no',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

    public function householdStatuses()
    {
        return $this->hasMany(HouseholdStatus::class, 'fk_enrollment_id', 'enrollment_id');
    }

    public function enrollmentAddresses()
    {
        return $this->hasMany(EnrollmentAddress::class, 'fk_enrollment_id', 'enrollment_id');
    }

    public function enrollmentGuardians()
    {
        return $this->hasMany(EnrollmentGuardian::class, 'fk_enrollment_id', 'enrollment_id');
    }

    public function enrollmentInfos()
    {
        return $this->hasMany(EnrollmentInfo::class, 'fk_enrollment_id', 'enrollment_id');
    }

    public function enrollmentPwds()
    {
        return $this->hasMany(EnrollmentPwd::class, 'fk_enrollment_id', 'enrollment_id');
    }

    public function distanceAvailabilities()
    {
        return $this->hasMany(DistanceAvailability::class, 'fk_enrollment_id', 'enrollment_id');
    }
}
