<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance_tb';
    protected $primaryKey = 'attendance_id';

    protected $fillable = [
        'learner_id',
        'cai_id',
        'clc_id',
        'status',
        'attendance_date',
        'remarks',
    ];

    protected $casts = [
        'attendance_date' => 'date',
    ];

    /**
     * Get the learner that owns the attendance record.
     */
    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }

    /**
     * Get the CAI that owns the attendance record.
     */
    public function cai()
    {
        return $this->belongsTo(Cai::class, 'cai_id', 'cai_id');
    }

    /**
     * Get the CLC that owns the attendance record.
     */
    public function clc()
    {
        return $this->belongsTo(Clc::class, 'clc_id', 'clc_id');
    }
}