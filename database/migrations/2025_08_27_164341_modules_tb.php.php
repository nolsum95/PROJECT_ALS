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
            $table->id('module_id');
            $table->foreignId('fk_cai_id');
            $table->string('subject');
            $table->string('description');
            $table->timestamps();

            $table->foreign('fk_cai_id')->references('cai_id')->on('cai_tb')->onDelete('cascade');
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
