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
        Schema::table('modules_tb', function (Blueprint $table) {
            // Make fk_cai_id nullable since Admin will create modules
            $table->foreignId('fk_cai_id')->nullable()->change();
            
            // Add CLC assignment for modules
            $table->foreignId('fk_clc_id')->nullable()->constrained('clc_tb', 'clc_id')->onDelete('cascade')->after('fk_cai_id');
            
            // Add admin creator tracking
            $table->foreignId('created_by_admin')->nullable()->constrained('user_tb', 'user_id')->onDelete('set null')->after('fk_clc_id');
            
            // Add module status
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active')->after('content_type');
            
            // Add assignment date
            $table->timestamp('assigned_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules_tb', function (Blueprint $table) {
            $table->dropForeign(['fk_clc_id']);
            $table->dropForeign(['created_by_admin']);
            $table->dropColumn([
                'fk_clc_id',
                'created_by_admin', 
                'status',
                'assigned_at'
            ]);
            
            // Restore fk_cai_id as not nullable
            $table->foreignId('fk_cai_id')->nullable(false)->change();
        });
    }
};
