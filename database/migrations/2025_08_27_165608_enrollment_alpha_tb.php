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
        Schema::create('enrollment_alpha_tb', function (Blueprint $table) {
            $table->id('enrollment_id');
            $table->foreignId('fk_cai_id');
            $table->string('lastname');
            $table->string('firstname');
            $table->string('middlename');
            $table->string('birthdate');
            $table->enum('gender', ['Male', 'Female', 'Others']);
            $table->string('extension_name');
            $table->string('mobile_no');
            $table->string('email_address');
            $table->string('religion');
            $table->string('mother_tongue');
            $table->string('civil_status');

            $table->timestamp('date_enrolled')->useCurrent();


            // User to Learner
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
