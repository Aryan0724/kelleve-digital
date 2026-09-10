<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Requirement;
use App\Models\Listing;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\VendorMetric;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuditTestUserSeeder extends Seeder
{
    public function run()
    {
        // 1. Roles
        $roles = [
            'admin'    => Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']),
            'customer' => Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']),
            'business' => Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business Professional']),
            'supplier' => Role::firstOrCreate(['slug' => 'supplier'], ['name' => 'Material Supplier']),
            'worker'   => Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Skilled Worker']),
            'builder'  => Role::firstOrCreate(['slug' => 'builder'], ['name' => 'Builder']),
        ];

        // 2. Canonical Plans
        $starterPlan = SubscriptionPlan::where('slug', 'starter')->first();
        $growthPlan  = SubscriptionPlan::where('slug', 'growth')->first();
        $proPlan     = SubscriptionPlan::where('slug', 'professional')->first();
        $elitePlan   = SubscriptionPlan::where('slug', 'elite')->first();

        // 3. Four Canonical Acceptance Test Accounts
        $testAccounts = [
            [
                'email'     => 'fmi_test_starter@test.local',
                'name'      => 'Starter Pro Test',
                'phone'     => '9800000001',
                'plan'      => $starterPlan,
                'is_active' => true,
                'metrics'   => ['total_response_minutes' => 0, 'response_count' => 0],
            ],
            [
                'email'     => 'fmi_test_growth@test.local',
                'name'      => 'Growth Pro Test',
                'phone'     => '9800000002',
                'plan'      => $growthPlan,
                'is_active' => true,
                'metrics'   => ['total_response_minutes' => 600, 'response_count' => 3],
            ],
            [
                'email'     => 'fmi_test_pro@test.local',
                'name'      => 'Professional Pro Test',
                'phone'     => '9800000003',
                'plan'      => $proPlan,
                'is_active' => true,
                'metrics'   => ['total_response_minutes' => 450, 'response_count' => 5], // avg 90m, but badge is trusted (not elite)
            ],
            [
                'email'     => 'fmi_test_elite@test.local',
                'name'      => 'Elite Pro Test',
                'phone'     => '9800000004',
                'plan'      => $elitePlan,
                'is_active' => true,
                'metrics'   => ['total_response_minutes' => 300, 'response_count' => 5], // avg 60m <= 120m + elite -> responds_fast = true
            ],
        ];

        foreach ($testAccounts as $acc) {
            $user = User::updateOrCreate(
                ['email' => $acc['email']],
                [
                    'name'        => $acc['name'],
                    'phone'       => $acc['phone'],
                    'password'    => Hash::make('password123'),
                    'is_active'   => true,
                    'is_verified' => true,
                ]
            );
            $user->roles()->syncWithoutDetaching([$roles['business']->id]);

            // Set up active subscription
            if ($acc['plan']) {
                UserSubscription::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'subscription_plan_id' => $acc['plan']->id,
                        'payment_id'           => null,
                        'billing_cycle'        => 'yearly',
                        'status'               => 'active',
                        'starts_at'            => now()->subDays(1),
                        'expires_at'           => now()->addYear(),
                    ]
                );
            }

            // Set up vendor metrics
            VendorMetric::updateOrCreate(
                ['vendor_id' => $user->id],
                [
                    'total_response_minutes' => $acc['metrics']['total_response_minutes'],
                    'response_count'         => $acc['metrics']['response_count'],
                    'review_count'           => 10,
                    'review_sum'             => 48,
                    'last_active_at'         => now(),
                ]
            );

            // Set up primary listing
            Listing::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'title'       => $acc['name'] . ' Studio',
                    'slug'        => Str::slug($acc['name'] . ' Studio'),
                    'description' => 'Test portfolio listing for ' . $acc['name'],
                    'city'        => 'Patna',
                    'district'    => 'Patna',
                    'state'       => 'Bihar',
                    'phone'       => $acc['phone'],
                    'category_id' => 1,
                    'status'      => 'active',
                ]
            );
        }

        // 4. Test Customer and Requirement
        $customer = User::updateOrCreate(
            ['email' => 'customer_test@example.com'],
            [
                'name'        => 'Customer Test',
                'phone'       => '9999999001',
                'password'    => Hash::make('password123'),
                'is_active'   => true,
                'is_verified' => true,
            ]
        );
        $customer->roles()->syncWithoutDetaching([$roles['customer']->id]);

        Requirement::updateOrCreate(
            ['user_id' => $customer->id, 'title' => 'Audit Test 3BHK Interior'],
            [
                'city'         => 'Patna',
                'district'     => 'Patna',
                'category_id'  => 1,
                'project_type' => 'Residential',
                'description'  => 'This is a seeded requirement for the audit tests.',
                'budget_min'   => 500000,
                'budget_max'   => 1500000,
                'status'       => 'open',
                'name'         => 'Customer Test',
                'phone'        => '9999999001',
                'email'        => 'customer_test@example.com',
            ]
        );
    }
}
