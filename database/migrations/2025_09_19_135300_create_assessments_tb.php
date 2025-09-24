<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments_tb', function (Blueprint $table) {
            $table->bigIncrements('assessment_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->enum('assessment_type', ['pretest', 'posttest']);
            $table->dateTime('schedule_date')->nullable();
            $table->unsignedBigInteger('clc_id');
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->timestamps();

            $table->foreign('clc_id')->references('clc_id')->on('clc_tb')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments_tb');
    }
};
