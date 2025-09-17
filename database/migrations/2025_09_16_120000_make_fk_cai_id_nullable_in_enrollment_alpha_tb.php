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
            // Drop the existing foreign key constraint
            $table->dropForeign(['fk_cai_id']);
            
            // Modify the column to be nullable
            $table->unsignedBigInteger('fk_cai_id')->nullable()->change();
            
            // Re-add the foreign key constraint with nullable support
            $table->foreign('fk_cai_id')->references('cai_id')->on('cai_tb')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            // Drop the nullable foreign key
            $table->dropForeign(['fk_cai_id']);
            
            // Make the column not nullable again
            $table->unsignedBigInteger('fk_cai_id')->nullable(false)->change();
            
            // Re-add the original foreign key constraint
            $table->foreign('fk_cai_id')->references('cai_id')->on('cai_tb')->onDelete('cascade');
        });
    }
};
