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
        if ($request->filled('budget') && $request->budget !== 'All Budget') {
            $query->where('budget_tier', $request->budget);
        }

        // Join users table to sort by trust metrics
        $query->join('users', 'users.id', '=', 'listings.user_id')
              ->select('listings.*');

        // Sorting
        match ($request->get('sort', 'featured')) {
            'rating'  => $query->orderByDesc('listings.avg_rating'),
            'newest'  => $query->orderByDesc('listings.created_at'),
            'popular' => $query->orderByDesc('listings.views_count'),
            default   => $query
                ->orderByRaw('CASE WHEN listings.sponsored_until > CURRENT_TIMESTAMP THEN 1 ELSE 0 END DESC')
                ->orderByDesc('listings.sponsored_rank')
                ->orderByDesc('listings.is_featured')
                ->orderByDesc('listings.is_verified')
                ->orderByDesc('listings.is_premium')
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
                ->orderByDesc('listings.avg_rating'),
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
        $query = Listing::active()
            ->with(['category', 'gallery', 'approvedReviews.reviewer', 'user']);

        if (is_numeric($slug)) {
            $query->where(function($q) use ($slug) {
                $q->where('id', $slug)
                  ->orWhere('user_id', $slug);
            });
        } else {
            $query->where('slug', $slug);
        }

        $listing = $query->first();

        if (!$listing && is_numeric($slug)) {
            // If listing not found, check if it's a valid user id and generate a stub Listing
            $user = \App\Models\User::with([
                'worker.approvedReviews.reviewer', 
                'supplier.approvedReviews.reviewer', 
                'builder.approvedReviews.reviewer'
            ])->find($slug);
            
            if (!$user) {
                abort(404);
            }
            
            $listing = new Listing();
            $listing->id = $user->id;
            $listing->user_id = $user->id;
            $listing->title = $user->name;
            $listing->slug = (string)$user->id;
            $listing->description = 'Profile pending completion.';
            $listing->city = $user->worker?->city ?? $user->builder?->city ?? $user->supplier?->city ?? 'Unknown';
            $listing->address = $user->worker?->address ?? null;
            $listing->avg_rating = $user->worker?->avg_rating ?? $user->builder?->avg_rating ?? $user->supplier?->avg_rating ?? 0;
            $listing->review_count = $user->worker?->review_count ?? $user->builder?->review_count ?? $user->supplier?->review_count ?? 0;
            $listing->is_verified = false;
            $listing->trust_score = $user->trust_score;
            $listing->profile_completion_score = $user->profile_completion_score;
            $listing->verification_level = $user->verification_level;

            // Worker specific fields mapping to Listing fields
            if ($user->worker) {
                $listing->years_experience = (int)$user->worker->experience_years;
                $listing->budget_tier = '₹' . $user->worker->daily_rate . '/day';
                if ($user->worker->skill) {
                    $listing->services = [$user->worker->skill];
                }
                $listing->description = $user->worker->bio ?? 'Profile pending completion.';
                $listing->phone = $user->phone;
            }
            
            $listing->setRelation('user', $user);
            $listing->setRelation('category', new \App\Models\Category(['name' => 'Professional', 'slug' => 'professional']));
            $listing->setRelation('gallery', collect());
            
            $reviews = $user->worker?->approvedReviews ?? 
                       $user->builder?->approvedReviews ?? 
                       $user->supplier?->approvedReviews ?? 
                       collect();
            $listing->setRelation('approvedReviews', $reviews);
        } elseif (!$listing) {
            abort(404);
        } else {
            $listing->incrementViews();
        }

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
