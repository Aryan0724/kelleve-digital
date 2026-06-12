<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Run in strict dependency order
        $this->call([
            AdminSeeder::class,           // Creates admin user
            DistrictSeeder::class,        // Bihar's 38 districts
            CitySeeder::class,            // Major cities per district
            CategorySeeder::class,        // 10 marketplace categories
            SubscriptionPlanSeeder::class, // Basic, Professional, Premium

            // ── Marketplace Seed Data (makes the platform look alive) ──────────
            MarketplaceSeeder::class,
            BuilderSeeder::class,
            SupplierSeeder::class,
            WorkerSeeder::class,
            RequirementSeeder::class,
            InquirySeeder::class,
            ReviewSeeder::class,
            BlogSeeder::class,
            SeoPageSeeder::class,
        ]);
    }
}
