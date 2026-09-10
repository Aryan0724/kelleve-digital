<?php

namespace App\Services;

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;

class EntitlementService
{
    /**
     * Get the active subscription plan for a user, or the fallback 'Starter' plan.
     *
     * The active subscription must be:
     *   - status = 'active'
     *   - expires_at > NOW()
     *   - plan is_archived = false (only canonical plans count)
     */
    public function getActivePlan(User $user): ?SubscriptionPlan
    {
        // Must be unexpired and active with a non-archived canonical plan
        $subscription = $user->activeSubscription()
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->first();

        if ($subscription && $subscription->plan && !$subscription->plan->is_archived) {
            return $subscription->plan;
        }

        // Fallback: canonical Starter plan (slug = 'starter', always active, never archived)
        return SubscriptionPlan::where('slug', 'starter')
            ->where('is_active', true)
            ->where('is_archived', false)
            ->first();
    }

    /**
     * Check if user has a boolean feature enabled in their current plan.
     */
    public function hasFeature(User $user, string $feature): bool
    {
        $plan = $this->getActivePlan($user);

        if (!$plan) {
            return false;
        }

        $featureMap = [
            'can_see_all_leads'   => $plan->can_see_all_leads,
            'can_add_website'     => $plan->can_add_website,
            'can_add_whatsapp'    => $plan->can_add_whatsapp,
            'is_featured_listing' => $plan->is_featured_listing,
        ];

        return $featureMap[$feature] ?? false;
    }

    /**
     * Get the numerical limit for a feature.
     *
     * NOTE: For early_lead_access_hours, use getActivePlan()->early_lead_access_hours directly
     * when null/0/N distinction matters (null = no early access, 0 = immediate, N = N hours).
     * This method casts to int, losing the null/0 distinction.
     */
    public function getLimit(User $user, string $feature): int
    {
        if ($user->isAdmin()) {
            return 9999;
        }

        $plan = $this->getActivePlan($user);
        if (!$plan) {
            return 0;
        }

        $limits = [
            'max_listings'                    => $plan->max_listings ?? PHP_INT_MAX,
            'max_gallery_images'              => $plan->max_gallery_images ?? PHP_INT_MAX,
            'lead_unlocks_per_month'          => $plan->lead_unlocks_per_month ?? 0,
            'early_lead_access_hours'         => (int) $plan->early_lead_access_hours,
            'search_ranking_boost'            => (int) $plan->search_ranking_boost,
            'recommendation_score_boost'      => (int) $plan->recommendation_score_boost,
            'contact_unlock_discount_percent' => (int) $plan->contact_unlock_discount_percent,
        ];

        return $limits[$feature] ?? 0;
    }

    /**
     * Get the analytics tier for a user.
     *
     * Returns:
     *   'none'    — Starter/Growth: no analytics access (403 on analytics endpoints)
     *   'summary' — Professional: profile statistics (all-time counters)
     *               NOTE: These are cumulative counters, NOT time-windowed.
     *               Display them as "Profile Statistics" not "Last 7 Days".
     *   'full'    — Elite: full analytics including analytics_events (when available)
     */
    public function getAnalyticsTier(User $user): string
    {
        if ($user->isAdmin()) {
            return 'full';
        }

        $plan = $this->getActivePlan($user);
        if (!$plan) {
            return 'none';
        }

        return match($plan->badge_type) {
            'elite'   => 'full',
            'trusted' => 'summary',
            default   => 'none',
        };
    }

    /**
     * Determine whether the user qualifies for the "Responds Fast" badge.
     *
     * Requirements (ALL must be met):
     *   1. Active Elite subscription (badge_type = 'elite')
     *   2. vendor_metrics.response_count >= 5 (statistically meaningful)
     *   3. Average response time <= 120 minutes (2 hours)
     *
     * Measures actual speed using total_response_minutes / response_count.
     * Does NOT use response_rate (that measures frequency, not speed).
     *
     * If response_count < 5, badge is BLOCKED (insufficient data).
     */
    public function hasRespondsFastBadge(User $user): bool
    {
        $plan = $this->getActivePlan($user);
        if ($plan?->badge_type !== 'elite') {
            return false;
        }

        $metric = $user->vendorMetric;
        if (!$metric || $metric->response_count < 5) {
            return false; // Not enough data — badge not awarded
        }

        $avgMinutes = $metric->total_response_minutes / $metric->response_count;
        return $avgMinutes <= 120; // Responds within 2 hours on average
    }

    /**
     * Formats an entitlement error into a standardized machine-readable response.
     */
    public function generateErrorResponse(string $feature, int $limit, int $current, string $message): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success'           => false,
            'entitlement_error' => true,
            'feature'           => $feature,
            'limit'             => $limit,
            'current'           => $current,
            'remaining'         => max(0, $limit - $current),
            'code'              => 'ENTITLEMENT_LIMIT_REACHED',
            'message'           => $message,
        ], 403);
    }

    /**
     * Get early lead access hours for user's active plan.
     * 0 = immediate access (Elite)
     * N = N hours delay
     * null = standard access (Starter / Growth)
     */
    public function getEarlyLeadAccessHours(User $user): ?int
    {
        $plan = $this->getActivePlan($user);
        if (!$plan) {
            return null;
        }
        return $plan->early_lead_access_hours !== null ? (int) $plan->early_lead_access_hours : null;
    }

    /**
     * Pre-check if an operation can proceed. Returns boolean.
     */
    public function checkOperation(User $user, string $feature, int $currentUsage, int $addAmount = 1): bool
    {
        $limit = $this->getLimit($user, $feature);
        return ($currentUsage + $addAmount) <= $limit;
    }
}
