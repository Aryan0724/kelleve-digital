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
        Schema::table('requirements', function (Blueprint $table) {
            $table->string('opportunity_type', 50)->nullable()->after('description');
            $table->string('requirement_type', 50)->nullable()->after('opportunity_type');
            $table->string('creator_role', 50)->nullable()->after('requirement_type');
            $table->json('target_roles')->nullable()->after('creator_role');
            $table->string('project_category', 50)->nullable()->after('target_roles');
            $table->string('budget_tier', 50)->nullable()->after('budget_max');
        });
    }

    public function down(): void
    {
        Schema::table('requirements', function (Blueprint $table) {
            $table->dropColumn([
                'opportunity_type',
                'requirement_type',
                'creator_role',
                'target_roles',
                'project_category',
                'budget_tier'
            ]);
        });
    }
};
