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
        Schema::create('file_storage_tb', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic relationship columns
            $table->string('fileable_type'); // App\Models\Modules, App\Models\Classwork, etc.
            $table->unsignedBigInteger('fileable_id'); // module_id, classwork_id, etc.
            $table->index(['fileable_type', 'fileable_id']); // Composite index for performance
            
            // File metadata
            $table->string('file_path'); // Storage path
            $table->string('file_name'); // Current filename in storage
            $table->string('original_name'); // Original uploaded filename
            $table->bigInteger('file_size'); // File size in bytes
            $table->string('file_type'); // Extension: pdf, doc, docx, etc.
            $table->string('mime_type'); // MIME type: application/pdf, etc.
            $table->string('storage_disk')->default('public'); // Storage disk: public, s3, etc.
            
            // Metadata
            $table->foreignId('uploaded_by')->constrained('user_tb', 'user_id')->onDelete('cascade');
            $table->text('description')->nullable(); // Optional file description
            $table->json('metadata')->nullable(); // Additional metadata as JSON
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('file_storage_tb');
    }
};
