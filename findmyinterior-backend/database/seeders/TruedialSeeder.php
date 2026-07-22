<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Core\Tenancy\TenantContext;

class TruedialSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = 2;
        app(TenantContext::class)->setTenantId($tenantId);

        // Platform Admin
        $admin = User::firstOrCreate(['email' => 'admin@truedial.in'], [
            'name' => 'Truedial Admin',
            'password' => Hash::make('password123'),
        ]);
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole && !$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        // Truedial Vendor
        $vendor = User::firstOrCreate(['email' => 'vendor@truedial.in'], [
            'name' => 'Truedial Business',
            'password' => Hash::make('password123'),
        ]);
        $vendorRole = Role::where('slug', 'business')->firstOrCreate([
            'slug' => 'business',
            'name' => 'Business (Truedial)'
        ]);
        if ($vendorRole && !$vendor->roles()->where('role_id', $vendorRole->id)->exists()) {
            $vendor->roles()->attach($vendorRole->id);
        }

        // Truedial Customer
        $customer = User::firstOrCreate(['email' => 'customer@truedial.in'], [
            'name' => 'Truedial Customer',
            'password' => Hash::make('password123'),
        ]);
        $customerRole = Role::where('slug', 'customer')->firstOrCreate([
            'slug' => 'customer',
            'name' => 'Customer (Truedial)'
        ]);
        if ($customerRole && !$customer->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer->roles()->attach($customerRole->id);
        }
    }
}
