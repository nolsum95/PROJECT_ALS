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
         Schema::create('cai_tb', function (Blueprint $table){
            $table->id('cai_id');
            $table->foreignId('fk_userId');
            $table->string('lastname');
            $table->string('firstname');
            $table->string('middlename');
            $table->enum('gender',['Male','Female','Others']);
             $table->string('assigned_clc');
              $table->enum('status',['Active','Inactive']);
            $table->timestamps();


            // User to Cai
              $table->foreign('fk_userId')->references('user_id')->on('user_tb')->onDelete('cascade');
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
