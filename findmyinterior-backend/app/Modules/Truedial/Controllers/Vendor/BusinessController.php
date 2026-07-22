<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

class BusinessController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function myBusiness()
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->with(['category', 'city', 'gallery'])
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
        ]);

        $validated['tenant_id'] = $tenantId;
        $validated['user_id'] = Auth::id();
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . time();
        $validated['status'] = 'pending'; // Requires admin approval

        $business = Listing::create($validated);

        return $this->success($business, 'Business created successfully and is pending approval', 201);
    }

    public function update(Request $request, $id)
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->findOrFail($id);

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
        ]);

        if (isset($validated['title']) && $validated['title'] !== $business->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . time();
        }

        $business->update($validated);

        return $this->success($business, 'Business updated successfully');
    }

    public function updateProducts(Request $request)
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'products' => 'present|array',
            'products.*.name' => 'required|string|max:255',
            'products.*.description' => 'nullable|string',
            'products.*.price' => 'nullable|numeric',
            'products.*.image' => 'nullable|string',
        ]);

        $business->update(['products' => $validated['products']]);

        return $this->success($business, 'Products updated successfully');
    }

    public function updateServices(Request $request)
    {
        $business = Listing::forCurrentTenant()
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'services' => 'present|array',
            'services.*.name' => 'required|string|max:255',
            'services.*.description' => 'nullable|string',
            'services.*.price' => 'nullable|numeric',
        ]);

        $business->update(['services' => $validated['services']]);

        return $this->success($business, 'Services updated successfully');
    }
}
