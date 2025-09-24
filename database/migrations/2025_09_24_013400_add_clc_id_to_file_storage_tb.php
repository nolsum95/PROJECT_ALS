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
        Schema::table('file_storage_tb', function (Blueprint $table) {
            // Add CLC association for file storage
            $table->foreignId('fk_clc_id')->nullable()->after('fileable_id')->constrained('clc_tb', 'clc_id')->onDelete('set null');
            $table->index('fk_clc_id'); // Add index for performance
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('file_storage_tb', function (Blueprint $table) {
            $table->dropForeign(['fk_clc_id']);
            $table->dropIndex(['fk_clc_id']);
            $table->dropColumn('fk_clc_id');
        });
    }
};
