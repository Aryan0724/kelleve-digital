<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Requirement;
use App\Models\Listing;
use Illuminate\Support\Facades\Hash;

class AuditTestUserSeeder extends Seeder
{
    public function run()
    {
        // 1. Roles
        $roles = [
            'admin' => Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']),
            'customer' => Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']),
            'business' => Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business Professional']),
            'supplier' => Role::firstOrCreate(['slug' => 'supplier'], ['name' => 'Material Supplier']),
            'worker' => Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Skilled Worker']),
            'builder' => Role::firstOrCreate(['slug' => 'builder'], ['name' => 'Builder']),
        ];

        // 2. Users
        $accounts = [
            ['name' => 'Customer Test', 'email' => 'customer_test@example.com', 'role' => 'customer', 'phone' => '9999999001'],
            ['name' => 'Designer Test', 'email' => 'designer_test@example.com', 'role' => 'business', 'phone' => '9999999002'],
            ['name' => 'Architect Test', 'email' => 'architect_test@example.com', 'role' => 'business', 'phone' => '9999999003'],
            ['name' => 'Contractor Test', 'email' => 'contractor_test@example.com', 'role' => 'business', 'phone' => '9999999004'],
            ['name' => 'Supplier Test', 'email' => 'supplier_test@example.com', 'role' => 'supplier', 'phone' => '9999999005'],
            ['name' => 'Worker Test', 'email' => 'worker_test@example.com', 'role' => 'worker', 'phone' => '9999999006'],
            ['name' => 'Admin Test', 'email' => 'admin_test@example.com', 'role' => 'admin', 'phone' => '9999999007'],
        ];

        foreach ($accounts as $acc) {
            $user = User::updateOrCreate(
                ['email' => $acc['email']],
                [
                    'name' => $acc['name'],
                    'phone' => $acc['phone'],
                    'password' => Hash::make('password123'),
                    'is_active' => true,
                    'is_verified' => true,
                ]
            );
            $user->roles()->syncWithoutDetaching([$roles[$acc['role']]->id]);

            // If business, create a listing
            if ($acc['role'] === 'business') {
                Listing::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'title' => $acc['name'] . ' Studio',
                        'slug' => \Illuminate\Support\Str::slug($acc['name'] . ' Studio'),
                        'description' => 'This is a seeded test description for the business listing.',
                        'city' => 'Patna',
                        'district' => 'Patna',
                        'state' => 'Bihar',
                        'phone' => $acc['phone'],
                        'category_id' => 1, // Assumes category 1 exists, safe fallback if using seeded categories
                        'status' => 'active',
                    ]
                );
            }
        }

        $customer = User::where('email', 'customer_test@example.com')->first();
        // 3. Seed a Requirement
        Requirement::updateOrCreate(
            ['user_id' => $customer->id, 'title' => 'Audit Test 3BHK Interior'],
            [
                'city' => 'Patna',
                'district' => 'Patna',
                'category_id' => 1,
                'project_type' => 'Residential',
                'description' => 'This is a seeded requirement for the audit tests.',
                'budget_min' => 500000,
                'budget_max' => 1500000,
                'status' => 'open',
                'name' => 'Customer Test',
                'phone' => '9999999001',
                'email' => 'customer_test@example.com'
            ]
        );
    }
}
