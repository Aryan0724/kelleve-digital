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
        Schema::table('listings', function (Blueprint $table) {
            if (!Schema::connection('fmi_mysql')->hasColumn('listings', 'achievements')) {
                $table->json('achievements')->nullable()->after('availability');
            }
            if (!Schema::connection('fmi_mysql')->hasColumn('listings', 'languages')) {
                $table->json('languages')->nullable()->after('achievements');
            }
            if (!Schema::connection('fmi_mysql')->hasColumn('listings', 'budget_tier')) {
                $table->string('budget_tier', 100)->nullable()->after('languages');
            }
        });

        // ─── 2. Seed default categories if the table is empty ─────────────────
        // Without categories, posting a requirement crashes with FK violation
        if (DB::connection('fmi_mysql')->table('categories')->count() === 0) {
            $now = now();
            DB::connection('fmi_mysql')->table('categories')->insert([
                ['name' => 'Interior Designer',    'slug' => 'interior-designer',    'description' => 'Professional interior design services', 'status' => 'active', 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Architect',             'slug' => 'architect',             'description' => 'Architecture and structural design',     'status' => 'active', 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Contractor',            'slug' => 'contractor',            'description' => 'Civil and construction contractors',      'status' => 'active', 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Skilled Worker',        'slug' => 'skilled-worker',        'description' => 'Skilled tradespeople and labour',        'status' => 'active', 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Supplier',              'slug' => 'supplier',              'description' => 'Material and product suppliers',          'status' => 'active', 'sort_order' => 5, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Builder',               'slug' => 'builder',               'description' => 'Real-estate builders and developers',    'status' => 'active', 'sort_order' => 6, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Brand',                 'slug' => 'brand',                 'description' => 'Interior brands and product companies',  'status' => 'active', 'sort_order' => 7, 'created_at' => $now, 'updated_at' => $now],
                ['name' => 'Other',                 'slug' => 'other',                 'description' => 'Other professional services',            'status' => 'active', 'sort_order' => 8, 'created_at' => $now, 'updated_at' => $now],
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
        Schema::table('listings', function (Blueprint $table) {
            $cols = [];
            foreach (['achievements', 'languages', 'budget_tier'] as $col) {
                if (Schema::connection('fmi_mysql')->hasColumn('listings', $col)) {
                    $cols[] = $col;
                }
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
