<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Check if columns exist before adding them
            if (!Schema::hasColumn('classwork_tb', 'test_title')) {
                $table->string('test_title')->nullable()->after('test_level');
            }
            
            if (!Schema::hasColumn('classwork_tb', 'test_description')) {
                $table->text('test_description')->nullable()->after('test_title');
            }
            
            // Add file storage columns for PDF/DOCX reviewer files
            if (!Schema::hasColumn('classwork_tb', 'file_path')) {
                $table->string('file_path')->nullable()->after('test_description');
            }
            
            if (!Schema::hasColumn('classwork_tb', 'file_name')) {
                $table->string('file_name')->nullable()->after('file_path');
            }
            
            if (!Schema::hasColumn('classwork_tb', 'file_size')) {
                $table->bigInteger('file_size')->nullable()->after('file_name'); // in bytes
            }
            
            if (!Schema::hasColumn('classwork_tb', 'file_type')) {
                $table->string('file_type')->nullable()->after('file_size'); // pdf, doc, docx
            }
            
            if (!Schema::hasColumn('classwork_tb', 'created_by_admin')) {
                $table->foreignId('created_by_admin')->nullable()->constrained('user_tb', 'user_id')->onDelete('set null')->after('file_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            $columnsToDrop = [];
            
            // Only drop columns that exist
            if (Schema::hasColumn('classwork_tb', 'created_by_admin')) {
                $columnsToDrop[] = 'created_by_admin';
            }
            if (Schema::hasColumn('classwork_tb', 'file_type')) {
                $columnsToDrop[] = 'file_type';
            }
            if (Schema::hasColumn('classwork_tb', 'file_size')) {
                $columnsToDrop[] = 'file_size';
            }
            if (Schema::hasColumn('classwork_tb', 'file_name')) {
                $columnsToDrop[] = 'file_name';
            }
            if (Schema::hasColumn('classwork_tb', 'file_path')) {
                $columnsToDrop[] = 'file_path';
            }
            if (Schema::hasColumn('classwork_tb', 'test_description')) {
                $columnsToDrop[] = 'test_description';
            }
            if (Schema::hasColumn('classwork_tb', 'test_title')) {
                $columnsToDrop[] = 'test_title';
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
