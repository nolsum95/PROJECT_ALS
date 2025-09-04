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
        Schema::create('learner_tb', function (Blueprint $table) {

            $table->id('learner_id');
            $table->string('learner_re_no')->unique()->nullable();
            // FK to user_tb
            $table->foreignId('fk_userId');
            $table->foreign('fk_userId')
                ->references('user_id')
                ->on('user_tb')
                ->onDelete('cascade');

            $table->string('fullname');

            // FK to cai_tb
            $table->foreignId('assigned_cai')->nullable();
            $table->foreign('assigned_cai')
                ->references('cai_id')
                ->on('cai_tb')
                ->onDelete('set null');

            // FK to clc_tb
            $table->foreignId('assigned_clc')->nullable();
            $table->foreign('assigned_clc')
                ->references('clc_id')
                ->on('clc_tb')
                ->onDelete('set null');

            $table->enum('status', ['Active', 'Inactive']);
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('learner_tb');
    }
};
