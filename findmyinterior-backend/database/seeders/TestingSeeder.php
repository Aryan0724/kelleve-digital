<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TestingSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FindMyInteriorSeeder::class, // Seeds Roles and Permissions and Tenant
            DistrictSeeder::class,
            CitySeeder::class,
            CategorySeeder::class,
            OpportunityTypeSeeder::class,
            SubscriptionPlanSeeder::class,
        ]);
    }
}
