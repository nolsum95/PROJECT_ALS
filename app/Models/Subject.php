<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $table = 'subject_tb';

    protected $primaryKey = 'subject_id';

    protected $fillable = [
        'subject_name',
    ];
}

