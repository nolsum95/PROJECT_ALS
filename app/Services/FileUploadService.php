<?php

namespace App\Services;

use App\Models\FileStorage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload a file and create a FileStorage record
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @param array $metadata
     * @return FileStorage
     */
    public function uploadFile(
        UploadedFile $file, 
        string $directory = 'uploads', 
        string $disk = 'public',
        array $metadata = [],
        ?int $clcId = null
    ): FileStorage {
        \Log::info('FileUploadService: Starting uploadFile', [
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'directory' => $directory,
            'disk' => $disk
        ]);

        // Generate unique filename
        $fileName = $this->generateUniqueFileName($file);
        \Log::info('FileUploadService: Generated filename', ['filename' => $fileName]);
        
        // Store the file
        $filePath = $file->storeAs($directory, $fileName, $disk);
        \Log::info('FileUploadService: File stored', ['path' => $filePath]);
        
        // Create FileStorage record (for standalone uploads without polymorphic relationship)
        $fileStorageData = [
            'fileable_type' => 'App\\Models\\FileStorage', // Default for standalone files
            'fileable_id' => 1, // Default for standalone files
            'fk_clc_id' => $clcId, // Associate with CLC if provided
            'file_path' => $filePath,
            'file_name' => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientOriginalExtension(),
            'mime_type' => $file->getMimeType(),
            'storage_disk' => $disk,
            'uploaded_by' => auth()->id(),
            'description' => $metadata['description'] ?? null,
            'metadata' => $metadata,
        ];

        \Log::info('FileUploadService: Creating FileStorage record', $fileStorageData);

        $fileStorage = FileStorage::create($fileStorageData);
        
        \Log::info('FileUploadService: FileStorage created', ['id' => $fileStorage->id]);
        
        return $fileStorage;
    }

    /**
     * Upload file and associate with a model (polymorphic)
     *
     * @param UploadedFile $file
     * @param mixed $model
     * @param string $directory
     * @param string $disk
     * @param array $metadata
     * @return FileStorage
     */
    public function uploadAndAssociate(
        UploadedFile $file,
        $model,
        string $directory = 'uploads',
        string $disk = 'public',
        array $metadata = [],
        ?int $clcId = null
    ): FileStorage {
        $fileStorage = $this->uploadFile($file, $directory, $disk, $metadata, $clcId);
        
        // Associate with the model using polymorphic relationship
        $fileStorage->fileable()->associate($model);
        $fileStorage->save();
        
        return $fileStorage;
    }

    /**
     * Upload file and set foreign key reference
     *
     * @param UploadedFile $file
     * @param mixed $model
     * @param string $directory
     * @param string $disk
     * @param array $metadata
     * @return FileStorage
     */
    public function uploadAndSetReference(
        UploadedFile $file,
        $model,
        string $directory = 'uploads',
        string $disk = 'public',
        array $metadata = [],
        ?int $clcId = null
    ): FileStorage {
        \Log::info('FileUploadService: Starting uploadAndSetReference', [
            'directory' => $directory,
            'disk' => $disk,
            'model_class' => get_class($model),
            'model_id' => $model->getKey()
        ]);

        // Generate unique filename
        $fileName = $this->generateUniqueFileName($file);
        \Log::info('FileUploadService: Generated filename', ['filename' => $fileName]);
        
        // Store the file
        $filePath = $file->storeAs($directory, $fileName, $disk);
        \Log::info('FileUploadService: File stored', ['path' => $filePath]);
        
        // Create FileStorage record with correct polymorphic values from the start
        $fileStorageData = [
            'fileable_type' => get_class($model),
            'fileable_id' => $model->getKey(),
            'fk_clc_id' => $clcId, // Associate with CLC if provided
            'file_path' => $filePath,
            'file_name' => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientOriginalExtension(),
            'mime_type' => $file->getMimeType(),
            'storage_disk' => $disk,
            'uploaded_by' => auth()->id(),
            'description' => $metadata['description'] ?? null,
            'metadata' => $metadata,
        ];

        \Log::info('FileUploadService: Creating FileStorage record with polymorphic data', $fileStorageData);

        $fileStorage = FileStorage::create($fileStorageData);
        
        \Log::info('FileUploadService: FileStorage created', ['id' => $fileStorage->id]);
        
        // Set the foreign key reference
        $model->fk_file_id = $fileStorage->id;
        $model->save();
        
        \Log::info('FileUploadService: Reference set successfully');
        
        return $fileStorage;
    }

    /**
     * Replace existing file for a model
     *
     * @param UploadedFile $newFile
     * @param mixed $model
     * @param string $directory
     * @param string $disk
     * @param array $metadata
     * @return FileStorage
     */
    public function replaceFile(
        UploadedFile $newFile,
        $model,
        string $directory = 'uploads',
        string $disk = 'public',
        array $metadata = []
    ): FileStorage {
        // Delete old file if exists
        if ($model->fk_file_id && $model->file) {
            $this->deleteFile($model->file);
        }

        // Upload new file
        return $this->uploadAndSetReference($newFile, $model, $directory, $disk, $metadata);
    }

    /**
     * Delete a file and its storage record
     *
     * @param FileStorage $fileStorage
     * @return bool
     */
    public function deleteFile(FileStorage $fileStorage): bool
    {
        // Delete physical file
        $fileStorage->deleteFile();
        
        // Delete database record
        return $fileStorage->delete();
    }

    /**
     * Generate unique filename
     *
     * @param UploadedFile $file
     * @return string
     */
    private function generateUniqueFileName(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = Str::slug($baseName);
        
        return $safeName . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Get file directory based on model type
     *
     * @param string $modelType
     * @return string
     */
    public function getDirectoryForModel(string $modelType): string
    {
        switch ($modelType) {
            case 'App\Models\Modules':
                return 'modules';
            case 'App\Models\Classwork':
                return 'reviewer-files';
            default:
                return 'uploads';
        }
    }

    /**
     * Validate file type for specific model
     *
     * @param UploadedFile $file
     * @param string $modelType
     * @return bool
     */
    public function validateFileForModel(UploadedFile $file, string $modelType): bool
    {
        $allowedTypes = [
            'App\Models\Modules' => ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
            'App\Models\Classwork' => ['pdf', 'doc', 'docx'],
        ];

        $extension = strtolower($file->getClientOriginalExtension());
        $allowed = $allowedTypes[$modelType] ?? ['pdf', 'doc', 'docx'];

        return in_array($extension, $allowed);
    }
}
