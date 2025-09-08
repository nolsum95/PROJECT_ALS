<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistanceAvailability extends Model
{
    use HasFactory;

    protected $table = 'distance_availability_tb';

    protected $primaryKey = 'da_id';

       public $timestamps = false;
       
    protected $fillable = [
        'fk_enrollment_id',
        'distance_clc_km',
        'travel_hours_minutes',
        'transport_mode',
        'mon',
        'tue',
        'wed',
        'thur',
        'fri',
        'sat',
        'sun',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class DistanceAvailability extends Model
// {
//     use HasFactory;

//     protected $table = 'distance_availability_tb';

//     protected $primaryKey = 'da_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'distance_clc_km',
//         'travel_hours_minutes',
//         'transport_mode',
//         'mon',
//         'tue',
//         'wed',
//         'thur',
//         'fri',
//         'sat',
//         'sun',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
