<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

class BusinessDirectoryController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
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
        $business = Listing::forCurrentTenant()->with(['category', 'city', 'gallery', 'reviews'])
            ->where('status', 'active')
            ->where('slug', $slug)
            ->firstOrFail();

        $business->incrementViews();

        return $this->success($business);
    }

}
