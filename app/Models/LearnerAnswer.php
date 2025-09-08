<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearnerAnswer extends Model
{
    use HasFactory;

    protected $table = 'learner_answer_tb';

    protected $primaryKey = 'answer_id';

    protected $fillable = [
        'fk_learner_id',
        'fk_question_id',
        'selected_option',
        'is_correct',
        'answered_at',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'fk_learner_id', 'learner_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'fk_question_id', 'question_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class LearnerAnswer extends Model
// {
//     use HasFactory;

//     protected $table = 'learner_answer_tb';

//     protected $primaryKey = 'answer_id';

//     protected $fillable = [
//         'fk_learner_id',
//         'fk_question_id',
//         'selected_option',
//         'is_correct',
//         'answered_at',
//     ];

//     public function learner()
//     {
//         return $this->belongsTo(Learner::class, 'fk_learner_id', 'learner_id');
//     }

//     public function question()
//     {
//         return $this->belongsTo(Question::class, 'fk_question_id', 'question_id');
//     }
// }
