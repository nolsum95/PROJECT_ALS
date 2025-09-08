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
          Schema::create('modules_tb', function (Blueprint $table){
            $table->id('modules_id');
            $table->foreignId('fk_cai_id');
            $table->foreignId('fk_learner_id');
            $table->string('subject');
            $table->string('description');
            $table->timestamps();


            // User to Learner
            $table->foreign('fk_cai_id')->references('cai_id')->on('cai_tb')->onDelete('cascade');
            $table->foreign('fk_learner_id')->references('learner_id')->on('learner_tb')->onDelete('cascade');
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
