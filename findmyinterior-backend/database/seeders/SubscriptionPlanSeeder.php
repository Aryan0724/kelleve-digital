<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'                   => 'Starter',
                'slug'                   => 'starter',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    'Basic Business Profile',
                    'Upload Portfolio Images',
                    'Access to Lead Board'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 10,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false,
                'can_add_website'        => false,
                'can_add_whatsapp'       => false,
                'is_gold_verified'       => false,
                'is_featured_listing'    => false,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'professional',
                'price_monthly'          => 999.00,
                'price_yearly'           => 9999.00,
                'features'               => [
                    'Website Link on Profile',
                    'WhatsApp Contact Button',
                    'Priority Support'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 100,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false, 
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => false,
                'is_featured_listing'    => false,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Premium',
                'slug'                   => 'premium',
                'price_monthly'          => 2999.00,
                'price_yearly'           => 24999.00,
                'features'               => [
                    'Gold Verified Badge',
                    'Featured Profile Placement',
                    'All Professional Features'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 999,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false,
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => true,
                'is_featured_listing'    => true,
                'is_active'              => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
