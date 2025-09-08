<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentAddress extends Model
{
    use HasFactory;

    protected $table = 'enrollment_address_tb';

    protected $primaryKey = 'address_id';

       public $timestamps = false;

    protected $fillable = [
        'fk_enrollment_id',
        'cur_house_no',
        'cur_streetname',
        'cur_barangay',
        'cur_municipality',
        'cur_province',
        'cur_zip_code',
        'perm_house_no',
        'perm_streetname',
        'perm_barangay',
        'perm_municipality',
        'perm_province',
        'perm_zip_code',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class EnrollmentAddress extends Model
// {
//     use HasFactory;

//     protected $table = 'enrollment_address_tb';

//     protected $primaryKey = 'address_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'cur_house_no',
//         'cur_streetname',
//         'cur_barangay',
//         'cur_municipality',
//         'cur_province',
//         'cur_zip_code',
//         'perm_house_no',
//         'perm_streetname',
//         'perm_barangay',
//         'perm_municipality',
//         'perm_province',
//         'perm_zip_code',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
