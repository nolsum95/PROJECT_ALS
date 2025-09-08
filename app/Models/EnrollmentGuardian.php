<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentGuardian extends Model
{
    use HasFactory;

    protected $table = 'enrollment_guardian_tb';

    protected $primaryKey = 'guardian_id';

       public $timestamps = false;
       
    protected $fillable = [
        'fk_enrollment_id',
        'pa_lastname',
        'pa_firstname',
        'pa_middlename',
        'pa_occupation',
        'ma_lastname',
        'ma_firstname',
        'ma_middlename',
        'ma_occupation',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class EnrollmentGuardian extends Model
// {
//     use HasFactory;

//     protected $table = 'enrollment_guardian_tb';

//     protected $primaryKey = 'guardian_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'pa_lastname',
//         'pa_firstname',
//         'pa_middlename',
//         'pa_occupation',
//         'ma_lastname',
//         'ma_firstname',
//         'ma_middlename',
//         'ma_occupation',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
