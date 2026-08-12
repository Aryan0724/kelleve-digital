<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        SubscriptionPlan::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $plans = [
            // WORKER TRACK
            [
                'name'                   => 'Starter',
                'slug'                   => 'worker-starter',
                'target_role_category'   => 'worker',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    '1 Free Profile',
                    'Up to 5 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 5,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Growth',
                'slug'                   => 'worker-growth',
                'target_role_category'   => 'worker',
                'price_monthly'          => 199.00,
                'price_yearly'           => 1999.00,
                'features'               => [
                    'WhatsApp Chat Integration',
                    'Category Lead Notifications',
                    'Up to 15 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 15,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'worker-professional',
                'target_role_category'   => 'worker',
                'price_monthly'          => 399.00,
                'price_yearly'           => 3999.00,
                'features'               => [
                    'Trusted Worker Badge',
                    'Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Up to 30 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 30,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Elite',
                'slug'                   => 'worker-elite',
                'target_role_category'   => 'worker',
                'price_monthly'          => 799.00,
                'price_yearly'           => 7999.00,
                'features'               => [
                    'Elite Worker Badge',
                    'Early Lead Access',
                    'Real-time Notifications',
                    'Maximum Search Boost',
                    'Up to 50 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 50,
                'is_active'              => true,
            ],

            // PROFESSIONAL TRACK
            [
                'name'                   => 'Starter',
                'slug'                   => 'professional-starter',
                'target_role_category'   => 'professional',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    '1 Business Listing',
                    'Up to 10 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 10,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Growth',
                'slug'                   => 'professional-growth',
                'target_role_category'   => 'professional',
                'price_monthly'          => 499.00,
                'price_yearly'           => 4499.00,
                'features'               => [
                    'Trusted Professional Badge',
                    'WhatsApp Chat Integration',
                    'Category Lead Notifications',
                    'Up to 20 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 20,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'professional-professional',
                'target_role_category'   => 'professional',
                'price_monthly'          => 999.00,
                'price_yearly'           => 8999.00,
                'features'               => [
                    '3 Business Listings',
                    'Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Website Link Integration',
                    'Up to 50 Portfolio Images'
                ],
                'max_listings'           => 3,
                'max_gallery_images'     => 50,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Elite',
                'slug'                   => 'professional-elite',
                'target_role_category'   => 'professional',
                'price_monthly'          => 1999.00,
                'price_yearly'           => 17999.00,
                'features'               => [
                    '5 Business Listings',
                    'Elite Professional Badge',
                    'Gold Verification',
                    'Early Lead Access',
                    'Real-time Notifications',
                    'Up to 100 Portfolio Images'
                ],
                'max_listings'           => 5,
                'max_gallery_images'     => 100,
                'is_active'              => true,
            ],

            // BUSINESS TRACK
            [
                'name'                   => 'Starter',
                'slug'                   => 'business-starter',
                'target_role_category'   => 'business',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    '1 Business Profile',
                    'Up to 10 Portfolio Images'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 10,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Growth',
                'slug'                   => 'business-growth',
                'target_role_category'   => 'business',
                'price_monthly'          => 999.00,
                'price_yearly'           => 8999.00,
                'features'               => [
                    '3 Business Profiles',
                    'Trusted Business Badge',
                    'WhatsApp Chat Integration',
                    'Up to 30 Portfolio Images'
                ],
                'max_listings'           => 3,
                'max_gallery_images'     => 30,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'business-professional',
                'target_role_category'   => 'business',
                'price_monthly'          => 1999.00,
                'price_yearly'           => 17999.00,
                'features'               => [
                    '10 Business Profiles',
                    'Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Website Link Integration',
                    'Up to 100 Portfolio Images'
                ],
                'max_listings'           => 10,
                'max_gallery_images'     => 100,
                'is_active'              => true,
            ],
            [
                'name'                   => 'Elite Business',
                'slug'                   => 'business-elite',
                'target_role_category'   => 'business',
                'price_monthly'          => 3999.00,
                'price_yearly'           => 35999.00,
                'features'               => [
                    '20 Business Profiles',
                    'Elite Business Badge',
                    'Gold Verification',
                    'Maximum Search Boost',
                    'Early Lead Access',
                    'Up to 200 Portfolio Images'
                ],
                'max_listings'           => 20,
                'max_gallery_images'     => 200,
                'is_active'              => true,
            ]
        ];

        foreach ($plans as $planData) {
            SubscriptionPlan::create($planData);
        }
    }
}
