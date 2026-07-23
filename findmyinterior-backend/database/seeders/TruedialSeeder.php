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
        $tenant = \App\Models\Tenant::find($tenantId);
        if ($tenant) {
            app(TenantContext::class)->setTenant($tenant);
        }

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
        $vendorRole = \App\Models\Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business (Truedial)']);
        $customerRole = \App\Models\Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer (Truedial)']);
        if ($vendorRole && !$vendor->roles()->where('role_id', $vendorRole->id)->exists()) {
            $vendor->roles()->attach($vendorRole->id);
        }

        // Create a basic listing for the vendor
        if ($vendor) {
            $category = \App\Models\Category::first();
            $city = \App\Models\City::first();
            $listing = \App\Models\Listing::firstOrCreate([
                'user_id' => $vendor->id,
                'tenant_id' => $tenantId,
            ], [
                'title' => 'Truedial Vendor Business',
                'slug' => 'truedial-vendor-business',
                'description' => 'A test business for truedial',
                'category_id' => $category ? $category->id : 1,
                'city_id' => $city ? $city->id : 1,
                'district_id' => null,
                'city' => 'Delhi',
                'district' => 'New Delhi',
                'state' => 'Delhi',
                'status' => 'active',
                'phone' => '+919876543210',
            ]);
        }

        // Truedial Customer
        $customer = User::firstOrCreate(['email' => 'customer@truedial.in'], [
            'name' => 'Truedial Customer',
            'password' => Hash::make('password123'),
        ]);
        $customerRole = \App\Models\Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer (Truedial)']);
        if ($customerRole && !$customer->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer->roles()->attach($customerRole->id);
        }
    }
}
