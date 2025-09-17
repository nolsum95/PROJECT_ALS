<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Questionnaire extends Model
{
    use HasFactory;

    protected $table = 'questionnaire_tb';

    protected $primaryKey = 'qn_id';

    protected $fillable = [
        'fk_classwork_id',
        'fk_subject_id',
        'time_duration',
        'title',
        'description',
    ];

    public function classwork()
    {
        return $this->belongsTo(Classwork::class, 'fk_classwork_id', 'classwork_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'fk_subject_id', 'subject_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'fk_qn_id', 'qn_id');
    }

    public function learnerAttempts()
    {
        return $this->hasMany(LearnerAttempt::class, 'fk_qn_id', 'qn_id');
    }
}
