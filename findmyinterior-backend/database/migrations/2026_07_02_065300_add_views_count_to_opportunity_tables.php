<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('budget_tier');
        });

        Schema::table('rfqs', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('status');
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('views_count');
        });

        Schema::table('rfqs', function (Blueprint $table) {
            $table->dropColumn('views_count');
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->dropColumn('views_count');
        });
    }
};
