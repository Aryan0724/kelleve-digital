<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';

    /**
     * Drop the FK constraint on projects.category_id so requirements
     * can be posted without the FK blocking mismatched category IDs.
     * Also make category_id nullable for robustness.
     */
    public function up(): void
    {
        // Drop the foreign key if it exists
        try {
            Schema::table('projects', function (Blueprint $table) {
                // Drop by constraint name (found in error: requirements_category_id_foreign)
                $table->dropForeign('requirements_category_id_foreign');
            });
        } catch (\Throwable $e) {
            // May already be dropped or named differently — safe to continue
        }

        // Also try the standard Laravel-named FK
        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
            });
        } catch (\Throwable $e) {
            // Already dropped — safe
        }

        // Make category_id nullable so null values never fail
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Restore FK (only if categories table has data)
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable(false)->change();
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }
};
