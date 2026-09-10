<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use App\Services\EntitlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompetitorInsightsController extends Controller
{
    /**
     * GET /api/v1/user/competitor-insights
     *
     * Provides aggregated, anonymized category & location intelligence exclusively
     * for active Elite subscribers. No individual competitor names/IDs are ever exposed.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $entitlement = app(EntitlementService::class);
        $plan = $entitlement->getActivePlan($user);

        if (!$user->isAdmin() && $plan?->badge_type !== 'elite') {
            return response()->json([
                'success' => false,
                'message' => 'Competitor Insights is an exclusive benefit for Elite subscribers. Please upgrade your plan to unlock location and category benchmarks.',
                'code'    => 'COMPETITOR_INSIGHTS_UPGRADE_REQUIRED',
            ], 403);
        }

        // Find the user's primary listing
        $userListing = Listing::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('category')
            ->first() ?? Listing::where('user_id', $user->id)->with('category')->first();

        $category = $userListing?->category;
        $categoryId = $userListing?->category_id;
        $district = $userListing?->district ?: ($user->district ?: 'Bihar');
        $categoryName = $category?->name ?: 'Interior Services';

        // 1. User's own metrics
        $userMetric = $user->vendorMetric;
        $userAvgRating = round((float) ($userListing?->avg_rating ?? 0), 1);
        $userReviewCount = (int) ($userListing?->review_count ?? 0);
        $userViews = (int) ($userListing?->views_count ?? 0);
        $userAvgResponse = ($userMetric && $userMetric->response_count > 0)
            ? round($userMetric->total_response_minutes / $userMetric->response_count)
            : null;

        // 2. Peer cohort: active listings in the same category & district (or statewide if small sample)
        $cohortQuery = Listing::where('status', 'active');
        if ($categoryId) {
            $cohortQuery->where('category_id', $categoryId);
        }
        if ($district && $district !== 'Bihar') {
            $districtCount = (clone $cohortQuery)->where('district', $district)->count();
            if ($districtCount >= 3) {
                $cohortQuery->where('district', $district);
            }
        }

        $cohortListings = $cohortQuery->get();
        $sampleSize = $cohortListings->count();

        // 3. Cohort averages
        $avgRating = $sampleSize > 0 ? round($cohortListings->avg('avg_rating'), 1) : 4.2;
        $avgReviews = $sampleSize > 0 ? round($cohortListings->avg('review_count')) : 12;
        $avgViews = $sampleSize > 0 ? round($cohortListings->avg('views_count')) : 350;

        // Response time benchmark from vendor_metrics of cohort owners
        $cohortUserIds = $cohortListings->pluck('user_id')->filter();
        $cohortMetrics = DB::table('vendor_metrics')
            ->whereIn('vendor_id', $cohortUserIds)
            ->where('response_count', '>', 0)
            ->selectRaw('SUM(total_response_minutes) as total_min, SUM(response_count) as total_count')
            ->first();

        $cohortAvgResponse = ($cohortMetrics && $cohortMetrics->total_count > 0)
            ? round($cohortMetrics->total_min / $cohortMetrics->total_count)
            : 180; // default 3 hours

        // 4. Calculate user's approximate percentile rank
        $betterViews = $cohortListings->where('views_count', '>', $userViews)->count();
        $percentile = $sampleSize > 0 ? max(5, round((($sampleSize - $betterViews) / $sampleSize) * 100)) : 80;
        $rankTier = match (true) {
            $percentile >= 90 => 'Top 10%',
            $percentile >= 75 => 'Top 25%',
            $percentile >= 50 => 'Top 50%',
            default           => 'Average',
        };

        return response()->json([
            'success' => true,
            'data'    => [
                'comparison_scope'   => "{$categoryName} in {$district}",
                'sample_size'        => $sampleSize,
                'your_stats'         => [
                    'avg_rating'           => $userAvgRating,
                    'review_count'         => $userReviewCount,
                    'avg_response_minutes' => $userAvgResponse ?? $cohortAvgResponse,
                    'views_count'          => $userViews,
                ],
                'category_averages'  => [
                    'avg_rating'           => $avgRating,
                    'review_count'         => $avgReviews,
                    'avg_response_minutes' => $cohortAvgResponse,
                    'views_count'          => $avgViews,
                ],
                'your_rank'          => $rankTier,
                'percentile'         => $percentile,
                'note'               => "Aggregated benchmark across {$sampleSize} businesses in your category and location. Updated daily.",
            ],
        ]);
    }
}
