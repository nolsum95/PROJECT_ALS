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
        Schema::create('classwork_tb', function (Blueprint $table) {
            $table->id('classwork_id');
            $table->foreignId('fk_cai_id')->constrained('cai_tb', 'cai_id')->onDelete('cascade');
            $table->enum('test_level', ['reviewer', 'pretest', 'posttest']);
            $table->timestamps();
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
