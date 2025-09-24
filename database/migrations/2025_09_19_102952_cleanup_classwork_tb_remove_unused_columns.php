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
            // Remove unused columns that are not implemented in the current system
            $table->dropColumn([
                'posted_at',           // Redundant with scheduled_post_at
                'available_until',     // No expiration logic implemented
                'max_attempts',        // No attempt limiting logic
                'is_practice_mode'     // No practice mode distinction
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Re-add the columns if rollback is needed
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('available_until')->nullable();
            $table->integer('max_attempts')->nullable()->default(null);
            $table->boolean('is_practice_mode')->default(false);
        });
    }
};
