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

        $basePlans = [
            'starter' => [
                'name'                   => 'Starter',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    '1 Business Listing',
                    '5 Portfolio Images',
                    'View Projects',
                    'Bid on Projects',
                    'Contact Unlock (via Wallet)',
                    '₹100 Welcome Wallet Bonus'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 5,
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
            'growth' => [
                'name'                   => 'Growth',
                'price_monthly'          => 499.00,
                'price_yearly'           => 4499.00,
                'features'               => [
                    '1 Business Listing',
                    '15 Portfolio Images',
                    '₹200 Monthly Wallet Credit',
                    'Category-wise Lead Notifications',
                    'Search Ranking Boost (+10)',
                    'Recommendation Score +5',
                    'WhatsApp Button',
                    'Website Link',
                    'Bid on Projects',
                    '10% Discount on Contact Unlock'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 15,
                'monthly_wallet_credit'  => 200,
                'lead_notification_type' => 'category',
                'early_lead_access_hours'=> null,
                'search_ranking_boost'   => 10,
                'recommendation_score_boost' => 5,
                'contact_unlock_discount_percent' => 10,
                'badge_type'             => 'none',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => false,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
            'professional' => [
                'name'                   => 'Professional',
                'price_monthly'          => 999.00,
                'price_yearly'           => 8999.00,
                'features'               => [
                    'Up to 3 Business Listings',
                    '30 Portfolio Images',
                    '₹500 Monthly Wallet Credit',
                    'Instant Lead Notifications',
                    'Early Lead Access (2 Hours)',
                    'Search Ranking Boost (+30)',
                    'Recommendation Score +15',
                    'Trusted Professional Badge',
                    'WhatsApp + Website',
                    'Category Spotlight Placement',
                    '20% Discount on Contact Unlock',
                    'Weekly Profile Analytics'
                ],
                'max_listings'           => 3,
                'max_gallery_images'     => 30,
                'monthly_wallet_credit'  => 500,
                'lead_notification_type' => 'instant',
                'early_lead_access_hours'=> 2,
                'search_ranking_boost'   => 30,
                'recommendation_score_boost' => 15,
                'contact_unlock_discount_percent' => 20,
                'badge_type'             => 'trusted',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => true,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
            'elite' => [
                'name'                   => 'Elite',
                'price_monthly'          => 1999.00,
                'price_yearly'           => 17999.00,
                'features'               => [
                    'Up to 5 Business Listings',
                    '60 Portfolio Images',
                    '₹1,500 Monthly Wallet Credit',
                    'Real-Time Lead Alerts',
                    'Immediate Lead Access',
                    'Top 3 Category Placement',
                    'Recommendation Score +25',
                    'Elite Professional Badge',
                    'WhatsApp + Website',
                    'Homepage Featured Slot',
                    '30% Discount on Contact Unlock',
                    'Full Analytics Dashboard',
                    'Competitor Insights',
                    'Priority Admin Support',
                    '"Responds Fast" Badge'
                ],
                'max_listings'           => 5,
                'max_gallery_images'     => 60,
                'monthly_wallet_credit'  => 1500,
                'lead_notification_type' => 'real-time',
                'early_lead_access_hours'=> 0,
                'search_ranking_boost'   => 100,
                'recommendation_score_boost' => 25,
                'contact_unlock_discount_percent' => 30,
                'badge_type'             => 'elite',
                'can_add_whatsapp'       => true,
                'can_add_website'        => true,
                'is_featured_listing'    => true,
                'can_see_all_leads'      => false,
                'is_active'              => true,
            ],
        ];

        $roles = ['worker', 'professional', 'business'];

        foreach ($roles as $role) {
            foreach ($basePlans as $tierKey => $tierData) {
                $slug = "{$role}-{$tierKey}";
                
                // Adjust name for business elite for historical consistency, or just keep it 'Elite'
                if ($role === 'business' && $tierKey === 'elite') {
                    $tierData['name'] = 'Elite Business';
                }

                $tierData['slug'] = $slug;
                $tierData['target_role_category'] = $role;
                
                SubscriptionPlan::create($tierData);
            }
        }
    }
}
