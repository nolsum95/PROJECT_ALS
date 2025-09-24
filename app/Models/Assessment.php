<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $table = 'assessments_tb';
    protected $primaryKey = 'assessment_id';

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'assessment_type',
        'schedule_date',
        'clc_id',
        'status',
    ];

    protected $casts = [
        'schedule_date' => 'datetime',
    ];

    public function clc()
    {
        return $this->belongsTo(Clc::class, 'clc_id', 'clc_id');
    }
}
