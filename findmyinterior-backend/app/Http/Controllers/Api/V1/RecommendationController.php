<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RecommendationController extends Controller
{
    /**
     * GET /api/v1/requirements/{id}/recommendations
     * Returns the top pre-calculated vendor recommendations for a requirement.
     */
    public function index(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        if ($type === 'rfq') $modelClass = \App\Models\Rfq::class;
        if ($type === 'job') $modelClass = \App\Models\WorkerJob::class;
        
        $requirement = $modelClass::findOrFail($requirementId);

        // Fetch recommendations from DB
        $recs = DB::table('requirement_recommendations')
            ->where('requirement_id', $requirementId)
            ->where('requirement_type', $modelClass)
            ->orderByDesc('match_score')
            ->get();

        // Load vendors with metrics and category
        $vendorIds = $recs->pluck('vendor_id');
        $vendors = User::with(['vendorMetric', 'listing.category'])
            ->whereIn('id', $vendorIds)
            ->get()
            ->keyBy('id');

        $entitlement = app(\App\Services\EntitlementService::class);

        $recommendations = $recs->map(function ($rec) use ($vendors, $entitlement) {
            $vendor = $vendors->get($rec->vendor_id);
            if (!$vendor) return null;

            // Ensure metric exists even if empty
            $metric = $vendor->vendorMetric ?? new \App\Models\VendorMetric();

            $breakdown = json_decode($rec->score_breakdown_json ?? '{}', true) ?: [];
            $cachedBoost = (float) ($breakdown['subscription_boost'] ?? 0);
            $baseScore = (float) $rec->match_score - $cachedBoost;
            $liveBoost = (float) $entitlement->getLimit($vendor, 'recommendation_score_boost');
            $effectiveScore = round(min(100, max(0, $baseScore + $liveBoost)), 2);

            return [
                'id' => $rec->id ?? null,
                'vendor_id' => $rec->vendor_id,
                'match_score' => $effectiveScore,
                'invited_at' => $rec->invited_at,
                'vendor' => [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'avatar' => $vendor->avatar,
                    'category' => $vendor->listing?->category,
                    'vendorMetric' => $metric,
                ]
            ];
        })->filter()->sortByDesc('match_score')->values();

        return response()->json([
            'success'         => true,
            'requirement_id'  => $requirementId,
            'recommendations' => $recommendations->map(fn($r) => array_merge($r, [
                'vendor_name' => $r['vendor']['name'] ?? null,
            ])),
            'data'            => $recommendations,
        ]);
    }
}
