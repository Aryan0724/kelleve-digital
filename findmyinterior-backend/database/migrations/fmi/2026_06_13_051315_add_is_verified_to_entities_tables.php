<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = ['builders', 'suppliers', 'workers'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->boolean('is_verified')->default(false);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['builders', 'suppliers', 'workers'];
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('is_verified');
            });
        }
    }
};
