<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ListingResource;
use App\Modules\Truedial\Services\BusinessService;
use App\Http\Requests\Truedial\BusinessStoreRequest;
use App\Http\Requests\Truedial\BusinessUpdateRequest;

class BusinessController extends Controller
{
    use \App\Traits\ApiResponse, \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    protected BusinessService $businessService;

    public function __construct(BusinessService $businessService)
    {
        $this->businessService = $businessService;
    }

    public function myBusiness()
    {
        $business = $this->businessService->getMyBusiness();

        if (!$business) {
            return $this->error('No business found', 404);
        }

        return $this->success(new ListingResource($business));
    }

    public function store(BusinessStoreRequest $request)
    {
        // Business logic and validation happens in FormRequest and Service
        $existing = $this->businessService->getMyBusiness();
        if ($existing) {
            return $this->error('You already have a business listing', 400);
        }

        $business = $this->businessService->createBusiness($request->validated());

        return $this->success(new ListingResource($business), 'Business created successfully and is pending approval', 201);
    }

    public function update(BusinessUpdateRequest $request, $id)
    {
        $business = $this->businessService->getBusinessById($id);
        
        $this->authorize('update', $business);

        $business = $this->businessService->updateBusiness($business, $request->validated());

        return $this->success(new ListingResource($business), 'Business updated successfully');
    }

    public function updateProducts(Request $request, \App\Services\ProductService $productService)
    {
        $business = $this->businessService->getMyBusiness();
        if (!$business) return $this->error('No business found', 404);
            
        $this->authorize('update', $business);

        $validated = $request->validate([
            'products' => 'present|array',
            'products.*.id' => 'nullable|exists:listing_products,id',
            'products.*.name' => 'required|string|max:255',
            'products.*.description' => 'nullable|string',
            'products.*.price' => 'nullable|numeric',
            'products.*.image' => 'nullable|string', // Base64
        ]);

        $productService->syncProducts($business, $validated['products']);
        
        $business->load('listingProducts.media');

        return $this->success(new ListingResource($business), 'Products updated successfully');
    }

    public function updateServices(Request $request, \App\Services\ServiceService $serviceService)
    {
        $business = $this->businessService->getMyBusiness();
        if (!$business) return $this->error('No business found', 404);
            
        $this->authorize('update', $business);

        $validated = $request->validate([
            'services' => 'present|array',
            'services.*.id' => 'nullable|exists:listing_services,id',
            'services.*.name' => 'required|string|max:255',
            'services.*.description' => 'nullable|string',
            'services.*.price' => 'nullable|numeric',
            'services.*.image' => 'nullable|string', // Base64
        ]);

        $serviceService->syncServices($business, $validated['services']);

        $business->load('listingServices.media');

        return $this->success(new ListingResource($business), 'Services updated successfully');
    }
}
