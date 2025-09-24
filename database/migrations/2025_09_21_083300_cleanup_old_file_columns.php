<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * WARNING: This migration removes the old file columns after data has been migrated.
     * Make sure the previous migration (migrate_existing_files_to_storage_system) has run successfully
     * and all data has been properly migrated before running this migration.
     */
    public function up(): void
    {
        // Remove old file columns from modules_tb
        Schema::table('modules_tb', function (Blueprint $table) {
            // Drop old file storage columns
            $table->dropColumn([
                'file_path',
                'file_name', 
                'file_size',
                'file_type'
            ]);
        });

        // Remove old file columns from classwork_tb
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Drop old file storage columns
            $table->dropColumn([
                'file_path',
                'file_name',
                'file_size', 
                'file_type'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add old file columns to modules_tb
        Schema::table('modules_tb', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('content');
            $table->string('file_name')->nullable()->after('file_path');
            $table->bigInteger('file_size')->nullable()->after('file_name');
            $table->string('file_type')->nullable()->after('file_size');
        });

        // Re-add old file columns to classwork_tb  
        Schema::table('classwork_tb', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('test_description');
            $table->string('file_name')->nullable()->after('file_path');
            $table->bigInteger('file_size')->nullable()->after('file_name');
            $table->string('file_type')->nullable()->after('file_size');
        });
    }
};
