<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cai extends Model
{
    use HasFactory;

    protected $table = 'cai_tb';

    protected $primaryKey = 'cai_id';

    protected $fillable = [
        'fk_userId',
        'lastname',
        'firstname',
        'middlename',
        'gender',
        'assigned_clc',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'fk_userId', 'user_id');
    }

    public function learners()
    {
        return $this->hasMany(Learner::class, 'assigned_cai', 'cai_id');
    }

    public function clc()
    {
        return $this->belongsTo(Clc::class, 'assigned_clc', 'clc_id');
    }

    public function modules()
    {
        return $this->hasMany(Modules::class, 'fk_cai_id', 'cai_id');
    }

    public function enrollmentAlphas()
    {
        return $this->hasMany(EnrollmentAlpha::class, 'fk_cai_id', 'cai_id');
    }

    public function classworks()
    {
        return $this->hasMany(Classwork::class, 'fk_cai_id', 'cai_id');
    }

    public function questionnaires()
    {
        return $this->hasManyThrough(
            Questionnaire::class,
            Classwork::class,
            'fk_cai_id', // Foreign key on classwork table
            'fk_classwork_id', // Foreign key on questionnaire table
            'cai_id', // Local key on cai table
            'classwork_id' // Local key on classwork table
        );
    }
}