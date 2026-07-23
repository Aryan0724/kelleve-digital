<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Modules\Truedial\Services\SearchService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use \App\Traits\ApiResponse;

    protected SearchService $searchService;
    protected \App\Core\Tenancy\TenantContext $tenantContext;

    public function __construct(SearchService $searchService, \App\Core\Tenancy\TenantContext $tenantContext)
    {
        $this->searchService = $searchService;
        $this->tenantContext = $tenantContext;
    }

    public function index(Request $request)
    {
        $params = $request->only([
            'q', 'category_id', 'category_name', 'city', 'verified', 'premium', 
            'min_rating', 'lat', 'lng', 'max_distance', 'sort', 'per_page'
        ]);

        $results = $this->searchService->search($params);

        // Track impressions
        $userId = auth('sanctum')->id();
        $tenantId = $this->tenantContext->getTenantId();
        
        if (isset($results)) {
            $items = is_array($results) ? ($results['data'] ?? []) : (is_object($results) && method_exists($results, 'items') ? $results->items() : []);
            foreach ($items as $item) {
                // $item could be an array (if DTO serialized) or object
                $entityId = is_array($item) ? ($item['basicInfo']['id'] ?? $item['id'] ?? null) : ($item->id ?? null);
                if ($entityId) {
                    \App\Modules\Truedial\Services\AnalyticsEventService::track(
                        $tenantId,
                        \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_SEARCH_IMPRESSION,
                        'listing',
                        $entityId,
                        $userId,
                        null,
                        [
                            'search_query' => $params['q'] ?? null,
                            'city' => $params['city'] ?? null,
                            'category_id' => $params['category_id'] ?? null,
                            'referrer' => 'search'
                        ]
                    );
                }
            }
        }

        return $this->success($results);
    }

    public function autocomplete(Request $request)
    {
        $term = $request->get('q', '');
        
        if (strlen($term) < 2) {
            return $this->success([]);
        }

        $results = $this->searchService->autocomplete($term);

        return $this->success($results);
    }

    public function categories()
    {
        $categories = $this->searchService->getCategories();
        return $this->success($categories);
    }
}
