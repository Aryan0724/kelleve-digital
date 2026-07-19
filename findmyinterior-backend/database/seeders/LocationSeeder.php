<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $locations = [
            ['name' => 'Patna', 'slug' => 'patna', 'is_active' => true],
            ['name' => 'Gaya', 'slug' => 'gaya', 'is_active' => true],
            ['name' => 'Muzaffarpur', 'slug' => 'muzaffarpur', 'is_active' => true],
            ['name' => 'Bhagalpur', 'slug' => 'bhagalpur', 'is_active' => true],
            ['name' => 'Darbhanga', 'slug' => 'darbhanga', 'is_active' => true],
            ['name' => 'Hajipur', 'slug' => 'hajipur', 'is_active' => true],
            ['name' => 'Purnia', 'slug' => 'purnia', 'is_active' => true],
            ['name' => 'Ranchi', 'slug' => 'ranchi', 'is_active' => true],
            ['name' => 'New Delhi', 'slug' => 'new-delhi', 'is_active' => true],
            ['name' => 'Mumbai', 'slug' => 'mumbai', 'is_active' => true],
            ['name' => 'Bangalore', 'slug' => 'bangalore', 'is_active' => true],
            ['name' => 'Kolkata', 'slug' => 'kolkata', 'is_active' => true],
            ['name' => 'Lucknow', 'slug' => 'lucknow', 'is_active' => true],
        ];

        foreach ($locations as $location) {
            DB::table('locations')->updateOrInsert(
                ['slug' => $location['slug']],
                $location
            );
        }
    }
}
