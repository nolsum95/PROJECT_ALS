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
            // Make fk_cai_id nullable for admin-created tests
            $table->foreignId('fk_cai_id')->nullable()->change();
            
            // Add CLC association for targeted posting
            $table->foreignId('fk_clc_id')->nullable()->constrained('clc_tb', 'clc_id')->onDelete('cascade');
            
            // Add posting status and scheduling
            $table->enum('posting_status', ['draft', 'posted', 'scheduled', 'archived'])->default('draft');
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('scheduled_post_at')->nullable();
            $table->timestamp('available_until')->nullable();
            
            // Add attempt limits for reviewers
            $table->integer('max_attempts')->nullable()->default(null); // null = unlimited
            $table->boolean('is_practice_mode')->default(false); // for reviewers vs actual exams
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            //
        });
    }
};
