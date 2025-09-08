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
         Schema::create('household_status_tb', function (Blueprint $table){
            $table->id('hhs_id');
            $table->foreignId('fk_enrollment_id');
            $table->enum('isIndegenous',['Yes','No']);
            $table->string('ipCommunityName')->nullable();
              $table->enum('is4PsMember',['Yes','No']);
            $table->string('household_Id_4Ps')->nullable();
           


            // enrollment alpha to household stats
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
