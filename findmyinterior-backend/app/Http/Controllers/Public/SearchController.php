<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\BuilderProjectResource;
use App\Http\Resources\BuilderResource;
use App\Http\Resources\ListingResource;
use App\Http\Resources\SupplierResource;
use App\Http\Resources\WorkerResource;
use App\Models\Builder;
use App\Models\BuilderProject;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * GET /api/v1/search?q=kitchen+designer+patna&type=listings
     * Global FULLTEXT search across listings, workers, builders, suppliers.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'q'    => ['required', 'string', 'min:2', 'max:200'],
            'type' => ['nullable', 'in:listings,workers,builders,suppliers,projects'],
        ]);

        $term = $request->q;
        $type = $request->get('type', 'all');

        $results = [];

        if (in_array($type, ['all', 'listings'])) {
            $results['listings'] = ListingResource::collection(
                Listing::active()
                    ->search($term)
                    ->join('users', 'users.id', '=', 'listings.user_id')
                    ->leftJoin('user_subscriptions', function($join) {
                        $join->on('user_subscriptions.user_id', '=', 'users.id')
                            ->where('user_subscriptions.status', '=', 'active')
                            ->where('user_subscriptions.expires_at', '>', now());
                    })
                    ->leftJoin('subscription_plans', 'subscription_plans.id', '=', 'user_subscriptions.subscription_plan_id')
                    ->select(
                        'listings.*', 
                        \Illuminate\Support\Facades\DB::raw('(users.trust_score + COALESCE(subscription_plans.search_ranking_boost, 0)) as dynamic_trust_score'),
                        \Illuminate\Support\Facades\DB::raw('COALESCE(subscription_plans.is_featured_listing, false) as dynamic_is_featured')
                    )
                    ->with(['category', 'user.activeSubscription.plan'])
                    ->orderByDesc('dynamic_is_featured')
                    ->orderByDesc('listings.is_featured')
                    ->orderByDesc('listings.is_premium')
                    ->orderByDesc('listings.is_verified')
                    ->orderByDesc('dynamic_trust_score')
                    ->orderByDesc('views_count')
                    ->orderByDesc('listings.id')
                    ->distinct()
                    ->take(8)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'workers'])) {
            $results['workers'] = WorkerResource::collection(
                Worker::active()
                    ->search($term)
                    ->orderByDesc('is_featured')
                    ->orderByDesc('is_verified')
                    ->orderByDesc('id')
                    ->take(6)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'builders'])) {
            $results['builders'] = BuilderResource::collection(
                Builder::active()
                    ->where('company_name', 'LIKE', "%{$term}%")
                    ->orderByDesc('is_featured')
                    ->orderByDesc('is_verified')
                    ->orderByDesc('id')
                    ->take(4)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'suppliers'])) {
            $results['suppliers'] = SupplierResource::collection(
                Supplier::active()
                    ->where('company_name', 'LIKE', "%{$term}%")
                    ->orderByDesc('is_featured')
                    ->orderByDesc('is_verified')
                    ->orderByDesc('id')
                    ->take(4)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'projects'])) {
            $results['projects'] = BuilderProjectResource::collection(
                BuilderProject::where('title', 'LIKE', "%{$term}%")
                    ->orWhere('city', 'LIKE', "%{$term}%")
                    ->with(['builder'])
                    ->orderByDesc('id')
                    ->take(4)
                    ->get()
            );
        }

        return response()->json([
            'success' => true,
            'query'   => $term,
            'data'    => $results,
        ]);
    }
}
