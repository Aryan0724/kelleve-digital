<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Advertisement;

class AdvertisementSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Advertisement::truncate();
        \App\Models\AdvertisementStat::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        
        $ads = [
            [
                'title' => 'Sponsored: Buy Bulk Plywood at 20% Off',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800',
                'media_type' => 'image',
                'link' => '/materials',
                'target_role' => json_encode(['interior_designer', 'contractor', 'interior_company']),
                'is_active' => true,
                'priority' => 1,
            ],
            [
                'title' => 'Hire Top Interior Designers for your 3BHK',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
                'media_type' => 'image',
                'link' => '/professionals',
                'target_role' => json_encode(['homeowner', 'customer']),
                'is_active' => true,
                'priority' => 1,
            ]
        ];

        foreach ($ads as $ad) {
            Advertisement::create($ad);
        }
    }
}
