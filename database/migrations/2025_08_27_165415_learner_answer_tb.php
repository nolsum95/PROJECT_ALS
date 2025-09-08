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
        Schema::create('learner_answer_tb', function (Blueprint $table) {
            $table->id('answer_id');
            $table->foreignId('fk_learner_id')->constrained('learner_tb', 'learner_id')->onDelete('cascade');
            $table->foreignId('fk_question_id')->constrained('question_tb', 'question_id')->onDelete('cascade');
            $table->enum('selected_option', ['A', 'B', 'C', 'D'])->nullable();
            $table->boolean('is_correct')->default(false);
            $table->timestamp('answered_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
