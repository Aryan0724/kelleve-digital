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
                    'Free Profile',
                    'Basic Search Visibility'
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
                    'Enhanced Profile',
                    'WhatsApp Chat Link',
                    'Instant Lead Notifications',
                    'Basic Support'
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
                    'Better Ranking',
                    'More Leads',
                    'Profile Analytics',
                    'Verified Badge'
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
                    'Maximum Visibility',
                    'Priority Opportunities',
                    'Top of Search Results',
                    'Premium Support'
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
                    'Basic Business Profile',
                    'Contact Form'
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
                    'Verified Business Badge',
                    'WhatsApp Chat',
                    'Higher Search Ranking'
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
                    'Project Leads + Bidding',
                    'Unlimited Portfolio',
                    'Top Category Placement'
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
                    'Homepage Featured Slot',
                    'Full Analytics Dashboard',
                    'Competitor Insights',
                    'Priority Admin Support'
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
                    'Basic Company Profile',
                    'Standard Discovery'
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
                    'Multiple Listings',
                    'Verified Company Badge',
                    'Team Member Profiles'
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
                    'Priority Visibility',
                    'Project Promotion',
                    'Professional Network Access'
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
                    'Multiple Branches',
                    'Dominant Search Real Estate',
                    'Dedicated Account Manager',
                    'Custom Branding'
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
