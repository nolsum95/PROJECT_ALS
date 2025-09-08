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
        Schema::create('questionnaire_tb', function (Blueprint $table) {
            $table->id('qn_id');
            $table->foreignId('fk_classwork_id')->constrained('classwork_tb', 'classwork_id')->onDelete('cascade');
            $table->foreignId('fk_subject_id')->constrained('subject_tb', 'subject_id')->onDelete('cascade');
            $table->integer('time_duration')->nullable(); // in minutes
            $table->string('title')->nullable();
            $table->text('description')->nullable();
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
