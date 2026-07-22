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
        $query = Listing::forCurrentTenant()->with(['category', 'city', 'gallery'])
            ->where('status', 'active')
            ->where('is_verified', true);

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        }

        $businesses = $query->paginate(15);
        return $this->success($businesses);
    }

    public function show($slug)
    {
        $businessDTO = $this->businessPageService->getBusinessProfile($slug);

        \App\Modules\Truedial\Services\AnalyticsEventService::track(
            $this->tenantContext->getTenantId(),
            'view',
            'listing',
            $businessDTO->basicInfo['id'],
            auth('sanctum')->id()
        );

        return $this->success($businessDTO);
    }

}
