<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modules extends Model
{
    use HasFactory;

    protected $table = 'modules_tb';

    protected $primaryKey = 'module_id';

    protected $fillable = [
        'fk_cai_id',
        'subject',
        'description',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'content',
        'content_type',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

}

