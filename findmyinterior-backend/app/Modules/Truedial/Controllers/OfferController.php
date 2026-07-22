<?php

namespace App\Modules\Truedial\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class OfferController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function index()
    {
        $offers = Offer::forCurrentTenant()->get();
        return $this->success($offers);
    }

    public function show($id)
    {
        $offer = Offer::forCurrentTenant()->findOrFail($id);
        return $this->success($offer);
    }

    public function store(Request $request)
    {
        $tenantId = $this->tenantContext->getTenantId();
        
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $validated['tenant_id'] = $tenantId;

        $offer = Offer::create($validated);
        
        return $this->success($offer, 'Offer created successfully', 201);
    }
}
