<?php

namespace App\Modules\Truedial\Contracts;

interface SearchProviderInterface
{
    /**
     * Perform a search query and return paginated results with facets.
     *
     * @param string|null $term
     * @param array $filters (categories, cities, verified, premium, rating, distance, lat, lng, etc.)
     * @param int $perPage
     * @return array ['data' => \Illuminate\Contracts\Pagination\LengthAwarePaginator, 'facets' => array]
     */
    public function search(?string $term, array $filters = [], int $perPage = 15): array;

    /**
     * Fast autocomplete search.
     *
     * @param string $term
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function autocomplete(string $term, int $limit = 8);
}
