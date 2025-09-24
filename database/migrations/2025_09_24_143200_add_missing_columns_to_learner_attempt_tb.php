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
        Schema::table('learner_attempt_tb', function (Blueprint $table) {
            // Add status column for tracking attempt completion
            $table->enum('status', ['in_progress', 'completed', 'abandoned'])->default('in_progress')->after('attempt_no');
            
            // Add score column for storing exam/reviewer scores
            $table->decimal('score', 5, 2)->nullable()->after('status');
            
            // Add time tracking columns
            $table->integer('time_taken')->nullable()->comment('Time taken in minutes')->after('score');
            $table->timestamp('started_at')->nullable()->after('time_taken');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            
            // Add assessment_id for linking to assessments table
            $table->foreignId('assessment_id')->nullable()->constrained('assessments_tb', 'assessment_id')->onDelete('cascade')->after('fk_qn_id');
            
            // Add additional tracking fields
            $table->json('answers')->nullable()->comment('JSON storage of learner answers')->after('completed_at');
            $table->boolean('is_passed')->default(false)->after('answers');
            $table->decimal('passing_score', 5, 2)->default(75.00)->after('is_passed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('learner_attempt_tb', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'score',
                'time_taken',
                'started_at',
                'completed_at',
                'assessment_id',
                'answers',
                'is_passed',
                'passing_score'
            ]);
        });
    }
};
