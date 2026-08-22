<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Minimal seeder for Security tests.
 * Seeds only roles, permissions, and tenant — no geo data, no heavy fixtures.
 * This keeps security test suites fast (no CitySeeder/DistrictSeeder).
 */
class SecurityTestSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,              // Roles wiped by DatabaseTruncation — must restore first
            FindMyInteriorSeeder::class,    // Creates roles, tenant, 3 base users
            CategorySeeder::class,          // Required for listings and projects
            OpportunityTypeSeeder::class,   // Required for project creation
        ]);
    }
}
