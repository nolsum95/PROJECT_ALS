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

    public function clcs()
    {
        return $this->hasMany(Clc::class, 'fk_cai_id', 'cai_id');
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
}