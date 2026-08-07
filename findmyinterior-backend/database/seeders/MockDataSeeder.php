<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\BuilderProject;

class MockDataSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        if (!$user) {
            $this->command->error("No user found!");
            return;
        }

        // Builder Projects
        if (class_exists(BuilderProject::class)) {
            $builderProjects = [
                [
                    'title' => 'Sunrise Luxury Apartments',
                    'slug' => 'sunrise-luxury-apartments-' . rand(100,999),
                    'description' => 'Premium 3 and 4 BHK apartments in the heart of the city with world-class amenities like swimming pool, gym, and clubhouse.',
                    'project_type' => 'apartment',
                    'status' => 'upcoming',
                    'city' => 'Patna',
                    'address' => 'Bailey Road, Patna',
                    'possession_date' => '2027-01-01',
                    'price_range' => '80 Lakh - 1.2 Cr',
                    'is_featured' => true
                ],
                [
                    'title' => 'Green Valley Villas',
                    'slug' => 'green-valley-villas-' . rand(100,999),
                    'description' => 'Exclusive gated community of independent villas with private gardens and smart home automation.',
                    'project_type' => 'villa',
                    'status' => 'possession_ready',
                    'city' => 'Patna',
                    'address' => 'Danapur, Patna',
                    'possession_date' => '2025-06-01',
                    'price_range' => '1.5 Cr - 2.5 Cr',
                    'is_featured' => true
                ]
            ];

            $builder = \App\Models\Builder::first();
            foreach ($builderProjects as $data) {
                $data['builder_id'] = $builder ? $builder->id : 1;
                $data['tenant_id'] = 1;
                BuilderProject::create($data);
            }
            $this->command->info("Mock builder projects created.");
        }
    }
}
