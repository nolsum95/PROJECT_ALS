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
        // Update modules_tb to use polymorphic file storage
        Schema::table('modules_tb', function (Blueprint $table) {
            // Add foreign key to file_storage_tb only if it doesn't exist
            if (!Schema::hasColumn('modules_tb', 'fk_file_id')) {
                $table->foreignId('fk_file_id')->nullable()->constrained('file_storage_tb', 'id')->onDelete('set null')->after('content');
            }
            
            // Keep old columns temporarily for data migration
            // We'll remove them in a separate migration after data is migrated
        });

        // Update classwork_tb to use polymorphic file storage
        Schema::table('classwork_tb', function (Blueprint $table) {
            // Add foreign key to file_storage_tb only if it doesn't exist
            if (!Schema::hasColumn('classwork_tb', 'fk_file_id')) {
                $table->foreignId('fk_file_id')->nullable()->constrained('file_storage_tb', 'id')->onDelete('set null')->after('test_description');
            }
            
            // Keep old file columns temporarily for data migration
            // We'll remove them in a separate migration after data is migrated
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules_tb', function (Blueprint $table) {
            if (Schema::hasColumn('modules_tb', 'fk_file_id')) {
                $table->dropForeign(['fk_file_id']);
                $table->dropColumn('fk_file_id');
            }
        });

        Schema::table('classwork_tb', function (Blueprint $table) {
            if (Schema::hasColumn('classwork_tb', 'fk_file_id')) {
                $table->dropForeign(['fk_file_id']);
                $table->dropColumn('fk_file_id');
            }
        });
    }
};
