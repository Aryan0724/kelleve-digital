<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeds the canonical roles required by all tests.
 * These are normally created by the migration 2026_06_20_050915_update_roles_for_ecosystem.
 * Since DatabaseTruncation wipes the roles table between test runs, this seeder
 * must be called explicitly in test setup to restore them.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Homeowner',         'slug' => 'homeowner'],
            ['name' => 'Interior Designer',  'slug' => 'interior_designer'],
            ['name' => 'Interior Company',   'slug' => 'interior_company'],
            ['name' => 'Architect',          'slug' => 'architect'],
            ['name' => 'Contractor',         'slug' => 'contractor'],
            ['name' => 'Builder',            'slug' => 'builder'],
            ['name' => 'Material Supplier',  'slug' => 'material_supplier'],
            ['name' => 'Skilled Worker',     'slug' => 'skilled_worker'],
            ['name' => 'Business',           'slug' => 'business'],
            ['name' => 'Professional',       'slug' => 'professional'],
            ['name' => 'Worker',             'slug' => 'worker'],
            ['name' => 'Supplier',           'slug' => 'supplier'],
            ['name' => 'Admin',              'slug' => 'admin'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                ['name' => $role['name'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
