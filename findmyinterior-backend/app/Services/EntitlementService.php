<?php

namespace App\Services;

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;

class EntitlementService
{
    /**
     * Get the active subscription plan for a user, or the fallback 'Starter' plan.
     */
    public function getActivePlan(User $user): ?SubscriptionPlan
    {
        // Must be unexpired and active
        $subscription = $user->activeSubscription()
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->first();
            
        if ($subscription && $subscription->plan) {
            return $subscription->plan;
        }

        // Fallback to Starter plan definitions
        // Since starter plans are prefixed by type (e.g. professional-starter, worker-starter)
        try {
            $userRoles = $user->roles->pluck('slug')->toArray();
            $role = $userRoles[0] ?? 'professional';
            
            $prefix = 'professional-';
            if (in_array($role, ['worker', 'skilled_worker', 'carpenter', 'electrician', 'plumber', 'painter'])) {
                $prefix = 'worker-';
            } elseif (in_array($role, ['business', 'interior_company'])) {
                $prefix = 'business-';
            }
            
            $plan = SubscriptionPlan::where('slug', $prefix . 'starter')->first();
            if ($plan) {
                return $plan;
            }
        } catch (\Throwable $e) {
            // ignore
        }

        return SubscriptionPlan::where('slug', 'like', '%starter')->first();
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

        // Handle specific boolean features based on DB schema
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
     */
    public function getLimit(User $user, string $feature): int
    {
        if ($user->isAdmin()) {
            return 9999;
        }

        $plan = $this->getActivePlan($user);
        if (!$plan) {
            return 0; // Absolute zero if no plan is found at all (should rarely happen due to Starter fallback)
        }

        $limits = [
            'max_listings'           => $plan->max_listings ?? PHP_INT_MAX,
            'max_gallery_images'     => $plan->max_gallery_images ?? PHP_INT_MAX,
            'lead_unlocks_per_month' => $plan->lead_unlocks_per_month ?? 0,
            'early_lead_access_hours'=> (int) $plan->early_lead_access_hours,
            'search_ranking_boost'   => (int) $plan->search_ranking_boost,
            'recommendation_score_boost' => (int) $plan->recommendation_score_boost,
            'contact_unlock_discount_percent' => (int) $plan->contact_unlock_discount_percent,
        ];

        return $limits[$feature] ?? 0;
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
     * Pre-check if an operation can proceed. Throws exception or returns boolean.
     */
    public function checkOperation(User $user, string $feature, int $currentUsage, int $addAmount = 1): bool
    {
        $limit = $this->getLimit($user, $feature);
        return ($currentUsage + $addAmount) <= $limit;
    }
}
