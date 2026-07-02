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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('payment_status')->default('Unpaid')->after('status');
        });

        Schema::table('rfqs', function (Blueprint $table) {
            $table->string('payment_status')->default('Unpaid')->after('status');
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->string('payment_status')->default('Unpaid')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('rfqs', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
    }
};
