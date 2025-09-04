<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollment_alpha_tb', 'created_user_id')) {
                $table->unsignedBigInteger('created_user_id')->nullable()->after('enrollee_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('enrollment_alpha_tb', function (Blueprint $table) {
            if (Schema::hasColumn('enrollment_alpha_tb', 'created_user_id')) {
                $table->dropColumn('created_user_id');
            }
        });
    }
};



