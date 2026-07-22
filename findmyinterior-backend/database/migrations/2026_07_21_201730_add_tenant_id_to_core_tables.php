<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'categories', 'listings', 'offers', 'privilege_cards', 
            'builders', 'suppliers', 'workers', 
            'requirements', 'projects', 'rfqs', 'worker_jobs'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    // We add it as nullable first to allow backfilling, then we can make it non-nullable if needed
                    $table->foreignId('tenant_id')->nullable()->after('id')->constrained('tenants')->onDelete('cascade');
                });
            }
        }

        // Backfill data
        // For categories and listings, use the platform column if it exists
        
        if (Schema::hasColumn('categories', 'platform')) {
            DB::statement("UPDATE categories SET tenant_id = 1 WHERE platform IN ('findmyinterior', 'both')");
            DB::statement("UPDATE categories SET tenant_id = 2 WHERE platform = 'truedial'");
            
            // Drop platform column
            Schema::table('categories', function (Blueprint $table) {
                // Drop index if using SQLite compatibility (Laravel handles it safely mostly, but we drop index first)
                $table->dropIndex(['platform']);
                $table->dropColumn('platform');
            });
        } else {
            DB::statement("UPDATE categories SET tenant_id = 1");
        }

        if (Schema::hasColumn('listings', 'platform')) {
            DB::statement("UPDATE listings SET tenant_id = 1 WHERE platform IN ('findmyinterior', 'both')");
            DB::statement("UPDATE listings SET tenant_id = 2 WHERE platform = 'truedial'");
            
            Schema::table('listings', function (Blueprint $table) {
                $table->dropIndex(['platform']);
                $table->dropColumn('platform');
            });
        } else {
            DB::statement("UPDATE listings SET tenant_id = 1");
        }

        // Default all other tables to Tenant 1 (Find My Interior)
        $defaultTenantTables = [
            'builders', 'suppliers', 'workers', 
            'requirements', 'projects', 'rfqs', 'worker_jobs'
        ];
        
        foreach ($defaultTenantTables as $tableName) {
            if (Schema::hasTable($tableName)) {
                DB::statement("UPDATE {$tableName} SET tenant_id = 1");
            }
        }
        
        if (Schema::hasTable('offers')) {
             DB::statement("UPDATE offers SET tenant_id = 2"); // Offers are TRUEDIAL for now
        }
        
        if (Schema::hasTable('privilege_cards')) {
             DB::statement("UPDATE privilege_cards SET tenant_id = 2"); // Privilege cards are TRUEDIAL for now
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'categories', 'listings', 'offers', 'privilege_cards', 
            'builders', 'suppliers', 'workers', 
            'requirements', 'projects', 'rfqs', 'worker_jobs'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'tenant_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['tenant_id']);
                    $table->dropColumn('tenant_id');
                });
            }
        }
        
        if (Schema::hasTable('categories')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->enum('platform', ['findmyinterior', 'truedial', 'both'])->default('both');
            });
        }
        
        if (Schema::hasTable('listings')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->enum('platform', ['findmyinterior', 'truedial', 'both'])->default('both');
            });
        }
    }
};
