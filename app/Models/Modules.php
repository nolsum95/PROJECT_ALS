<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modules extends Model
{
    use HasFactory;

    protected $table = 'modules_tb';

    protected $primaryKey = 'modules_id';

    protected $fillable = [
        'fk_cai_id',
        'fk_learner_id',
        'subject',
        'description',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'fk_learner_id', 'learner_id');
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Modules extends Model
// {
//     use HasFactory;

//     protected $table = 'modules_tb';

//     protected $primaryKey = 'modules_id';

//     protected $fillable = [
//         'fk_cai_id',
//         'fk_learner_id',
//         'subject',
//         'description',
//     ];

//     public function cai()
//     {
//         return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
//     }

//     public function learner()
//     {
//         return $this->belongsTo(Learner::class, 'fk_learner_id', 'learner_id');
//     }
// }
