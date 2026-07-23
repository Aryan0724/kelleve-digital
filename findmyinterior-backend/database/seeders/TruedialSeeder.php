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

        // Create basic categories if not exist
        $restaurantCategory = \App\Models\Category::firstOrCreate(
            ['slug' => 'restaurants', 'tenant_id' => $tenantId],
            ['name' => 'Restaurants', 'is_active' => true]
        );

        // Create a basic listing for the vendor
        if ($vendor) {
            $category = \App\Models\Category::first();
            $city = \App\Models\City::first();
            
            // 1. General Business
            \App\Models\Listing::firstOrCreate([
                'user_id' => $vendor->id,
                'tenant_id' => $tenantId,
                'slug' => 'truedial-vendor-business',
            ], [
                'title' => 'Truedial Vendor Business',
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

            // 2. Restaurant Business
            \App\Models\Listing::firstOrCreate([
                'user_id' => $vendor->id,
                'tenant_id' => $tenantId,
                'slug' => 'the-great-indian-restaurant',
            ], [
                'title' => 'The Great Indian Restaurant',
                'description' => 'Authentic Indian Cuisine',
                'category_id' => $restaurantCategory->id,
                'city_id' => $city ? $city->id : 1,
                'district_id' => null,
                'city' => 'Mumbai',
                'district' => 'Andheri',
                'state' => 'Maharashtra',
                'status' => 'active',
                'phone' => '+919988776655',
                'is_verified' => true,
                'is_premium' => true,
                'avg_rating' => 4.8,
                'review_count' => 150,
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
