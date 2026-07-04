<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\BuilderProjectResource;
use App\Http\Resources\BuilderResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ListingResource;
use App\Http\Resources\SupplierResource;
use App\Http\Resources\WorkerResource;
use App\Models\Builder;
use App\Models\BuilderProject;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    /**
     * GET /api/v1/homepage
     * Returns all data needed to render the homepage in a single request.
     */
    public function __invoke(): JsonResponse
    {
        $data = \Illuminate\Support\Facades\Cache::remember('homepage_data', 900, function () {
            // Stats bar
        $stats = [
            'verified_professionals' => Listing::active()->verified()->count(),
            'total_projects'         => BuilderProject::whereIn('status', ['completed', 'possession_ready'])->count(),
            'happy_customers'        => Listing::active()->sum('review_count'),
            'cities_covered'         => Listing::active()->distinct('city')->count('city'),
            'categories'             => Category::active()->whereNull('parent_id')->count(),
        ];

        // Homepage sections
        $categories = Category::active()
            ->whereNull('parent_id')
            ->ordered()
            ->get();

        $featuredListings = Listing::active()
            ->featured()
            ->join('users', 'users.id', '=', 'listings.user_id')
            ->select('listings.*')
            ->with(['category'])
            ->orderByRaw("
                CASE users.verification_level
                    WHEN 'elite_professional' THEN 4
                    WHEN 'trusted_professional' THEN 3
                    WHEN 'verified_business' THEN 2
                    WHEN 'basic_member' THEN 1
                    ELSE 0
                END DESC
            ")
            ->orderByDesc('users.trust_score')
            ->orderByDesc('users.profile_completion_score')
            ->latest('listings.created_at')
            ->take(8)
            ->get();

        $featuredBuilders = Builder::active()
            ->featured()
            ->with(['projects' => fn($q) => $q->featured()->take(1)])
            ->take(6)
            ->get();

        $possessionProjects = BuilderProject::possessionReady()
            ->with(['builder', 'images' => fn($q) => $q->take(1)])
            ->featured()
            ->latest()
            ->take(6)
            ->get();

        $upcomingProjects = BuilderProject::upcoming()
            ->with(['builder', 'images' => fn($q) => $q->take(1)])
            ->latest()
            ->take(6)
            ->get();

        $featuredSuppliers = Supplier::active()
            ->featured()
            ->with(['activeProducts' => fn($q) => $q->take(3)])
            ->take(6)
            ->get();

        $featuredWorkers = Worker::active()
            ->featured()
            ->available()
            ->take(8)
            ->get();

        return [
            'stats'               => $stats,
            'categories'          => CategoryResource::collection($categories),
            'featured_listings'   => ListingResource::collection($featuredListings),
            'featured_builders'   => BuilderResource::collection($featuredBuilders),
            'possession_projects' => BuilderProjectResource::collection($possessionProjects),
            'upcoming_projects'   => BuilderProjectResource::collection($upcomingProjects),
            'featured_suppliers'  => SupplierResource::collection($featuredSuppliers),
            'featured_workers'    => WorkerResource::collection($featuredWorkers),
        ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
