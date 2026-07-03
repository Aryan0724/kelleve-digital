<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class E2ESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First run the main database seeder for categories, cities, etc.
        $this->call(DatabaseSeeder::class);

        // Then create our deterministic E2E users
        $users = [
            [
                'name' => 'E2E Homeowner',
                'email' => 'homeowner@e2e.test',
                'role' => 'customer',
            ],
            [
                'name' => 'E2E Designer',
                'email' => 'designer@e2e.test',
                'role' => 'business',
            ],
            [
                'name' => 'E2E Contractor',
                'email' => 'contractor@e2e.test',
                'role' => 'business',
            ],
            [
                'name' => 'E2E Supplier',
                'email' => 'supplier@e2e.test',
                'role' => 'supplier',
            ],
            [
                'name' => 'E2E Worker',
                'email' => 'worker@e2e.test',
                'role' => 'worker',
            ],
            [
                'name' => 'E2E Builder',
                'email' => 'builder@e2e.test',
                'role' => 'builder',
            ]
        ];

        $roles = \Illuminate\Support\Facades\DB::table('roles')->pluck('id', 'slug');

        foreach ($users as $u) {
            $user = User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                    'primary_role_id' => $roles[$u['role']] ?? null,
                    'phone' => '999999999' . rand(0, 9),
                    'email_verified_at' => now(),
                ]
            );

            if (isset($roles[$u['role']])) {
                \Illuminate\Support\Facades\DB::table('user_roles')->updateOrInsert(
                    ['user_id' => $user->id, 'role_id' => $roles[$u['role']]]
                );
            }
        }
    }
}
