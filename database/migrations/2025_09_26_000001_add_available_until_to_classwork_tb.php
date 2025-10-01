<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            if (!Schema::hasColumn('classwork_tb', 'available_until')) {
                $table->dateTime('available_until')->nullable()->after('available_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            if (Schema::hasColumn('classwork_tb', 'available_until')) {
                $table->dropColumn('available_until');
            }
        });
    }
};
