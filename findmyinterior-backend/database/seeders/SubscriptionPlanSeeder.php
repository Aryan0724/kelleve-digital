<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * SubscriptionPlanSeeder — Canonical 4-Plan Definition
 *
 * This seeder uses updateOrCreate to insert or update canonical plans
 * by slug. It does NOT truncate or delete any rows.
 *
 * Legacy plan rows (quickstart, growthplus, probusiness, elitebusiness)
 * are marked as is_archived=true, is_active=false to preserve
 * historical referential integrity while preventing new subscriptions.
 *
 * Canonical plans: starter, growth, professional, elite
 */
class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        // ── Step 1: Archive all legacy plans (preserve rows, prevent selection) ──
        DB::connection('fmi_mysql')
            ->table('subscription_plans')
            ->whereIn('slug', ['quickstart', 'growthplus', 'probusiness', 'elitebusiness'])
            ->update([
                'is_active'   => false,
                'is_archived' => true,
                'updated_at'  => now(),
            ]);

        // ── Step 2: Upsert canonical plans ────────────────────────────────────
        $canonical = [
            // ─── Starter (Free) ──────────────────────────────────────────────
            [
                'name'                            => 'Starter',
                'slug'                            => 'starter',
                'target_role_category'            => 'professional',
                'price_monthly'                   => 0.00,
                'price_yearly'                    => 0.00,
                'billing_period_months'           => null,   // indefinite
                'features'                        => json_encode([
                    '1 Business Listing',
                    'Up to 5 Portfolio Images',
                    'Standard Search Position',
                    'Standard Support',
                ]),
                'max_listings'                    => 1,
                'max_gallery_images'              => 5,
                'lead_notification_type'          => 'none',
                'early_lead_access_hours'         => null,   // null = standard system delay
                'search_ranking_boost'            => 0,
                'recommendation_score_boost'      => 0,
                'contact_unlock_discount_percent' => 0,
                'badge_type'                      => 'none',
                'can_add_whatsapp'                => false,
                'can_add_website'                 => false,
                'is_featured_listing'             => false,
                'can_see_all_leads'               => false,
                'is_active'                       => true,
                'is_archived'                     => false,
            ],
            // ─── Growth (₹4,499/yr) ──────────────────────────────────────────
            [
                'name'                            => 'Growth',
                'slug'                            => 'growth',
                'target_role_category'            => 'professional',
                'price_monthly'                   => 4499.00,
                'price_yearly'                    => 4499.00,
                'billing_period_months'           => 12,
                'features'                        => json_encode([
                    '1 Business Listing',
                    'Up to 15 Portfolio Images',
                    'WhatsApp Button',
                    'Website Link',
                    '+10 Search Ranking Boost',
                    'Category Lead Notifications',
                    '10% Contact Unlock Discount',
                    'Standard Support',
                ]),
                'max_listings'                    => 1,
                'max_gallery_images'              => 15,
                'lead_notification_type'          => 'category', // only leads matching professional's category
                'early_lead_access_hours'         => null,       // null = standard delay (Growth has no early access)
                'search_ranking_boost'            => 10,
                'recommendation_score_boost'      => 5,
                'contact_unlock_discount_percent' => 10,
                'badge_type'                      => 'none',
                'can_add_whatsapp'                => true,
                'can_add_website'                 => true,
                'is_featured_listing'             => false,
                'can_see_all_leads'               => false,
                'is_active'                       => true,
                'is_archived'                     => false,
            ],
            // ─── Professional (₹8,999/yr) ─────────────────────────────────────
            [
                'name'                            => 'Professional',
                'slug'                            => 'professional',
                'target_role_category'            => 'professional',
                'price_monthly'                   => 8999.00,
                'price_yearly'                    => 8999.00,
                'billing_period_months'           => 12,
                'features'                        => json_encode([
                    'Up to 3 Business Listings',
                    'Up to 30 Portfolio Images',
                    'WhatsApp Button',
                    'Website Link',
                    '+30 Search Ranking Boost',
                    'Instant Lead Notifications',
                    '2-Hour Early Lead Access',
                    'Trusted Professional Badge',
                    'Category Spotlight',
                    '20% Contact Unlock Discount',
                    'Weekly Analytics',
                    'Priority Support',
                ]),
                'max_listings'                    => 3,
                'max_gallery_images'              => 30,
                'lead_notification_type'          => 'instant', // all matching leads, instantly
                'early_lead_access_hours'         => 2,         // 2h before standard delay users see leads
                'search_ranking_boost'            => 30,
                'recommendation_score_boost'      => 15,
                'contact_unlock_discount_percent' => 20,
                'badge_type'                      => 'trusted',
                'can_add_whatsapp'                => true,
                'can_add_website'                 => true,
                'is_featured_listing'             => false,
                'can_see_all_leads'               => false,
                'is_active'                       => true,
                'is_archived'                     => false,
            ],
            // ─── Elite (₹17,999/yr) ──────────────────────────────────────────
            [
                'name'                            => 'Elite',
                'slug'                            => 'elite',
                'target_role_category'            => 'professional',
                'price_monthly'                   => 17999.00,
                'price_yearly'                    => 17999.00,
                'billing_period_months'           => 12,
                'features'                        => json_encode([
                    'Up to 5 Business Listings',
                    'Up to 60 Portfolio Images',
                    'WhatsApp Button',
                    'Website Link',
                    '+25 Search Ranking Boost',
                    'Instant Lead Notifications',
                    'Immediate Lead Access (0-delay)',
                    'Elite Professional Badge',
                    'Top-3 Category Placement',
                    'Homepage Featured Slot',
                    '30% Contact Unlock Discount',
                    'Full Analytics Dashboard',
                    'Competitor Insights',
                    'Priority Support',
                    'Responds Fast Badge (if eligible)',
                ]),
                'max_listings'                    => 5,
                'max_gallery_images'              => 60,
                'lead_notification_type'          => 'instant',
                // 0 = immediate access — zero delay applied.
                // Semantics: null=standard delay, 0=immediate, N=N hours early access.
                // The OpportunityProjectController reads this explicitly.
                'early_lead_access_hours'         => 0,
                'search_ranking_boost'            => 25,
                'recommendation_score_boost'      => 25,
                'contact_unlock_discount_percent' => 30,
                'badge_type'                      => 'elite',
                'can_add_whatsapp'                => true,
                'can_add_website'                 => true,
                'is_featured_listing'             => true, // only canonical Elite gets featured
                'can_see_all_leads'               => true,
                'is_active'                       => true,
                'is_archived'                     => false,
            ],
        ];

        foreach ($canonical as $planData) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }

        $this->command->info('✅ Canonical subscription plans seeded (Starter, Growth, Professional, Elite).');
        $this->command->info('📦 Legacy plans (quickstart, growthplus, probusiness, elitebusiness) archived — rows preserved for referential integrity.');
    }
}
