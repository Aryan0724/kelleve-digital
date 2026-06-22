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
                'creator_roles' => json_encode(['homeowner', 'builder']),
                'target_roles' => json_encode(['designer', 'contractor', 'architect']),
            ],
            [
                'type' => 'MATERIAL_REQUEST',
                'creator_roles' => json_encode(['contractor', 'designer', 'builder', 'homeowner']),
                'target_roles' => json_encode(['supplier']),
            ],
            [
                'type' => 'LABOUR_REQUEST',
                'creator_roles' => json_encode(['contractor', 'builder']),
                'target_roles' => json_encode(['worker']),
            ],
            [
                'type' => 'SUBCONTRACT_REQUEST',
                'creator_roles' => json_encode(['contractor', 'builder']),
                'target_roles' => json_encode(['contractor']),
            ],
        ];

        foreach ($types as $type) {
            \App\Models\OpportunityType::updateOrCreate(['type' => $type['type']], $type);
        }
    }
}
