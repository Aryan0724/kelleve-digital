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
            [
                'name'                   => 'Starter',
                'slug'                   => 'starter',
                'target_role_category'   => 'professional',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    '1 Business Listing',
                    'Up to 10 Portfolio Images',
                    'Basic Lead Access',
                    'Standard Support',
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 10,
                'monthly_wallet_credit'  => 0,
                'lead_notification_type' => 'none',
                'early_lead_access_hours'=> null,
                'search_ranking_boost'   => 0,
                'recommendation_score_boost' => 0,
                'contact_unlock_discount_percent' => 0,
                'badge_type'             => 'none',
                'can_add_whatsapp'       => false,
                'can_add_website'        => false,
                'is_featured_listing'    => false,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
            [
                'name'                   => 'QuickStart',
                'slug'                   => 'quickstart',
                'target_role_category'   => 'professional',
                'price_monthly'          => 4999.00, // 3 Months Plan
                'price_yearly'           => 4999.00,
                'features'               => [
                    '3 Business Listings',
                    'Elite Professional Badge',
                    'Gold Verification',
                    'Early Lead Access',
                    'Real-time Notifications',
                    'Up to 30 Portfolio Images',
                    'Priority Support',
                ],
                'max_listings'           => 3,
                'max_gallery_images'     => 30,
                'monthly_wallet_credit'  => 300,
                'lead_notification_type' => 'instant',
                'early_lead_access_hours'=> 1,
                'search_ranking_boost'   => 15,
                'recommendation_score_boost' => 10,
                'contact_unlock_discount_percent' => 10,
                'badge_type'             => 'elite',
                'can_add_whatsapp'       => true,
                'can_add_website'        => false,
                'is_featured_listing'    => false,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
            [
                'name'                   => 'GrowthPlus',
                'slug'                   => 'growthplus',
                'target_role_category'   => 'professional',
                'price_monthly'          => 9999.00, // 6 Months Plan
                'price_yearly'           => 9999.00,
                'features'               => [
                    '5 Business Listings',
                    'Elite Professional Badge',
                    'Gold Verification',
                    'Early Lead Access',
                    'Real-time Notifications',
                    'Website Link Integration',
                    'Up to 60 Portfolio Images',
                    'Priority Support',
                ],
                'max_listings'           => 5,
                'max_gallery_images'     => 60,
                'monthly_wallet_credit'  => 600,
                'lead_notification_type' => 'instant',
                'early_lead_access_hours'=> 2,
                'search_ranking_boost'   => 25,
                'recommendation_score_boost' => 20,
                'contact_unlock_discount_percent' => 15,
                'badge_type'             => 'elite',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => false,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
            [
                'name'                   => 'ProBusiness',
                'slug'                   => 'probusiness',
                'target_role_category'   => 'professional',
                'price_monthly'          => 17999.00, // 1 Year Plan
                'price_yearly'           => 17999.00,
                'features'               => [
                    '10 Business Listings',
                    'Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Website Link Integration',
                    'Up to 100 Portfolio Images',
                    'Detailed Lead Insights',
                    'Priority Support',
                    'Custom Profile URL',
                ],
                'max_listings'           => 10,
                'max_gallery_images'     => 100,
                'monthly_wallet_credit'  => 1200,
                'lead_notification_type' => 'instant',
                'early_lead_access_hours'=> 4,
                'search_ranking_boost'   => 50,
                'recommendation_score_boost' => 35,
                'contact_unlock_discount_percent' => 25,
                'badge_type'             => 'elite',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => true,
                'can_see_all_leads'      => true,
                'is_active'              => true,
            ],
            [
                'name'                   => 'EliteBusiness',
                'slug'                   => 'elitebusiness',
                'target_role_category'   => 'professional',
                'price_monthly'          => 35999.00, // 1 Year Plan
                'price_yearly'           => 35999.00,
                'features'               => [
                    'Unlimited Business Listings',
                    'Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Website Link Integration',
                    'Up to 200 Portfolio Images',
                    'Detailed Lead Insights',
                    'Featured Listing',
                    'Dedicated Account Manager',
                    'Custom Profile URL',
                    'Premium Support',
                ],
                'max_listings'           => 9999,
                'max_gallery_images'     => 200,
                'monthly_wallet_credit'  => 2500,
                'lead_notification_type' => 'instant',
                'early_lead_access_hours'=> 6,
                'search_ranking_boost'   => 100,
                'recommendation_score_boost' => 50,
                'contact_unlock_discount_percent' => 35,
                'badge_type'             => 'elite',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => true,
                'can_see_all_leads'      => true,
                'is_active'              => true,
            ],
        ];

        foreach ($plans as $p) {
            SubscriptionPlan::create($p);
        }
    }
}
