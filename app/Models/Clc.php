<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clc extends Model
{
    use HasFactory;

    protected $table = 'clc_tb';
    protected $primaryKey = 'clc_id';

    protected $fillable = ['clc_name', 'barangay'];

    public function cais()
    {
        return $this->hasMany(Cai::class, 'assigned_clc', 'clc_id');
    }

    public function learners()
    {
        return $this->hasMany(Learner::class, 'assigned_clc', 'clc_id');
    }
}
