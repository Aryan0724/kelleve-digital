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
            ->withCount(['approvedReviews as review_count', 'gallery as gallery_count']);

        // Filters
        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('city')) {
            $cityVal = strtolower(trim($request->city));
            $query->whereRaw('LOWER(listings.city) LIKE ?', ["%{$cityVal}%"]);
        }
        if ($request->filled('district')) {
            $distVal = strtolower(trim($request->district));
            $query->whereRaw('LOWER(listings.district) LIKE ?', ["%{$distVal}%"]);
        }
        if ($request->boolean('verified')) {
            $query->where('listings.is_verified', true);
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }
        if ($request->filled('professional_type')) {
            $ptVal = strtolower(trim($request->professional_type));
            // Match by professional_type on user or in title/description
            $query->where(function ($q) use ($ptVal) {
                $q->whereHas('user', fn($uq) => $uq->whereRaw('LOWER(users.professional_type) LIKE ?', ["%{$ptVal}%"]))
                  ->orWhereRaw('LOWER(listings.title) LIKE ?', ["%{$ptVal}%"])
                  ->orWhereRaw('LOWER(listings.description) LIKE ?', ["%{$ptVal}%"]);
            });
        }
        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('services')) {
            $services = array_filter(array_map('trim', explode(',', strtolower($request->services))));
            if (!empty($services)) {
                $query->where(function ($q) use ($services) {
                    foreach ($services as $service) {
                        $q->orWhereRaw('LOWER(listings.services) LIKE ?', ["%{$service}%"]);
                    }
                });
            }
        }
        // 'name' param - search by company/person name specifically
        if ($request->filled('name')) {
            $nameVal = strtolower(trim($request->name));
            $query->whereRaw('LOWER(listings.title) LIKE ?', ["%{$nameVal}%"]);
        }
        if ($request->filled('min_rating')) {
            $query->where('listings.avg_rating', '>=', $request->min_rating);
        }
        if ($request->filled('budget') && $request->budget !== 'All Budget') {
            $query->where('listings.budget_tier', $request->budget);
        }
        if ($request->filled('experience')) {
            $query->where('listings.years_experience', '>=', (int) $request->experience);
        }
        if ($request->filled('years_min')) {
            $query->where('listings.years_experience', '>=', (int) $request->years_min);
        }
        if ($request->filled('years_max')) {
            $query->where('listings.years_experience', '<=', (int) $request->years_max);
        }
        if ($request->boolean('delivery_available')) {
            $query->where(function ($q) {
                $q->whereRaw('LOWER(listings.services) LIKE ?', ['%delivery%'])
                  ->orWhereRaw('LOWER(listings.availability) LIKE ?', ['%delivery%']);
            });
        }
        if ($request->filled('material_type')) {
            $mtVal = strtolower(trim($request->material_type));
            $query->whereRaw('LOWER(listings.products) LIKE ?', ["%{$mtVal}%"]);
        }
        if ($request->filled('business_type')) {
            $btVal = strtolower(trim($request->business_type));
            $query->where(function ($q) use ($btVal) {
                $q->whereRaw('LOWER(listings.services) LIKE ?', ["%{$btVal}%"])
                  ->orWhereHas('category', fn($cq) => $cq->whereRaw('LOWER(categories.name) LIKE ?', ["%{$btVal}%"]));
            });
        }

        // Join users table to sort by trust metrics
        // Note: we must select listings.* ONLY to avoid column ambiguity (both tables have is_verified, status, etc.)
        $query->join('users', 'users.id', '=', 'listings.user_id')
              ->select('listings.*', 'users.trust_score as user_trust_score', 'users.profile_completion_score as user_profile_score', 'users.verification_level as user_verification_level');

        // Sorting
        match ($request->get('sort', 'featured')) {
            'rating'  => $query->orderByDesc('listings.avg_rating')->orderByDesc('listings.id'),
            'newest'  => $query->orderByDesc('listings.created_at')->orderByDesc('listings.id'),
            'popular' => $query->orderByDesc('listings.views_count')->orderByDesc('listings.id'),
            default   => $query
                ->orderByRaw('CASE WHEN listings.sponsored_until > CURRENT_TIMESTAMP THEN 1 ELSE 0 END DESC')
                ->orderByDesc('listings.sponsored_rank')
                ->orderByDesc('listings.is_featured')
                ->orderByDesc('listings.is_verified')
                ->orderByDesc('listings.is_premium')
                ->orderByRaw("
                    CASE user_verification_level
                        WHEN 'elite_professional' THEN 4
                        WHEN 'trusted_professional' THEN 3
                        WHEN 'verified_business' THEN 2
                        WHEN 'basic_member' THEN 1
                        ELSE 0
                    END DESC
                ")
                ->orderByDesc('user_trust_score')
                ->orderByDesc('user_profile_score')
                ->orderByDesc('listings.avg_rating')
                ->orderByDesc('listings.id'),
        };

        // Avoid caching the entire LengthAwarePaginator object as it can cause serialization issues
        // especially during deployments or when the container environment changes.
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
        // 1. Try exact slug match FIRST (without global tenant scope so cross-tenant/public links work)
        $listing = Listing::withoutGlobalScopes()
            ->with(['category', 'gallery', 'approvedReviews.reviewer', 'user'])
            ->where('slug', $slug)
            ->first();

        // 2. If numeric, try exact ID or user_id match
        if (!$listing && is_numeric($slug)) {
            $listing = Listing::withoutGlobalScopes()
                ->with(['category', 'gallery', 'approvedReviews.reviewer', 'user'])
                ->where(function($q) use ($slug) {
                    $q->where('id', $slug)->orWhere('user_id', $slug);
                })
                ->first();
        }

        // 3. Match by numeric ID contained within slug if present
        if (!$listing && !is_numeric($slug)) {
            $parts = explode('-', $slug);
            foreach ($parts as $part) {
                if (is_numeric($part) && (int)$part > 0) {
                    $listing = Listing::withoutGlobalScopes()
                        ->with(['category', 'gallery', 'approvedReviews.reviewer', 'user'])
                        ->where('id', $part)
                        ->orWhere('user_id', $part)
                        ->first();
                    if ($listing) break;
                }
            }
        }

        // 4. Try matching words in slug against slug, title, or user name
        // REMOVED: Dangerous fuzzy matching that returned incorrect profiles.

        // 5. Fallback: match by first significant word in slug
        // REMOVED: Dangerous fuzzy matching that returned incorrect profiles.

        // 6. Fallback: User ID lookup & stub generation for workers/suppliers/builders
        if (!$listing) {
            $userIdToFind = is_numeric($slug) ? $slug : null;
            if (!$userIdToFind) {
                $parts = explode('-', $slug);
                foreach ($parts as $part) {
                    if (is_numeric($part) && (int)$part > 0) {
                        $userIdToFind = $part;
                        break;
                    }
                }
            }

            if ($userIdToFind) {
                $user = \App\Models\User::with([
                    'worker.approvedReviews.reviewer', 
                    'supplier.approvedReviews.reviewer', 
                    'builder.approvedReviews.reviewer'
                ])->find($userIdToFind);
                
                if ($user) {
                    $listing = new Listing();
                    $listing->id = $user->id;
                    $listing->user_id = $user->id;
                    $listing->title = $user->name;
                    $listing->slug = (string)$user->id;
                    $listing->cover_image = $user->cover_image;
                    $listing->description = 'Profile pending completion.';
                    $listing->city = $user->worker?->city ?? $user->builder?->city ?? $user->supplier?->city ?? 'Unknown';
                    $listing->address = $user->worker?->address ?? null;
                    $listing->avg_rating = $user->worker?->avg_rating ?? $user->builder?->avg_rating ?? $user->supplier?->avg_rating ?? 0;
                    $listing->review_count = $user->worker?->review_count ?? $user->builder?->review_count ?? $user->supplier?->review_count ?? 0;
                    $listing->is_verified = false;
                    $listing->trust_score = $user->trust_score;
                    $listing->profile_completion_score = $user->profile_completion_score;
                    $listing->verification_level = $user->verification_level;

                    if ($user->worker) {
                        $listing->years_experience = (int)$user->worker->experience_years;
                        $listing->budget_tier = '₹' . $user->worker->daily_rate . '/day';
                        $listing->services = $user->worker->services ?? ($user->worker->skill ? [$user->worker->skill] : []);
                        $listing->description = $user->worker->bio ?? 'Profile pending completion.';
                        $listing->phone = $user->phone;
                        $listing->achievements = $user->worker->achievements ?? [];
                        $listing->languages = $user->worker->languages ?? [];
                    } elseif ($user->supplier) {
                        $listing->description = $user->supplier->company_name ?? 'Profile pending completion.';
                        $listing->phone = $user->supplier->phone ?? $user->phone;
                        $listing->services = $user->supplier->services ?? [];
                        $listing->achievements = $user->supplier->achievements ?? [];
                        $listing->languages = $user->supplier->languages ?? [];
                    } elseif ($user->builder) {
                        $listing->description = $user->builder->company_name ?? 'Profile pending completion.';
                        $listing->phone = $user->builder->phone ?? $user->phone;
                        $listing->services = $user->builder->services ?? [];
                        $listing->achievements = $user->builder->achievements ?? [];
                        $listing->languages = $user->builder->languages ?? [];
                    }
                    
                    $listing->setRelation('user', $user);
                    $listing->setRelation('category', new \App\Models\Category(['name' => 'Professional', 'slug' => 'professional']));
                    $listing->setRelation('gallery', collect());
                    
                    $reviews = $user->worker?->approvedReviews ?? 
                               $user->builder?->approvedReviews ?? 
                               $user->supplier?->approvedReviews ?? 
                               collect();
                    $listing->setRelation('approvedReviews', $reviews);
                }
            }
        }

        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Professional not found'], 404);
        }

        try {
            $listing->incrementViews();
        } catch (\Throwable $e) {}

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
