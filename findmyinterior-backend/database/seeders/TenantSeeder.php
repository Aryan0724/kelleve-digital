<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tenant::updateOrCreate(
            ['id' => 1],
            ['name' => 'FindMyInterior', 'domain' => 'findmyinterior.com', 'slug' => 'fmi', 'status' => 'active']
        );

        Tenant::updateOrCreate(
            ['id' => 2],
            ['name' => 'TrueDial', 'domain' => 'truedial.in', 'slug' => 'truedial', 'status' => 'active']
        );
    }
}
