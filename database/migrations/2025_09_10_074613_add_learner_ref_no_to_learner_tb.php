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
    Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
        $table->string('learner_ref_no')->nullable()->after('enrollment_id');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            //
        });
    }
};
