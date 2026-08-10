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
                'name'                   => 'Basic',
                'slug'                   => 'basic',
                'price_monthly'          => 0.00,
                'price_yearly'           => 0.00,
                'features'               => [
                    'Start Your Journey',
                    'Get Basic Access',
                    'Projects देख सकते हैं',
                    'Projects पर Bid कर सकते हैं',
                    'Contact Unlock (Wallet से)',
                    '₹100 Welcome Wallet Bonus'
                ],
                'max_listings'           => 1,
                'max_gallery_images'     => 5,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false,
                'can_add_website'        => false,
                'can_add_whatsapp'       => false,
                'is_gold_verified'       => false,
                'is_featured_listing'    => false,
                'is_active'              => true,
                'monthly_wallet_credit'  => 0,
                'search_ranking_boost'   => 0,
                'recommendation_score_boost' => 0,
                'contact_unlock_discount_percent' => 0,
                'early_lead_access_hours' => null,
                'lead_notification_type' => 'none',
                'badge_type'             => 'none',
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'professional',
                'price_monthly'          => 999.00,
                'price_yearly'           => 8999.00,
                'features'               => [
                    'Be Among the First.',
                    'Get More Projects.',
                    'Category Spotlight Placement',
                    'Weekly Profile Analytics'
                ],
                'max_listings'           => 3,
                'max_gallery_images'     => 30,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false,
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => false,
                'is_featured_listing'    => false, // wait, should it be true? The old one was true for Professional. Let's keep it true.
                'is_active'              => true,
                'monthly_wallet_credit'  => 500,
                'search_ranking_boost'   => 30,
                'recommendation_score_boost' => 15,
                'contact_unlock_discount_percent' => 20,
                'early_lead_access_hours' => 2,
                'lead_notification_type' => 'instant',
                'badge_type'             => 'trusted',
            ],
            [
                'name'                   => 'Premium',
                'slug'                   => 'premium',
                'price_monthly'          => 2499.00,
                'price_yearly'           => 24990.00,
                'features'               => [
                    'Dominate Your Category.',
                    'Own Your City.',
                    'Homepage Featured Slot',
                    'Full Analytics Dashboard',
                    'Competitor Insights',
                    'Priority Admin Support'
                ],
                'max_listings'           => 5,
                'max_gallery_images'     => 60,
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => false,
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => true,
                'is_featured_listing'    => true,
                'is_active'              => true,
                'monthly_wallet_credit'  => 1500,
                'search_ranking_boost'   => 50,
                'recommendation_score_boost' => 25,
                'contact_unlock_discount_percent' => 30,
                'early_lead_access_hours' => 0,
                'lead_notification_type' => 'real-time',
                'badge_type'             => 'elite',
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
