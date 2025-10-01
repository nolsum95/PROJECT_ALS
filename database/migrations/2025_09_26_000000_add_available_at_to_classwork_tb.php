<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            if (!Schema::hasColumn('classwork_tb', 'available_at')) {
                $table->dateTime('available_at')->nullable()->after('scheduled_post_at');
            }
        });

        // Backfill available_at from scheduled_post_at if present
        if (Schema::hasColumn('classwork_tb', 'scheduled_post_at') && Schema::hasColumn('classwork_tb', 'available_at')) {
            DB::table('classwork_tb')
                ->whereNull('available_at')
                ->whereNotNull('scheduled_post_at')
                ->update(['available_at' => DB::raw('scheduled_post_at')]);
        }
    }

    public function down(): void
    {
        Schema::table('classwork_tb', function (Blueprint $table) {
            if (Schema::hasColumn('classwork_tb', 'available_at')) {
                $table->dropColumn('available_at');
            }
        });
    }
};
