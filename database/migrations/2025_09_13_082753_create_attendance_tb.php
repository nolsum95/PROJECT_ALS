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
        Schema::create('attendance_tb', function (Blueprint $table) {
            $table->id('attendance_id');
            $table->foreignId('learner_id')->constrained('learner_tb', 'learner_id')->onDelete('cascade');
            $table->foreignId('cai_id')->constrained('cai_tb', 'cai_id')->onDelete('cascade');
            $table->foreignId('clc_id')->constrained('clc_tb', 'clc_id')->onDelete('cascade');
            $table->enum('status', ['Present', 'Absent', 'Excused']);
            $table->date('attendance_date');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_tb');
    }
};