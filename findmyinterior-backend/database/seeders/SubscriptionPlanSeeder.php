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
                    '1 Active Listing',
                    'Up to 5 Gallery Images',
                    'Contact Inquiry Form',
                    'Basic Profile Page',
                ],
                'max_listings'            => 1,
                'max_gallery_images'      => 5,
                'lead_unlocks_per_month'  => 0,
                'unlock_discount_percent' => 0,
                'can_see_all_leads'       => false,
                'is_featured_listing'     => false,
                'is_active'               => true,
            ],
            [
                'name'                   => 'Professional',
                'slug'                   => 'professional',
                'price_monthly'          => 999.00,
                'price_yearly'           => 9990.00,
                'features'               => [
                    '3 Active Listings',
                    'Up to 20 Gallery Images per Listing',
                    'Priority in Search Results',
                    'Verified Badge',
                    'View All Project Requirements',
                    'Inquiry Notifications (Email)',
                    'WhatsApp Inquiry Alerts',
                ],
                'max_listings'            => 3,
                'max_gallery_images'      => 20,
                'lead_unlocks_per_month'  => 0,
                'unlock_discount_percent' => 0,
                'can_see_all_leads'       => true,
                'is_featured_listing'     => false,
                'is_active'               => true,
            ],
            [
                'name'                   => 'Premium',
                'slug'                   => 'premium',
                'price_monthly'          => 4999.00,
                'price_yearly'           => 49990.00,
                'features'               => [
                    '10 Active Listings',
                    'Unlimited Gallery Images',
                    'Featured Placement on Homepage',
                    'Top of Search Results',
                    'Gold Verified Badge',
                    'View All Project Requirements',
                    'Priority Inquiry Routing',
                    'WhatsApp + Email Alerts',
                    'Dedicated Account Support',
                ],
                'max_listings'            => 10,
                'max_gallery_images'      => 999,
                'lead_unlocks_per_month'  => 0,
                'unlock_discount_percent' => 20,
                'can_see_all_leads'       => true,
                'is_featured_listing'     => true,
                'is_active'               => true,
            ],
            [
                'name'                   => 'Elite',
                'slug'                   => 'elite',
                'price_monthly'          => 14999.00,
                'price_yearly'           => 149990.00,
                'features'               => [
                    'Unlimited Active Listings',
                    'Unlimited Gallery Images',
                    'Top 10 Ranking Guarantee',
                    'Dedicated Account Manager',
                    '50% Discount on Lead Unlocks',
                    'Featured in Weekly Newsletter',
                    'Custom SEO Profile Link',
                    'WhatsApp + Email Alerts',
                    'VIP Support',
                ],
                'max_listings'            => 99,
                'max_gallery_images'      => 999,
                'lead_unlocks_per_month'  => 0,
                'unlock_discount_percent' => 50,
                'can_see_all_leads'       => true,
                'is_featured_listing'     => true,
                'is_active'               => true,
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
