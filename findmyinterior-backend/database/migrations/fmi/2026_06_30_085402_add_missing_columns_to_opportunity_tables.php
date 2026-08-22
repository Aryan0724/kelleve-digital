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
        Schema::table('worker_jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('worker_jobs', 'city')) {
                $table->string('city')->nullable();
                $table->string('district')->nullable();
                $table->string('opportunity_type')->nullable();
                $table->string('requirement_type')->nullable();
                $table->string('creator_role')->nullable();
                $table->json('target_roles')->nullable();
                $table->string('image')->nullable();
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'city')) {
                $table->string('city')->nullable();
                $table->string('district')->nullable();
                $table->string('opportunity_type')->nullable();
                $table->string('requirement_type')->nullable();
                $table->string('project_category')->nullable();
                $table->decimal('budget_min', 15, 2)->nullable();
                $table->decimal('budget_max', 15, 2)->nullable();
                $table->string('creator_role')->nullable();
                $table->json('target_roles')->nullable();
                $table->string('image')->nullable();
                
                // Fields from Project model
                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->unsignedBigInteger('city_id')->nullable();
                $table->unsignedBigInteger('district_id')->nullable();
                $table->string('title')->nullable();
                $table->text('description')->nullable();
                $table->string('project_type')->nullable();
                $table->string('name')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('budget_tier')->nullable();
            }
        });

        Schema::table('rfqs', function (Blueprint $table) {
            if (!Schema::hasColumn('rfqs', 'city')) {
                $table->string('city')->nullable();
                $table->string('district')->nullable();
                $table->string('opportunity_type')->nullable();
                $table->string('requirement_type')->nullable();
                $table->string('creator_role')->nullable();
                $table->json('target_roles')->nullable();
                $table->string('image')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('opportunity_tables', function (Blueprint $table) {
            //
        });
    }
};
