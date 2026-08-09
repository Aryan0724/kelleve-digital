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
                    '1 Business Profile',
                    'Up to 10 Portfolio Images'
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
                'price_yearly'           => 4999.00,
                'features'               => [
                    'Up to 100 Portfolio Images',
                    'Display Website Link on Profile',
                    'Display WhatsApp Contact Button'
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
                'name'                   => 'Business',
                'slug'                   => 'business',
                'price_monthly'          => 1999.00,
                'price_yearly'           => 11999.00,
                'features'               => [
                    'Unlimited Portfolio Images',
                    'View All Customer Leads',
                    'Featured Profile Placement'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 9999,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => true,
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => false,
                'is_featured_listing'    => true,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Premium',
                'slug'                   => 'premium',
                'price_monthly'          => 2999.00,
                'price_yearly'           => 24999.00,
                'features'               => [
                    'Unlimited Portfolio Images',
                    'Gold Verified Badge',
                    'View All Customer Leads',
                    'Featured Profile Placement'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 9999,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => true,
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
