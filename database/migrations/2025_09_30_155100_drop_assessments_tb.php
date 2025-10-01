<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // First drop FK from learner_attempt_tb that references assessments_tb
        if (Schema::hasTable('learner_attempt_tb')) {
            Schema::table('learner_attempt_tb', function (Blueprint $table) {
                // Drop foreign key if present
                try {
                    $table->dropForeign(['assessment_id']);
                } catch (\Throwable $e) {
                    // ignore if FK already removed
                }
                // Drop the column if exists
                if (Schema::hasColumn('learner_attempt_tb', 'assessment_id')) {
                    $table->dropColumn('assessment_id');
                }
            });
        }

        // Drop the assessments table
        Schema::dropIfExists('assessments_tb');
    }

    public function down(): void
    {
        // Recreate the assessments table to rollback this migration
        Schema::create('assessments_tb', function (Blueprint $table) {
            $table->bigIncrements('assessment_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->enum('assessment_type', ['pretest', 'posttest']);
            $table->dateTime('schedule_date')->nullable();
            $table->unsignedBigInteger('clc_id');
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->timestamps();

            $table->foreign('clc_id')->references('clc_id')->on('clc_tb')->onDelete('cascade');
        });

        // Restore assessment_id column and foreign key on learner_attempt_tb
        if (Schema::hasTable('learner_attempt_tb') && !Schema::hasColumn('learner_attempt_tb', 'assessment_id')) {
            Schema::table('learner_attempt_tb', function (Blueprint $table) {
                $table->foreignId('assessment_id')->nullable()->constrained('assessments_tb', 'assessment_id')->onDelete('cascade')->after('fk_qn_id');
            });
        }
    }
};
