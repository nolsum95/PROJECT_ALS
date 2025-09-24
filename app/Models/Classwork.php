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
        'fk_clc_id',
        'test_level',
        'test_title',
        'test_description',
        'posting_status',
        'scheduled_post_at',
        'file_path', // Keep temporarily for migration
        'file_name', // Keep temporarily for migration
        'file_size', // Keep temporarily for migration
        'file_type', // Keep temporarily for migration
        'created_by_admin',
    ];

    protected $casts = [
        'scheduled_post_at' => 'datetime',
    ];

    public function cai()
    {
        return $this->belongsTo(Cai::class, 'fk_cai_id', 'cai_id');
    }

    public function clc()
    {
        return $this->belongsTo(Clc::class, 'fk_clc_id', 'clc_id');
    }

    public function questionnaires()
    {
        return $this->hasMany(Questionnaire::class, 'fk_classwork_id', 'classwork_id');
    }

    public function learnerAttempts()
    {
        return $this->hasManyThrough(
            LearnerAttempt::class,
            Questionnaire::class,
            'fk_classwork_id',
            'fk_qn_id',
            'classwork_id',
            'qn_id'
        );
    }

    /**
     * Get all files associated with this classwork (polymorphic relationship)
     * This allows for multiple files per classwork in the future
     */
    public function files()
    {
        return $this->morphMany(FileStorage::class, 'fileable');
    }

    /**
     * Get the primary file associated with this classwork (for backward compatibility)
     */
    public function fileStorage()
    {
        return $this->morphOne(FileStorage::class, 'fileable');
    }

    // Scope for posted tests only
    public function scopePosted($query)
    {
        return $query->where('posting_status', 'posted');
    }

    // Scope for tests available to specific CLC
    public function scopeForClc($query, $clcId)
    {
        return $query->where('fk_clc_id', $clcId);
    }

    // Check if test is currently available
    public function isAvailable()
    {
        if ($this->posting_status !== 'posted') {
            return false;
        }

        $now = now();
        
        // Check if scheduled to be available in the future
        if ($this->scheduled_post_at && $now->lt($this->scheduled_post_at)) {
            return false;
        }

        return true;
    }
}
