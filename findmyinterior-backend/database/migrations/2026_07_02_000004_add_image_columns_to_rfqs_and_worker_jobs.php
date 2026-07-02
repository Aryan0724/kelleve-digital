<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add TEXT image columns to rfqs and worker_jobs tables.
     * TEXT is required (not VARCHAR) because we store base64 data URIs
     * which can be 50-150KB as strings.
     * Also convert projects.image (added yesterday as string) to TEXT.
     */
    public function up(): void
    {
        // rfqs table
        Schema::table('rfqs', function (Blueprint $table) {
            if (!Schema::hasColumn('rfqs', 'image')) {
                $table->text('image')->nullable();
            }
        });

        // worker_jobs table
        Schema::table('worker_jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('worker_jobs', 'image')) {
                $table->text('image')->nullable();
            }
        });

        // projects table: change existing string column to text if it exists
        if (Schema::hasColumn('projects', 'image')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->text('image')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('rfqs', function (Blueprint $table) {
            $table->dropColumn('image');
        });
        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
