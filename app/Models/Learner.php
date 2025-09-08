<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learner extends Model
{
    use HasFactory;

    protected $table = 'learner_tb';

    protected $primaryKey = 'learner_id';

    protected $fillable = [
        'fk_userId',
        'fullname',
        'assigned_clc',
        'assigned_cai',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'fk_userId', 'user_id');
    }

    public function clcs()
    {
        return $this->hasMany(Clc::class, 'fk_learner_id', 'learner_id');
    }

    public function modules()
    {
        return $this->hasMany(Modules::class, 'fk_learner_id', 'learner_id');
    }

    public function learnerAnswers()
    {
        return $this->hasMany(LearnerAnswer::class, 'fk_learner_id', 'learner_id');
    }

    public function learnerAttempts()
    {
        return $this->hasMany(LearnerAttempt::class, 'fk_learner_id', 'learner_id');
    }
}
