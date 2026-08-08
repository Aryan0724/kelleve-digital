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
                    '1 Business Listing',
                    'Business Profile',
                    '10 Project Photos',
                    '2 Project Videos',
                    'Portfolio Showcase',
                    'Contact Form',
                    'Google Map Location',
                    'Customer Reviews',
                    '3 Service Categories',
                    'Working Hours',
                    'Mobile-Friendly Profile',
                    'Basic Search Visibility'
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
                    '1 Business Listing',
                    '100 Project Photos',
                    '10 YouTube/Vimeo Videos',
                    'Verified Business Badge',
                    'WhatsApp Chat',
                    'Click-to-Call',
                    'Website & Social Links',
                    'Higher Search Ranking',
                    'Quote Request Button',
                    'Performance Insights',
                    'Before & After Gallery',
                    'Fast Response Badge',
                    'Customer Trust Score'
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
                    '1 Business Listing',
                    'Unlimited Photos & Videos',
                    'Top Search Placement',
                    'Unlimited Lead Access',
                    'Download Leads (Excel)',
                    'Performance Reports',
                    'Verified Business Certificate',
                    'Multiple Contact Numbers'
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
                    '1 Business Listing',
                    'Top Search Priority',
                    'Gold Verified Badge',
                    'Premium Profile Design',
                    'Advanced Analytics',
                    'Business Growth Reports',
                    'Premium Advertisement Banner',
                    'Priority Support'
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
