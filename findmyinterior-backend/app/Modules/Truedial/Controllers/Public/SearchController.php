<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Modules\Truedial\Services\SearchService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use \App\Traits\ApiResponse;

    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function index(Request $request)
    {
        $params = $request->only([
            'q', 'category_id', 'city', 'verified', 'premium', 
            'min_rating', 'lat', 'lng', 'max_distance', 'sort', 'per_page'
        ]);

        $results = $this->searchService->search($params);

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
