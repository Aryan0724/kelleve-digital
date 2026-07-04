<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'bid_fee_interior', 'value' => '99', 'description' => 'Bid Fee for Interior Designers (₹)'],
            ['key' => 'bid_fee_architect', 'value' => '99', 'description' => 'Bid Fee for Architects (₹)'],
            ['key' => 'bid_fee_contractor', 'value' => '49', 'description' => 'Bid Fee for Contractors (₹)'],
            ['key' => 'bid_fee_builder', 'value' => '149', 'description' => 'Bid Fee for Builders (₹)'],
            ['key' => 'bid_fee_supplier', 'value' => '29', 'description' => 'Bid Fee for Material Suppliers (₹)'],
            ['key' => 'platform_commission_percent', 'value' => '0', 'description' => 'Platform Commission % on milestones'],
            ['key' => 'contact_unlock_fee', 'value' => '49', 'description' => 'Default fee to unlock contact details (₹)'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'description' => $setting['description']]
            );
        }
    }
}
