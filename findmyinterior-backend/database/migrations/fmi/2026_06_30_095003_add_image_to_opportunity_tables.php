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
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'image')) {
                $table->string('image')->nullable();
            }
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('worker_jobs', 'image')) {
                $table->string('image')->nullable();
            }
        });

        Schema::table('rfqs', function (Blueprint $table) {
            if (!Schema::hasColumn('rfqs', 'image')) {
                $table->string('image')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'image')) {
                $table->dropColumn('image');
            }
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            if (Schema::hasColumn('worker_jobs', 'image')) {
                $table->dropColumn('image');
            }
        });

        Schema::table('rfqs', function (Blueprint $table) {
            if (Schema::hasColumn('rfqs', 'image')) {
                $table->dropColumn('image');
            }
        });
    }
};
