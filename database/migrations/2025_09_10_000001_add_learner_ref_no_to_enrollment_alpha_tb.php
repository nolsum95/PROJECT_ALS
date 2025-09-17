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
            if (!Schema::hasColumn('enrollment_alpha_tb', 'learner_ref_no')) {
                $table->string('learner_ref_no')->nullable()->after('civil_status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            if (Schema::hasColumn('enrollment_alpha_tb', 'learner_ref_no')) {
                $table->dropColumn('learner_ref_no');
            }
        });
    }
};


