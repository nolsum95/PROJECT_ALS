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
            $table->enum('enrollee_status', ['Applied', 'Enrolled', 'Pre-enrolled'])
                ->default('Applied')
                ->after('civil_status'); // Place after civil_status
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            $table->dropColumn('enrollee_status');
        });
    }
};
