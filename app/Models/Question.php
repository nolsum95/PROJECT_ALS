<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'question_tb';

    protected $primaryKey = 'question_id';

    protected $fillable = [
        'fk_qn_id',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'ans_key',
    ];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, 'fk_qn_id', 'qn_id');
    }

    public function learnerAnswers()
    {
        return $this->hasMany(LearnerAnswer::class, 'fk_question_id', 'question_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Question extends Model
// {
//     use HasFactory;

//     protected $table = 'question_tb';

//     protected $primaryKey = 'question_id';

//     protected $fillable = [
//         'fk_qn_id',
//         'question_text',
//         'option_a',
//         'option_b',
//         'option_c',
//         'option_d',
//         'ans_key',
//     ];

//     public function questionnaire()
//     {
//         return $this->belongsTo(Questionnaire::class, 'fk_qn_id', 'qn_id');
//     }

//     public function learnerAnswers()
//     {
//         return $this->hasMany(LearnerAnswer::class, 'fk_question_id', 'question_id');
//     }
// }
