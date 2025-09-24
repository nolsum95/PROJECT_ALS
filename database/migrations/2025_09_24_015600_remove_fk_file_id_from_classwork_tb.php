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
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['fk_file_id']);
            // Drop the column
            $table->dropColumn('fk_file_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Add the column back
            $table->foreignId('fk_file_id')->nullable()->after('fk_clc_id')->constrained('file_storage_tb', 'id')->onDelete('set null');
        });
    }
};
