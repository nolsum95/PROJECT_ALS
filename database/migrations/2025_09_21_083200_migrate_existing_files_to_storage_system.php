<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\FileStorage;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing module files
        $this->migrateModuleFiles();
        
        // Migrate existing classwork files
        $this->migrateClassworkFiles();
    }

    /**
     * Migrate existing module files to the new file storage system
     */
    private function migrateModuleFiles(): void
    {
        $modules = DB::table('modules_tb')
            ->whereNotNull('file_path')
            ->get();

        foreach ($modules as $module) {
            try {
                // Create FileStorage record
                $fileStorage = FileStorage::create([
                    'fileable_type' => 'App\Models\Modules',
                    'fileable_id' => $module->module_id,
                    'file_path' => $module->file_path,
                    'file_name' => $module->file_name ?? basename($module->file_path),
                    'original_name' => $module->file_name ?? basename($module->file_path),
                    'file_size' => $module->file_size ?? 0,
                    'file_type' => $module->file_type ?? pathinfo($module->file_path, PATHINFO_EXTENSION),
                    'mime_type' => $this->getMimeType($module->file_type ?? pathinfo($module->file_path, PATHINFO_EXTENSION)),
                    'storage_disk' => 'public',
                    'uploaded_by' => $module->created_by_admin ?? 1,
                    'description' => 'Migrated from modules_tb',
                    'metadata' => json_encode([
                        'migrated_from' => 'modules_tb',
                        'original_module_id' => $module->module_id,
                        'migration_date' => now()->toISOString()
                    ]),
                    'created_at' => $module->created_at ?? now(),
                    'updated_at' => $module->updated_at ?? now(),
                ]);

                // Update module with file reference
                DB::table('modules_tb')
                    ->where('module_id', $module->module_id)
                    ->update(['fk_file_id' => $fileStorage->id]);

            } catch (\Exception $e) {
                \Log::error("Failed to migrate module file for module_id {$module->module_id}: " . $e->getMessage());
            }
        }
    }

    /**
     * Migrate existing classwork files to the new file storage system
     */
    private function migrateClassworkFiles(): void
    {
        $classworks = DB::table('classwork_tb')
            ->whereNotNull('file_path')
            ->get();

        foreach ($classworks as $classwork) {
            try {
                // Create FileStorage record
                $fileStorage = FileStorage::create([
                    'fileable_type' => 'App\Models\Classwork',
                    'fileable_id' => $classwork->classwork_id,
                    'file_path' => $classwork->file_path,
                    'file_name' => $classwork->file_name ?? basename($classwork->file_path),
                    'original_name' => $classwork->file_name ?? basename($classwork->file_path),
                    'file_size' => $classwork->file_size ?? 0,
                    'file_type' => $classwork->file_type ?? pathinfo($classwork->file_path, PATHINFO_EXTENSION),
                    'mime_type' => $this->getMimeType($classwork->file_type ?? pathinfo($classwork->file_path, PATHINFO_EXTENSION)),
                    'storage_disk' => 'public',
                    'uploaded_by' => $classwork->created_by_admin ?? 1,
                    'description' => 'Migrated from classwork_tb',
                    'metadata' => json_encode([
                        'migrated_from' => 'classwork_tb',
                        'original_classwork_id' => $classwork->classwork_id,
                        'test_level' => $classwork->test_level ?? null,
                        'migration_date' => now()->toISOString()
                    ]),
                    'created_at' => $classwork->created_at ?? now(),
                    'updated_at' => $classwork->updated_at ?? now(),
                ]);

                // Update classwork with file reference
                DB::table('classwork_tb')
                    ->where('classwork_id', $classwork->classwork_id)
                    ->update(['fk_file_id' => $fileStorage->id]);

            } catch (\Exception $e) {
                \Log::error("Failed to migrate classwork file for classwork_id {$classwork->classwork_id}: " . $e->getMessage());
            }
        }
    }

    /**
     * Get MIME type based on file extension
     */
    private function getMimeType(string $extension): string
    {
        $mimeTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];

        return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove file references from modules and classwork
        DB::table('modules_tb')->update(['fk_file_id' => null]);
        DB::table('classwork_tb')->update(['fk_file_id' => null]);
        
        // Delete migrated file storage records
        FileStorage::whereIn('fileable_type', ['App\Models\Modules', 'App\Models\Classwork'])
            ->where('description', 'like', 'Migrated from %')
            ->delete();
    }
};
