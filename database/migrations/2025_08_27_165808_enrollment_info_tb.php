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
        Schema::create('enrollment_information_tb',function (Blueprint $table){
            $table->id('edin_id');
            $table->foreignId('fk_enrollment_id');
            $table->string('lastLevelCompleted');
            $table->string('nonCompletionReason');  //If Other is chosen, proceed to custom_reason
            $table->string('custom_reason')->nullable();
            $table->enum('hasAttendedAls',['Yes','No']);
            $table->string('alsProgramAttended')->nullable();
            $table->enum('hasCompletedAls',['Yes','No']); // If yes, proceed to next, If No, Proceed to alsNonCompletedReason
            $table->string('alsNonCompletedReason')->nullable(); 


            $table->foreign('fk_enrollment_id')->references('enrollment_id')->on('enrollment_alpha_tb')->onDelete('cascade');
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
