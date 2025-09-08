<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clc extends Model
{
    use HasFactory;

    protected $table = 'clc_tb';

    protected $primaryKey = 'clc_id';

    protected $fillable = [
        'fk_cai_id',
        'fk_learner_id',
        'clc_name',
        'barangay',
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

// class Clc extends Model
// {
//     use HasFactory;

//     protected $table = 'clc_tb';

//     protected $primaryKey = 'clc_id';

//     protected $fillable = [
//         'fk_cai_id',
//         'fk_learner_id',
//         'clc_name',
//         'barangay',
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
