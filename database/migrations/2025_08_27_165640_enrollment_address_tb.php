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
        Schema::create('enrollment_address_tb',function(Blueprint $table){
            $table->id('address_id');
            $table->foreignId('fk_enrollment_id');
            $table->string('cur_house_no');
            $table->string('cur_streetname');
            $table->string('cur_barangay');
            $table->string('cur_municipality');
            $table->string('cur_province');
            $table->string('cur_zip_code');

            // nullable para pwede with or without data
              $table->string('perm_house_no')->nullable();
            $table->string('perm_streetname')->nullable();
            $table->string('perm_barangay')->nullable();
            $table->string('perm_municipality')->nullable();
            $table->string('perm_province')->nullable();
            $table->string('perm_zip_code')->nullable();


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
