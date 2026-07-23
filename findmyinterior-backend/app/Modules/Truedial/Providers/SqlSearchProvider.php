<?php

namespace App\Modules\Truedial\Providers;

use App\Models\Listing;
use App\Modules\Truedial\Contracts\SearchProviderInterface;
use Illuminate\Support\Facades\DB;

class SqlSearchProvider implements SearchProviderInterface
{
    public function search(?string $term, array $filters = [], int $perPage = 15): array
    {
        $query = Listing::query()
            ->with(['category', 'media'])
            ->where('status', 'active');

        // Text Search
        if (!empty($term)) {
            $query->search($term); // Uses existing scopeSearch for now
        }

        // Filters
        if (!empty($filters['category_id'])) {
            $query->whereIn('category_id', (array) $filters['category_id']);
        } elseif (!empty($filters['category_name'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['category_name'] . '%')
                  ->orWhere('slug', 'like', '%' . $filters['category_name'] . '%');
            });
        }

        if (!empty($filters['city'])) {
            $query->whereIn('city', (array) $filters['city']);
        }

        if (!empty($filters['verified'])) {
            $query->where('is_verified', true);
        }

        if (!empty($filters['premium'])) {
            $query->where('is_premium', true);
        }

        if (!empty($filters['min_rating'])) {
            $query->where('avg_rating', '>=', (float) $filters['min_rating']);
        }

        if (!empty($filters['offers'])) {
            $query->whereHas('offers', function($q) {
                $q->where('status', 'active')
                  ->where(function($sub) {
                      $sub->whereNull('valid_until')->orWhere('valid_until', '>', now());
                  });
            });
        }

        // Distance / Haversine (if lat/lng provided)
        $hasLocation = !empty($filters['lat']) && !empty($filters['lng']);
        
        // Define ranking score
        // Score = (40 × Premium) + (20 × Featured) + (15 × Verified) + (10 × Rating) + (8 × Review Count) + (5 × Has Active Offer) + (2 × Completeness)
        // In SQLite testing, boolean might be 0/1, in MySQL it's tinyint.
        
        $scoreRaw = "
            (IFNULL(is_premium, 0) * 40) +
            (IFNULL(is_featured, 0) * 20) +
            (IFNULL(is_verified, 0) * 15) +
            (IFNULL(avg_rating, 0) * 10) +
            (IFNULL(review_count, 0) * 8) +
            ((SELECT COUNT(*) FROM offers WHERE offers.listing_id = listings.id AND offers.status = 'active' AND (offers.valid_until IS NULL OR offers.valid_until > CURRENT_TIMESTAMP)) > 0) * 5
        ";
        
        // We add this score as a selected column
        $query->select('listings.*');
        $query->selectRaw("({$scoreRaw}) as ranking_score");

        if ($hasLocation) {
            $lat = (float) $filters['lat'];
            $lng = (float) $filters['lng'];
            $query->selectRaw(
                "(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance",
                [$lat, $lng, $lat]
            );
            
            // If distance filter is applied
            if (!empty($filters['max_distance'])) {
                $query->having('distance', '<=', (float) $filters['max_distance']);
            }
            
            // Sort by distance first if requested, otherwise by ranking_score
            if (!empty($filters['sort']) && $filters['sort'] === 'distance') {
                $query->orderBy('distance', 'asc');
            } else {
                $query->orderBy('ranking_score', 'desc');
            }
        } else {
            $query->orderBy('ranking_score', 'desc');
        }

        $query->orderBy('created_at', 'desc'); // Tie breaker (Recency)

        // Generate Facets
        // In a real provider like Meilisearch, facets are returned in the single query.
        // For SQL, we might have to run separate aggregates.
        // For performance, we'll keep it simple here.
        $facets = [
            'total' => $query->count(),
            // Add category counts etc. if needed later, skipped to save SQL load
        ];

        return [
            'data' => $query->paginate($perPage),
            'facets' => $facets
        ];
    }

    public function autocomplete(string $term, int $limit = 8)
    {
        return Listing::query()
            ->with(['category', 'media'])
            ->where('status', 'active')
            ->search($term)
            ->limit($limit)
            ->get()
            ->map(function ($listing) {
                return [
                    'id' => $listing->id,
                    'title' => $listing->title,
                    'slug' => $listing->slug,
                    'category' => $listing->category?->name,
                    'locality' => $listing->address ?? $listing->city,
                    'rating' => $listing->avg_rating ?? 0,
                    'is_verified' => $listing->is_verified,
                    'cover_image' => collect($listing->media)->firstWhere('is_cover', true)?->url ?? collect($listing->media)->first()?->url ?? null,
                ];
            });
    }
}
