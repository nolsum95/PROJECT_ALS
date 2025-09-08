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
        Schema::create('distance_availability_tb', function (Blueprint $table) {
            $table->id('da_id');
            $table->foreignId('fk_enrollment_id');
            $table->string('distance_clc_km');
            $table->string('travel_hours_minutes');
            $table->string('transport_mode');

            // learner's availability 
            $table->string('mon');
            $table->string('tue');
            $table->string('wed');
            $table->string('thur');
            $table->string('fri');
            $table->string('sat');
            $table->string('sun');
            
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
