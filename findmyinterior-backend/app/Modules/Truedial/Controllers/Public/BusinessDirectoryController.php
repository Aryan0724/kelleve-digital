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

    public function __construct(TenantContext $tenantContext, BusinessPageService $businessPageService)
    {
        $this->tenantContext = $tenantContext;
        $this->businessPageService = $businessPageService;
    }

    public function index(Request $request)
    {
        $query = Listing::forCurrentTenant()->with(['category', 'city', 'media'])
            ->where('status', 'active');

        if ($request->filled('search') || $request->filled('q')) {
            $search = $request->query('search') ?? $request->query('q');
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('address', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('city')) {
            $city = $request->query('city');
            $query->where(function($q) use ($city) {
                $q->where('city', 'LIKE', "%{$city}%")
                  ->orWhereHas('city', function($cq) use ($city) {
                      $cq->where('name', 'LIKE', "%{$city}%");
                  });
            });
        }

        if ($request->filled('category_id')) {
            $query->byCategory($request->category_id);
        } elseif ($request->filled('category_name') || $request->filled('category')) {
            $cat = $request->query('category_name') ?? $request->query('category');
            $query->whereHas('category', function($q) use ($cat) {
                $q->where('name', 'LIKE', "%{$cat}%")
                  ->orWhere('slug', 'LIKE', "%{$cat}%");
            });
        }

        $businesses = $query->latest()->paginate(15);
        return $this->success($businesses);
    }

    public function show($slug)
    {
        $businessDTO = $this->businessPageService->getBusinessProfile($slug);

        \App\Modules\Truedial\Services\AnalyticsEventService::track(
            $this->tenantContext->getTenantId(),
            \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_BUSINESS_VIEW,
            'listing',
            $businessDTO->basicInfo['id'],
            auth('sanctum')->id()
        );

        return $this->success($businessDTO);
    }

}
