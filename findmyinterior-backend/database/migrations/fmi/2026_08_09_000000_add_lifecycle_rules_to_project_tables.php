<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        $tables = ['requirements', 'projects', 'rfqs', 'worker_jobs'];
        
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    if (!Schema::hasColumn($table->getTable(), 'expires_at')) {
                        $table->timestamp('expires_at')->nullable();
                    }
                    if (!Schema::hasColumn($table->getTable(), 'extensions_count')) {
                        $table->integer('extensions_count')->default(0);
                    }
                    if (!Schema::hasColumn($table->getTable(), 'max_bids')) {
                        $table->integer('max_bids')->default(20);
                    }
                    if (!Schema::hasColumn($table->getTable(), 'max_unlocks')) {
                        $table->integer('max_unlocks')->default(10);
                    }
                });
            }
        }
    }

    public function down(): void
    {
        $tables = ['requirements', 'projects', 'rfqs', 'worker_jobs'];
        
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropColumn(['expires_at', 'extensions_count', 'max_bids', 'max_unlocks']);
                });
            }
        }
    }
};
