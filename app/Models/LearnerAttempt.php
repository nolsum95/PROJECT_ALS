<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearnerAttempt extends Model
{
    use HasFactory;

    protected $table = 'learner_attempt_tb';

    protected $primaryKey = 'attempt_id';

    protected $fillable = [
        'fk_learner_id',
        'fk_qn_id',
        'attempt_no',
        'attempt_date',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'fk_learner_id', 'learner_id');
    }

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, 'fk_qn_id', 'qn_id');
    }

    // Get classwork through questionnaire
    public function classwork()
    {
        return $this->hasOneThrough(
            Classwork::class,
            Questionnaire::class,
            'qn_id',
            'classwork_id',
            'fk_qn_id',
            'fk_classwork_id'
        );
    }

    // Check if learner can attempt based on max attempts
    public static function canAttempt($learnerId, $questionnaireId, $maxAttempts = null)
    {
        if ($maxAttempts === null) {
            return true; // Unlimited attempts
        }

        $attemptCount = self::where('fk_learner_id', $learnerId)
            ->where('fk_qn_id', $questionnaireId)
            ->count();

        return $attemptCount < $maxAttempts;
    }
}
