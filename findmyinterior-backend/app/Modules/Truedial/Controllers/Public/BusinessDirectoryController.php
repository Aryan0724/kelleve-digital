<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

use App\Modules\Truedial\Services\BusinessPageService;

class BusinessDirectoryController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;
    protected BusinessPageService $businessPageService;
    protected \App\Modules\Truedial\Services\SearchService $searchService;

    public function __construct(
        TenantContext $tenantContext, 
        BusinessPageService $businessPageService,
        \App\Modules\Truedial\Services\SearchService $searchService
    ) {
        $this->tenantContext = $tenantContext;
        $this->businessPageService = $businessPageService;
        $this->searchService = $searchService;
    }

    public function index(Request $request)
    {
        $params = $request->only([
            'q', 'search', 'category_id', 'category_name', 'category', 'city', 'verified', 'premium', 
            'min_rating', 'lat', 'lng', 'max_distance', 'sort', 'per_page'
        ]);
        
        // Normalize search param
        if (isset($params['search']) && !isset($params['q'])) {
            $params['q'] = $params['search'];
        }
        // Normalize category param
        if (isset($params['category']) && !isset($params['category_name'])) {
            $params['category_name'] = $params['category'];
        }

        $results = $this->searchService->search($params);

        if ($request->filled('category_id')) {
            $query->byCategory($request->category_id);
        } elseif ($request->filled('category_name') || $request->filled('category')) {
            $cat = $request->query('category_name') ?? $request->query('category');
            $cleanCat = trim(str_replace(['&', 'and'], '', $cat));
            $words = array_filter(explode(' ', $cleanCat));
            $query->whereHas('category', function($q) use ($cat, $words) {
                $q->where('name', 'LIKE', "%{$cat}%")
                  ->orWhere('slug', 'LIKE', "%{$cat}%");
                foreach ($words as $word) {
                    if (strlen($word) > 2) {
                        $q->orWhere('name', 'LIKE', "%{$word}%")
                          ->orWhere('slug', 'LIKE', "%{$word}%");
                    }
                }
            });
        }

        $businesses = $query->latest()->paginate(15);
        return $this->success($businesses);
    }

    public function show($slug)
    {
        $businessDTO = $this->businessPageService->getBusinessProfile($slug);

        try {
            \App\Modules\Truedial\Services\AnalyticsEventService::track(
                $this->tenantContext->getTenantId() ?? 2,
                \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_BUSINESS_VIEW,
                'listing',
                $businessDTO->basicInfo['id'],
                auth('sanctum')->id()
            );
        } catch (\Throwable $e) {
            // Analytics tracking failsafe
        }

        return $this->success($businessDTO);
    }

}
