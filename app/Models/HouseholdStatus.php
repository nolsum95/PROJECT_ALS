<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdStatus extends Model
{
    use HasFactory;

    protected $table = 'household_status_tb';


    protected $primaryKey = 'hhs_id';

    public $timestamps = false;

    protected $fillable = [
        'fk_enrollment_id',
        'isIndegenous',
        'ipCommunityName',
        'is4PsMember',
        'household_Id_4Ps',
    ];

    public function enrollmentAlpha()
    {
        return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class HouseholdStatus extends Model
// {
//     use HasFactory;

//     protected $table = 'household_status_tb';

//     protected $primaryKey = 'hhs_id';

//     protected $fillable = [
//         'fk_enrollment_id',
//         'isIndegenous',
//         'ipCommunityName',
//         'is4PsMember',
//         'household_Id_4Ps',
//     ];

//     public function enrollmentAlpha()
//     {
//         return $this->belongsTo(EnrollmentAlpha::class, 'fk_enrollment_id', 'enrollment_id');
//     }
// }
