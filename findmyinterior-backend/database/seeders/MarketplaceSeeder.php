<?php

namespace Database\Seeders;

use App\Models\Bid;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        // 1. Create Users
        $homeowners = $this->createUsers('Homeowner', 10, ['customer'], $password);
        $designers = $this->createUsers('Designer', 20, ['business'], $password);
        $contractors = $this->createUsers('Contractor', 10, ['worker', 'business'], $password);
        $suppliers = $this->createUsers('Supplier', 5, ['supplier'], $password);

        $professionals = array_merge($designers, $contractors, $suppliers);

        // 2. Create Opportunities
        $opportunities = [];
        foreach ($homeowners as $homeowner) {
            for ($i = 0; $i < 5; $i++) {
                $opportunities[] = Requirement::create([
                    'user_id' => $homeowner->id,
                    'title' => "Project " . Str::random(5) . " for " . $homeowner->name,
                    'description' => "Looking for a professional to handle " . Str::random(10) . ".",
                    'budget' => rand(50000, 500000),
                    'budget_type' => 'fixed',
                    'city' => ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][rand(0, 3)],
                    'status' => 'published',
                    'property_type' => 'Apartment',
                    'requirement_type' => 'Interior Design',
                    'name' => $homeowner->name,
                    'phone' => '98765' . rand(10000, 99999),
                    'email' => $homeowner->email,
                    'target_roles' => ['business', 'worker'],
                ]);
            }
        }

        // 3. Create Bids
        foreach ($opportunities as $opportunity) {
            // Each opportunity gets 2 bids
            $selectedPros = array_rand($professionals, 2);
            foreach ($selectedPros as $proIndex) {
                $pro = $professionals[$proIndex];
                
                Bid::create([
                    'requirement_id' => $opportunity->id,
                    'professional_id' => $pro->id,
                    'company_name' => $pro->name . ' Co',
                    'contact_person' => $pro->name,
                    'amount' => $opportunity->budget * (rand(80, 120) / 100),
                    'estimated_cost' => $opportunity->budget * (rand(80, 120) / 100),
                    'timeline_days' => rand(15, 90),
                    'proposal_message' => "We can complete this project perfectly within your budget.",
                    'status' => 'submitted',
                    'smart_bid_score' => rand(60, 95),
                ]);
            }
        }
        
        $this->command->info('Marketplace Seeder completed: 10 Homeowners, 35 Professionals, 50 Opportunities, 100 Bids.');
    }

    private function createUsers(string $prefix, int $count, array $roles, string $password): array
    {
        $users = [];
        for ($i = 1; $i <= $count; $i++) {
            $user = User::create([
                'name' => "{$prefix} {$i}",
                'email' => strtolower($prefix) . "{$i}@example.com",
                'password' => $password,
                'phone' => '99999' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'role' => $roles[0], // primary role
                'roles' => $roles,
            ]);
            $users[] = $user;
        }
        return $users;
    }
}
