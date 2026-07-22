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
                Listing::forCurrentTenant()
                    ->active()
                    ->search($term)
                    ->with(['category'])
                    ->orderByDesc('is_verified')
                    ->take(8)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'workers'])) {
            $results['workers'] = WorkerResource::collection(
                Worker::active()
                    ->search($term)
                    ->orderByDesc('is_verified')
                    ->take(6)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'builders'])) {
            $results['builders'] = BuilderResource::collection(
                Builder::active()
                    ->where('company_name', 'LIKE', "%{$term}%")
                    ->orderByDesc('is_verified')
                    ->take(4)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'suppliers'])) {
            $results['suppliers'] = SupplierResource::collection(
                Supplier::active()
                    ->where('company_name', 'LIKE', "%{$term}%")
                    ->orderByDesc('is_verified')
                    ->take(4)
                    ->get()
            );
        }

        if (in_array($type, ['all', 'projects'])) {
            $results['projects'] = BuilderProjectResource::collection(
                BuilderProject::where('title', 'LIKE', "%{$term}%")
                    ->orWhere('city', 'LIKE', "%{$term}%")
                    ->with(['builder'])
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
