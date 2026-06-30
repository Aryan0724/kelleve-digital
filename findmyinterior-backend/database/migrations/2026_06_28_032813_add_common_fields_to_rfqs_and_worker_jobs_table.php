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
        Schema::table('rfqs', function (Blueprint $table) {
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('opportunity_type')->nullable();
            $table->string('requirement_type')->nullable();
            $table->string('creator_role')->nullable();
            $table->json('target_roles')->nullable();
            $table->decimal('budget_min', 12, 2)->nullable();
            $table->decimal('budget_max', 12, 2)->nullable();
        });

        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('opportunity_type')->nullable();
            $table->string('requirement_type')->nullable();
            $table->string('creator_role')->nullable();
            $table->json('target_roles')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rfqs_and_worker_jobs', function (Blueprint $table) {
            //
        });
    }
};
