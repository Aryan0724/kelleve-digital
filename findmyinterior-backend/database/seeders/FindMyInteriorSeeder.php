<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Core\Tenancy\TenantContext;

class FindMyInteriorSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = 1;
        app(TenantContext::class)->setTenantId($tenantId);

        // Platform Admin
        $admin = User::firstOrCreate(['email' => 'admin@findmyinterior.com'], [
            'name' => 'FMI Admin',
            'password' => Hash::make('password123'),
        ]);
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole && !$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        // FMI Vendor
        $vendor = User::firstOrCreate(['email' => 'vendor@findmyinterior.com'], [
            'name' => 'FMI Vendor',
            'password' => Hash::make('password123'),
        ]);
        $vendorRole = Role::where('slug', 'interior_designer')->first();
        if ($vendorRole && !$vendor->roles()->where('role_id', $vendorRole->id)->exists()) {
            $vendor->roles()->attach($vendorRole->id);
        }

        // FMI Customer
        $customer = User::firstOrCreate(['email' => 'customer@findmyinterior.com'], [
            'name' => 'FMI Customer',
            'password' => Hash::make('password123'),
        ]);
        $customerRole = Role::where('slug', 'homeowner')->first();
        if ($customerRole && !$customer->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer->roles()->attach($customerRole->id);
        }
    }
}
