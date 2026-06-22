<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    /**
     * GET /api/v1/listings
     * Directory listing with full filtering, sorting and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Listing::active()
            ->with(['category', 'user'])
            ->withCount(['approvedReviews as review_count']);

        // Filters
        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }
        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }
        if ($request->boolean('verified')) {
            $query->verified();
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }
        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('min_rating')) {
            $query->where('avg_rating', '>=', $request->min_rating);
        }

        // Sorting
        match ($request->get('sort', 'featured')) {
            'rating'  => $query->orderByDesc('avg_rating'),
            'newest'  => $query->orderByDesc('created_at'),
            'popular' => $query->orderByDesc('views_count'),
            default   => $query
                ->orderByRaw('CASE WHEN sponsored_until > NOW() THEN 1 ELSE 0 END DESC')
                ->orderByDesc('sponsored_rank')
                ->orderByDesc('is_featured')
                ->orderByDesc('is_premium')
                ->orderByDesc('avg_rating'),
        };

        $listings = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data'    => ListingResource::collection($listings),
            'meta'    => [
                'current_page' => $listings->currentPage(),
                'per_page'     => $listings->perPage(),
                'total'        => $listings->total(),
                'last_page'    => $listings->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/listings/{slug}
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $listing = Listing::active()
            ->where('slug', $slug)
            ->with(['category', 'gallery', 'approvedReviews.user', 'user'])
            ->firstOrFail();

        $listing->incrementViews();

        return response()->json([
            'success' => true,
            'data'    => new ListingResource($listing),
        ]);
    }

    /**
     * POST /api/v1/listings/{id}/click
     */
    public function trackClick(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:phone,whatsapp,website']
        ]);

        $listing = Listing::findOrFail($id);
        $field = $data['type'] . '_clicks';
        $listing->increment($field);

        return response()->json(['success' => true]);
    }
}
