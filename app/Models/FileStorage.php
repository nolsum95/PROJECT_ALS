<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class FileStorage extends Model
{
    use HasFactory;

    protected $table = 'file_storage_tb';

    protected $fillable = [
        'fileable_type',
        'fileable_id',
        'fk_clc_id',
        'file_path',
        'file_name',
        'original_name',
        'file_size',
        'file_type',
        'mime_type',
        'storage_disk',
        'uploaded_by',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'file_size' => 'integer',
    ];

    /**
     * Get the owning fileable model (polymorphic relationship)
     */
    public function fileable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who uploaded this file
     */
    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }

    /**
     * Get the CLC this file is associated with
     */
    public function clc()
    {
        return $this->belongsTo(Clc::class, 'fk_clc_id', 'clc_id');
    }

    /**
     * Get the full URL to the file
     */
    public function getUrlAttribute()
    {
        return Storage::disk($this->storage_disk)->url($this->file_path);
    }

    /**
     * Get the file size in human readable format
     */
    public function getHumanFileSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if file exists in storage
     */
    public function exists()
    {
        return Storage::disk($this->storage_disk)->exists($this->file_path);
    }

    /**
     * Delete the file from storage
     */
    public function deleteFile()
    {
        if ($this->exists()) {
            return Storage::disk($this->storage_disk)->delete($this->file_path);
        }
        return true;
    }

    /**
     * Get file icon based on file type
     */
    public function getIconAttribute()
    {
        switch (strtolower($this->file_type)) {
            case 'pdf':
                return 'PictureAsPdf';
            case 'doc':
            case 'docx':
                return 'Description';
            case 'xls':
            case 'xlsx':
                return 'TableChart';
            case 'ppt':
            case 'pptx':
                return 'Slideshow';
            default:
                return 'InsertDriveFile';
        }
    }

    /**
     * Scope for files of specific type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('file_type', $type);
    }

    /**
     * Scope for files uploaded by specific user
     */
    public function scopeUploadedBy($query, $userId)
    {
        return $query->where('uploaded_by', $userId);
    }
}
