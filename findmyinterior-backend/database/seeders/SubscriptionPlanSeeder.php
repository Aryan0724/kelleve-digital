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
                'price_yearly'           => 4999.00, // Price in the image is 4,999/year
                'features'               => [
                    '1 Business Listing',
                    '100 Project Photos',
                    '10 Project Videos',
                    'Verified Business Badge',
                    'WhatsApp Chat',
                    'Click-to-Call',
                    'Website & Social Links',
                    'Higher Search Ranking',
                    'Instant Lead Alerts',
                    'Unlimited Portfolio',
                    'Unlimited Service Areas',
                    'Quote Request Button',
                    'Performance Insights',
                    'Before & After Gallery',
                    'Fast Response Badge',
                    'Customer Trust Score'
                ],
                'max_listings'           => 1, // Features say "1 Business Listing"
                'max_gallery_images'     => 100,
                'lead_unlocks_per_month' => 0, // Unlocks might be sold separately
                'can_see_all_leads'      => true, // Higher tier features
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
                'price_yearly'           => 11999.00, // Price in the image is 11,999/year
                'features'               => [
                    '1 Business Listing',
                    'Unlimited Photos & Videos',
                    'Homepage Spotlight (Monthly)',
                    'Top Search Placement',
                    'Unlimited Lead Access',
                    'Lead Manager (CRM)',
                    'Team Member Profiles',
                    'AI Business Profile',
                    'AI SEO Optimization',
                    'Download Leads (Excel)',
                    'Performance Reports',
                    'Promotional Banner',
                    'Google Review Sync',
                    'Multiple Contact Numbers',
                    'Instant Lead Alerts',
                    'Verified Business Certificate'
                ],
                'max_listings'           => 1, // Features say "1 Business Listing"
                'max_gallery_images'     => 9999, // Essentially unlimited
                'lead_unlocks_per_month' => 0,
                'can_see_all_leads'      => true,
                'can_add_website'        => true,
                'can_add_whatsapp'       => true,
                'is_gold_verified'       => false,
                'is_featured_listing'    => true, // Homepage spotlight
                'is_active'              => true,
            ],
            [
                'name'                   => 'Premium',
                'slug'                   => 'premium',
                'price_monthly'          => 2999.00,
                'price_yearly'           => 24999.00, // Price in the image is 24,999/year
                'features'               => [
                    '1 Business Listing',
                    'Top Search Priority',
                    'Gold Verified Badge',
                    'Premium Profile Design',
                    'AI Lead Matching',
                    'Online Appointment Booking',
                    'WhatsApp Business Integration',
                    'Auto Lead Reply',
                    'Monthly SEO Boost',
                    'Advanced Analytics',
                    'Business Growth Reports',
                    'Cost Estimator',
                    '3D Business Showcase',
                    'Premium Advertisement Banner',
                    'Priority Support',
                    'Early Access to New Features'
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
