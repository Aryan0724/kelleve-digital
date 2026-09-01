<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';

    /**
     * Fix all schema gaps identified in production audit:
     * 1. listings: missing achievements, languages, budget_tier columns
     * 2. projects: FK constraint on category_id fails because categories table is empty
     * 3. Seed default categories so requirements/projects can be created
     */
    public function up(): void
    {
        // ─── 1. Add missing columns to listings ──────────────────────────────
        Schema::connection('truedial_mysql')->table('listings', function (Blueprint $table) {
            if (!Schema::connection('truedial_mysql')->hasColumn('listings', 'achievements')) {
                $table->json('achievements')->nullable()->after('availability');
            }
            if (!Schema::connection('truedial_mysql')->hasColumn('listings', 'languages')) {
                $table->json('languages')->nullable()->after('achievements');
            }
            if (!Schema::connection('truedial_mysql')->hasColumn('listings', 'budget_tier')) {
                $table->string('budget_tier', 100)->nullable()->after('languages');
            }
        });

        // ─── 2. Seed default categories if the table is empty ─────────────────
        // Without categories, posting a requirement crashes with FK violation
        if (DB::connection('fmi_mysql')->table('categories')->count() === 0) {
            $now = now();
            DB::connection('fmi_mysql')->table('categories')->insert([
                ['tenant_id' => null, 'name' => 'Interior Designer', 'slug' => 'interior-designer', 'description' => 'Professional interior design services', 'is_active' => 1, 'sort_order' => 1, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Architect',         'slug' => 'architect',         'description' => 'Architecture and structural design',     'is_active' => 1, 'sort_order' => 2, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Contractor',        'slug' => 'contractor',        'description' => 'Civil and construction contractors',      'is_active' => 1, 'sort_order' => 3, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Skilled Worker',    'slug' => 'skilled-worker',    'description' => 'Skilled tradespeople and labour',         'is_active' => 1, 'sort_order' => 4, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Supplier',          'slug' => 'supplier',          'description' => 'Material and product suppliers',           'is_active' => 1, 'sort_order' => 5, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Builder',           'slug' => 'builder',           'description' => 'Real-estate builders and developers',     'is_active' => 1, 'sort_order' => 6, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Brand',             'slug' => 'brand',             'description' => 'Interior brands and product companies',   'is_active' => 1, 'sort_order' => 7, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
                ['tenant_id' => null, 'name' => 'Other',             'slug' => 'other',             'description' => 'Other professional services',             'is_active' => 1, 'sort_order' => 8, 'icon' => null, 'image' => null, 'parent_id' => null, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        // ─── 3. Make projects.category_id nullable to prevent hard crashes ─────
        // Until categories are reliably populated from the frontend, make this nullable
        // so a bad category_id doesn't fail the whole requirement submission.
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::connection('fmi_mysql')->hasColumn('projects', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::connection('truedial_mysql')->table('listings', function (Blueprint $table) {
            $cols = [];
            foreach (['achievements', 'languages', 'budget_tier'] as $col) {
                if (Schema::connection('truedial_mysql')->hasColumn('listings', $col)) {
                    $cols[] = $col;
                }
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
