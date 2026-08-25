<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionSeeder extends Seeder
{
    /**
     * Run the database seeds for a live production environment.
     * This ONLY seeds reference tables and configurations, NOT mock users.
     */
    public function run(): void
    {
        // Safety check to ensure we don't accidentally run in a populated database without caution
        // We will just run the seeders. If data exists, it should be handled safely by the individual seeders (using firstOrCreate)
        
        $this->command->info('Starting Production Seeding...');

        // 1. Tenants (Required for the TenantResolverMiddleware)
        $this->call(TenantSeeder::class);
        $this->command->info('Tenants seeded.');

        // 2. Roles & Permissions (Admin)
        $this->call(AdminSeeder::class);
        $this->command->info('Admin roles seeded.');

        // 3. Geography (Districts & Cities)
        $this->call(DistrictSeeder::class);
        $this->call(CitySeeder::class);
        $this->call(LocationSeeder::class);
        $this->command->info('Geography data seeded.');

        // 4. Core Domain Models (Categories, Subscriptions, Opportunity Types)
        $this->call(CategorySeeder::class);
        $this->call(SubscriptionPlanSeeder::class);
        $this->call(OpportunityTypeSeeder::class);
        $this->command->info('Core domain data seeded (Categories, Subscriptions, etc).');

        $this->command->info('Production Seeding Completed Successfully! You are ready to launch.');
    }
}
