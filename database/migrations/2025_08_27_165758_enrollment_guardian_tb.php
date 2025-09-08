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
        Schema::create('enrollment_guardian_tb', function (Blueprint $table) {
            $table->id('guardian_id');
            $table->foreignId('fk_enrollment_id');
            // Father 
            $table->string('pa_lastname');
            $table->string('pa_firstname');
            $table->string('pa_middlename');
            $table->string('pa_occupation');
            //  Mother
            $table->string('ma_lastname');
            $table->string('ma_firstname');
            $table->string('ma_middlename');
            $table->string('ma_occupation');


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
