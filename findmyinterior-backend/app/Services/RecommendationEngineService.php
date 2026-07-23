<?php

namespace App\Services;

use App\Models\Requirement;
use App\Models\Listing;
use App\Models\VendorMetric;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RecommendationEngineService
{
    // V2 Scoring Weights (total = 100)
    const WEIGHT_CATEGORY     = 25;
    const WEIGHT_CITY         = 20;
    const WEIGHT_BUDGET       = 10;
    const WEIGHT_AVAILABILITY = 10;
    const WEIGHT_RATING       = 10;
    const WEIGHT_COMPLETION   = 10;
    const WEIGHT_RESPONSE     = 5;
    const WEIGHT_VERIFICATION = 5;
    const WEIGHT_ACTIVITY     = 5;

    /**
     * Generate and cache top vendor recommendations for a given requirement.
     */
    public function generateFor(Requirement $requirement): void
    {
        // Fetch vendors who have a Listing in the matching category
        $vendors = Listing::with(['user.vendorMetric'])
            ->where('category_id', $requirement->category_id)
            ->whereHas('user')
            ->get()
            ->unique('user_id');

        if ($vendors->isEmpty()) {
            return;
        }

        $scores = [];
        foreach ($vendors as $listing) {
            $vendor = $listing->user;
            if (!$vendor) continue;

            $result = $this->calculateScore($requirement, $listing, $vendor);
            $scores[] = [
                'requirement_id'   => $requirement->id,
                'requirement_type' => get_class($requirement),
                'vendor_id'        => $vendor->id,
                'match_score'      => $result['score'],
                'score_breakdown_json' => json_encode($result['breakdown']),
                'recommended_at'   => now(),
            ];
        }

        // Sort descending and take top 20
        usort($scores, fn($a, $b) => $b['match_score'] <=> $a['match_score']);
        $top = array_slice($scores, 0, 20);

        $inserts = [];
        $vendorIds = [];
        foreach ($top as $row) {
            $inserts[] = array_merge($row, ['created_at' => now(), 'updated_at' => now()]);
            $vendorIds[] = $row['vendor_id'];
        }

        if (!empty($inserts)) {
            DB::table('requirement_recommendations')->upsert(
                $inserts,
                ['requirement_id', 'vendor_id'],
                ['requirement_type', 'match_score', 'score_breakdown_json', 'updated_at', 'recommended_at']
            );
            VendorMetric::whereIn('vendor_id', $vendorIds)->increment('recommendations_received');
        }

        // Notify top vendors with flood protection
        $this->notifyTopVendors($top, $requirement);
    }

    /**
     * Calculate a match score (0–100) for a vendor listing against a requirement.
     */
    public function calculateScore(Requirement $requirement, Listing $listing, User $vendor): array
    {
        $score = 0.0;
        $breakdown = [];
        $metrics = $vendor->vendorMetric;

        // 1. Category Match (30 pts)
        if ($listing->category_id === $requirement->category_id) {
            $score += self::WEIGHT_CATEGORY;
            $breakdown['category'] = self::WEIGHT_CATEGORY;
        } else {
            $breakdown['category'] = 0;
        }

        // 2. City Match (25 pts)
        if ($listing->city_id && $listing->city_id === $requirement->city_id) {
            $score += self::WEIGHT_CITY;
            $breakdown['city'] = self::WEIGHT_CITY;
        } elseif ($listing->district_id && $listing->district_id === $requirement->district_id) {
            $score += self::WEIGHT_CITY * 0.5; // Partial match
            $breakdown['city'] = self::WEIGHT_CITY * 0.5;
        } else {
            $breakdown['city'] = 0;
        }

        // 3. Budget Match (10 pts)
        if ($listing->budget_tier && $requirement->budget_tier) {
            if ($listing->budget_tier === $requirement->budget_tier) {
                $score += self::WEIGHT_BUDGET;
                $breakdown['budget'] = self::WEIGHT_BUDGET;
            } else {
                $score += self::WEIGHT_BUDGET * 0.5; // Partial points for nearby tier
                $breakdown['budget'] = self::WEIGHT_BUDGET * 0.5;
            }
        } else {
            $breakdown['budget'] = 0;
        }

        // 4. Rating (10 pts)
        $ratingAvg = $metrics?->rating_average ?? 4.5;
        $ratingScore = ($ratingAvg / 5.0) * self::WEIGHT_RATING;
        $score += $ratingScore;
        $breakdown['rating'] = round($ratingScore, 2);

        // 4. Completion Rate (10 pts)
        $completionRate = $metrics?->completion_rate ?? 0;
        $completionScore = ($completionRate / 100.0) * self::WEIGHT_COMPLETION;
        $score += $completionScore;
        $breakdown['completion'] = round($completionScore, 2);

        // 5. Response Rate (5 pts)
        $responseRate = $metrics?->response_rate ?? 0;
        $responseScore = ($responseRate / 100.0) * self::WEIGHT_RESPONSE;
        $score += $responseScore;
        $breakdown['response'] = round($responseScore, 2);

        // 6. Verification (5 pts)
        if ($vendor->is_verified ?? false) {
            $score += self::WEIGHT_VERIFICATION;
            $breakdown['verification'] = self::WEIGHT_VERIFICATION;
        } else {
            $breakdown['verification'] = 0;
        }

        // 7. Recent Activity (5 pts)
        $activityScore = 0;
        if ($metrics?->last_active_at) {
            $daysInactive = now()->diffInDays($metrics->last_active_at);
            if ($daysInactive <= 7) {
                $activityScore = self::WEIGHT_ACTIVITY;
            } elseif ($daysInactive <= 30) {
                $activityScore = self::WEIGHT_ACTIVITY * 0.5;
            }
        }
        $score += $activityScore;
        $breakdown['activity'] = $activityScore;

        // 8. Availability (10 pts)
        if ($listing->status === 'active' || $listing->status === 'published') {
            $score += self::WEIGHT_AVAILABILITY;
            $breakdown['availability'] = self::WEIGHT_AVAILABILITY;
        } else {
            $breakdown['availability'] = 0;
        }

        return [
            'score' => round($score, 2),
            'breakdown' => $breakdown
        ];
    }

    /**
     * Notify top vendors about the new requirement, respecting their daily limit.
     */
    protected function notifyTopVendors(array $topVendors, Requirement $requirement): void
    {
        foreach ($topVendors as $row) {
            $vendor = User::find($row['vendor_id']);
            if (!$vendor) continue;

            // Check daily notification count for today
            // Laravel notifications table uses notifiable_id, not user_id
            $sentToday = DB::table('notifications')
                ->where('notifiable_id', $vendor->id)
                ->where('notifiable_type', get_class($vendor))
                ->whereDate('created_at', today())
                ->count();

            $limit = $vendor->daily_notification_limit ?? 10;

            if ($sentToday >= $limit) {
                continue; // Skip — flood protection
            }

            try {
                \Illuminate\Support\Facades\Notification::send([$vendor], new \App\Notifications\NewLeadNotification([
                    'title' => $requirement->title,
                    'city' => $requirement->city,
                    'requirement_id' => $requirement->id,
                    'match_score' => $row['match_score'],
                ]));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to send lead notification to vendor ' . $vendor->id . ': ' . $e->getMessage());
            }
        }
    }
}
