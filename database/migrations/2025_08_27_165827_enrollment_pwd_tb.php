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
        Schema::create('enrollment_pwd_tb', function (Blueprint $table) {
            $table->id('pwd_id');
            $table->foreignId('fk_enrollment_id');
            $table->enum('is_pwd',['Yes','No']);
            $table->string('disability_name')->nullable();
            $table->string('spec_health_prob');
            $table->string('visual_impairment');
            

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
