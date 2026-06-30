<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Requirement;
use App\Models\Project;
use App\Models\Rfq;
use App\Models\WorkerJob;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class E2ESeeder extends Seeder
{
    public function run(): void
    {
        // 1. Run Core Seeders (Deterministic Metadata)
        $this->call([
            AdminSeeder::class,
            DistrictSeeder::class,
            CitySeeder::class,
            CategorySeeder::class,
            SubscriptionPlanSeeder::class,
            OpportunityTypeSeeder::class,
        ]);

        // 2. Clear out any other non-admin users just in case
        User::where('email', '!=', 'Aryantiwari@findmyinterior.com')->delete();

        // 3. Create Specific E2E Users
        $usersToCreate = [
            [
                'email' => 'homeowner@e2e.test',
                'name' => 'E2E Homeowner',
                'phone' => '1000000001',
                'role' => 'customer',
                'wallet' => 0
            ],
            [
                'email' => 'designer@e2e.test',
                'name' => 'E2E Designer',
                'phone' => '1000000002',
                'role' => 'business',
                'wallet' => 5000
            ],
            [
                'email' => 'contractor@e2e.test',
                'name' => 'E2E Contractor',
                'phone' => '1000000003',
                'role' => 'business', // or contractor
                'wallet' => 5000
            ],
            [
                'email' => 'supplier@e2e.test',
                'name' => 'E2E Supplier',
                'phone' => '1000000004',
                'role' => 'supplier',
                'wallet' => 5000
            ],
            [
                'email' => 'worker@e2e.test',
                'name' => 'E2E Worker',
                'phone' => '1000000005',
                'role' => 'worker',
                'wallet' => 0
            ],
            [
                'email' => 'builder@e2e.test',
                'name' => 'E2E Builder',
                'phone' => '1000000006',
                'role' => 'builder',
                'wallet' => 50000
            ]
        ];

        $users = [];

        $e2eEmails = array_column($usersToCreate, 'email');
        User::withTrashed()->whereIn('email', $e2eEmails)->forceDelete();

        foreach ($usersToCreate as $u) {
            $user = User::create([
                'email' => $u['email'],
                'name' => $u['name'],
                'phone' => $u['phone'],
                'password' => Hash::make('password'),
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            $roleId = DB::table('roles')->where('slug', $u['role'])->value('id');
            if ($roleId) {
                DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
                $user->primary_role_id = $roleId;
                $user->save();
            }

            DB::table('wallets')->updateOrInsert(
                ['user_id' => $user->id],
                ['balance' => $u['wallet']]
            );
            
            $users[$u['email']] = $user;
        }

        // 4. Create Deterministic Requirements
        
        // 4a. A Project by Homeowner
        Project::create([
            'user_id' => $users['homeowner@e2e.test']->id,
            'category_id' => 1,
            'city_id' => 1,
            'district_id' => 1,
            'title' => 'E2E Living Room Renovation',
            'description' => 'A complete overhaul of the living room using modern aesthetics.',
            'project_type' => 'Full Home',
            'budget_min' => 500000,
            'budget_max' => 1000000,
            'status' => 'open',
            'city' => 'Patna',
            'district' => 'Patna',
            'name' => 'E2E Homeowner',
            'phone' => '1000000001',
            'opportunity_type' => 'HOME_INTERIOR',
            'requirement_type' => 'project',
            'creator_role' => 'customer',
            'target_roles' => ['designer', 'business', 'contractor'],
        ]);

        // 4b. An RFQ by Contractor
        Rfq::create([
            'user_id' => $users['contractor@e2e.test']->id,
            'title' => 'E2E Cement Order',
            'description' => 'Need 100 bags of UltraTech cement.',
            'material_type' => 'Cement',
            'quantity' => '100 bags',
            'delivery_location' => 'Patna',
            'timeline' => 'Immediate',
            'status' => 'open',
        ]);

        // 4c. A Worker Job by Builder
        WorkerJob::create([
            'user_id' => $users['builder@e2e.test']->id,
            'title' => 'E2E Need 5 Masons',
            'description' => 'Bricklaying for a 5-story building.',
            'skills_required' => json_encode(['Masonry', 'Bricklaying']),
            'location' => 'Patna',
            'duration' => '3 Months',
            'daily_rate' => 600,
            'status' => 'open',
        ]);

    }
}
