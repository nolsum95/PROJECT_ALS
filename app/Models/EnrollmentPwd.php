<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentPwd extends Model
{
    use HasFactory;

    protected $table = 'enrollment_pwd_tb';

    protected $primaryKey = 'pwd_id';
    public $timestamps = false;

    protected $fillable = [
        'fk_enrollment_id',
        'is_pwd',
        'disability_name',
        'spec_health_prob',
        'visual_impairment',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class EnrollmentPwd extends Model
// {
//     use HasFactory;

//     protected $table = 'enrollment_pwd_tb';

//     protected $primaryKey = 'pwd_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'is_pwd',
//         'disability_name',
//         'spec_health_prob',
//         'visual_impairment',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
