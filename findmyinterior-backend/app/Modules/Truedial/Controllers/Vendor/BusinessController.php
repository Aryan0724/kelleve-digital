<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

class BusinessController extends Controller
{
    use \App\Traits\ApiResponse, \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function myBusiness()
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->with(['category', 'city', 'gallery', 'listingProducts.media', 'listingServices.media'])
            ->first();

        if (!$business) {
            return $this->error('No business found', 404);
        }

        return $this->success($business);
    }

    public function store(Request $request)
    {
        $tenantId = $this->tenantContext->getTenantId();
        
        $existing = Listing::forCurrentTenant()->where('user_id', Auth::id())->first();
        if ($existing) {
            return $this->error('You already have a business listing', 400);
        }

        // Default missing required fields for TrueDial
        $data = $request->all();
        if (!isset($data['category_id'])) $data['category_id'] = \App\Models\Category::first()->id ?? 1;
        if (!isset($data['city_id'])) $data['city_id'] = \App\Models\City::first()->id ?? 1;
        if (!isset($data['district'])) $data['district'] = 'N/A';
        if (!isset($data['state'])) $data['state'] = 'N/A';
        $request->merge($data);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'district' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'website' => 'nullable|url',
            'availability' => 'nullable|string',
            'response_time' => 'nullable|string',
            'social_links' => 'nullable|array',
            'services' => 'nullable|array',
            'professional_type' => 'nullable|string',
        ]);

        $tenantId = $this->tenantContext->getTenantId();
        $validated['tenant_id'] = $tenantId;
        $validated['user_id'] = Auth::id();
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . time();
        $validated['status'] = 'pending'; // Requires admin approval

        if (isset($validated['professional_type'])) {
            Auth::user()->update(['professional_type' => $validated['professional_type']]);
            unset($validated['professional_type']);
        }

        $business = Listing::create($validated);

        return $this->success($business, 'Business created successfully and is pending approval', 201);
    }

    public function update(Request $request, $id)
    {
        $business = Listing::forCurrentTenant()->findOrFail($id);
        
        $this->authorize('update', $business);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'district' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'website' => 'nullable|url',
            'availability' => 'nullable|string',
            'response_time' => 'nullable|string',
            'social_links' => 'nullable|array',
            'services' => 'nullable|array',
            'professional_type' => 'nullable|string',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $business->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . time();
        }

        // Update professional_type on user if provided
        if (isset($validated['professional_type'])) {
            $business->user->update(['professional_type' => $validated['professional_type']]);
            unset($validated['professional_type']);
        }

        $business->update($validated);

        return $this->success($business, 'Business updated successfully');
    }

    public function updateProducts(Request $request, \App\Services\ProductService $productService)
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->firstOrFail();
            
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

        return $this->success($business, 'Products updated successfully');
    }

    public function updateServices(Request $request, \App\Services\ServiceService $serviceService)
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->firstOrFail();
            
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

        return $this->success($business, 'Services updated successfully');
    }
}
