<?php

namespace App\Modules\Truedial\Services;

use App\Modules\Truedial\Contracts\SearchProviderInterface;
use Illuminate\Support\Facades\Cache;
use App\Models\Category;

class SearchService
{
    protected SearchProviderInterface $provider;

    public function __construct(SearchProviderInterface $provider)
    {
        $this->provider = $provider;
    }

    public function search(array $params)
    {
        $term = $params['q'] ?? null;
        $filters = [
            'category_id' => $params['category_id'] ?? null,
            'city'        => $params['city'] ?? null,
            'verified'    => $params['verified'] ?? false,
            'premium'     => $params['premium'] ?? false,
            'min_rating'  => $params['min_rating'] ?? null,
            'lat'         => $params['lat'] ?? null,
            'lng'         => $params['lng'] ?? null,
            'max_distance'=> $params['max_distance'] ?? null,
            'sort'        => $params['sort'] ?? null,
        ];
        
        $perPage = $params['per_page'] ?? 15;

        // Note: Main search results are NOT cached aggressively, per architectural guidelines.
        return $this->provider->search($term, $filters, $perPage);
    }

    public function autocomplete(string $term)
    {
        // Cache autocomplete for short durations (e.g. 5 minutes)
        $cacheKey = 'search_autocomplete_' . md5($term);
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($term) {
            return $this->provider->autocomplete($term);
        });
    }

    public function getCategories()
    {
        return Cache::remember('search_categories', now()->addHours(24), function () {
            return Category::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'icon']);
        });
    }
}
