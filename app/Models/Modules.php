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
        'subject',
        'description',
        'content_type',
        'content',
        'file_path', // Keep temporarily for migration
        'file_name', // Keep temporarily for migration
        'file_size', // Keep temporarily for migration
        'file_type', // Keep temporarily for migration
        'fk_file_id', // New polymorphic file storage
        'fk_clc_id',
        'assigned_at',
        'status',
        'created_by_admin'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

    public function clc()
    {
        return $this->belongsTo(Clc::class, 'fk_clc_id', 'clc_id');
    }

    /**
     * Get the file associated with this module (polymorphic relationship)
     */
    public function file()
    {
        return $this->belongsTo(FileStorage::class, 'fk_file_id');
    }

    /**
     * Get all files associated with this module (polymorphic relationship)
     * This allows for multiple files per module in the future
     */
    public function files()
    {
        return $this->morphMany(FileStorage::class, 'fileable');
    }

    public function createdByAdmin()
    {
        return $this->belongsTo(User::class, 'created_by_admin', 'user_id');
    }

    // Scope for active modules only (only if status column exists)
    public function scopeActive($query)
    {
        try {
            return $query->where('status', 'active');
        } catch (\Exception $e) {
            return $query; // Return all if status column doesn't exist
        }
    }

    // Scope for modules assigned to specific CLC (only if fk_clc_id exists)
    public function scopeForClc($query, $clcId)
    {
        try {
            return $query->where('fk_clc_id', $clcId);
        } catch (\Exception $e) {
            return $query; // Return all if column doesn't exist
        }
    }

}
