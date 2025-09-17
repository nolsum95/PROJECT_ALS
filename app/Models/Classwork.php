<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classwork extends Model
{
    use HasFactory;

    protected $table = 'classwork_tb';

    protected $primaryKey = 'classwork_id';

    protected $fillable = [
        'fk_cai_id',
        'test_level',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

    public function questionnaires()
    {
        return $this->hasMany(Questionnaire::class, 'fk_classwork_id', 'classwork_id');
    }
}
