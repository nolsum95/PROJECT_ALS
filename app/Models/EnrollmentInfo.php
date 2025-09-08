<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentInfo extends Model
{
    use HasFactory;

    protected $table = 'enrollment_information_tb';

    protected $primaryKey = 'edin_id';
    
    public $timestamps = false;

    protected $fillable = [
        'fk_enrollment_id',
        'lastLevelCompleted',
        'nonCompletionReason',
        'custom_reason',
        'hasAttendedAls',
        'alsProgramAttended',
        'hasCompletedAls',
        'alsNonCompletedReason',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class EnrollmentInfo extends Model
// {
//     use HasFactory;

//     protected $table = 'enrollment_information_tb';

//     protected $primaryKey = 'edin_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'lastLevelCompleted',
//         'nonCompletionReason',
//         'custom_reason',
//         'hasAttendedAls',
//         'alsProgramAttended',
//         'hasCompletedAls',
//         'alsNonCompletedReason',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
