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
        Schema::table('modules_tb', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('description');
            $table->string('file_name')->nullable()->after('file_path');
            $table->string('file_type')->nullable()->after('file_name'); // pdf, doc, docx, jpg, png, etc.
            $table->bigInteger('file_size')->nullable()->after('file_type'); // in bytes
            $table->text('content')->nullable()->after('file_size'); // For text-based content
            $table->enum('content_type', ['file', 'text', 'mixed'])->default('text')->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules_tb', function (Blueprint $table) {
            $table->dropColumn([
                'file_path',
                'file_name', 
                'file_type',
                'file_size',
                'content',
                'content_type'
            ]);
        });
    }
};
