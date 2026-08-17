<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OpportunityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'type' => 'HOME_INTERIOR',
                'creator_roles' => ['homeowner', 'builder'],
                'target_roles' => ['interior_designer', 'contractor', 'architect'],
            ],
            [
                'type' => 'MATERIAL_REQUEST',
                'creator_roles' => ['contractor', 'interior_designer', 'builder', 'homeowner'],
                'target_roles' => ['supplier'],
            ],
            [
                'type' => 'LABOUR_REQUEST',
                'creator_roles' => ['contractor', 'builder'],
                'target_roles' => ['worker'],
            ],
            [
                'type' => 'SUBCONTRACT_REQUEST',
                'creator_roles' => ['contractor', 'builder'],
                'target_roles' => ['contractor'],
            ],
        ];

        foreach ($types as $type) {
            \App\Models\OpportunityType::updateOrCreate(['type' => $type['type']], $type);
        }
    }
}
