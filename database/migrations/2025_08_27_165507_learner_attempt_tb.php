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
        Schema::create('learner_attempt_tb', function (Blueprint $table) {
            $table->id('attempt_id');
            $table->foreignId('fk_learner_id')->constrained('learner_tb', 'learner_id')->onDelete('cascade');
            $table->foreignId('fk_qn_id')->constrained('questionnaire_tb', 'qn_id')->onDelete('cascade');
            $table->integer('attempt_no')->default(1);
            $table->date('attempt_date')->useCurrent();
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
