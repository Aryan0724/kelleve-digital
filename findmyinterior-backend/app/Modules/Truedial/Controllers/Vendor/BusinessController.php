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
        $business = Listing::where('user_id', Auth::id())
            ->with(['category', 'city', 'gallery', 'listingProducts.media', 'listingServices.media'])
            ->first();

        if (!$business) {
            return $this->error('No business found', 404);
        }

        return $this->success($business);
    }

    public function store(Request $request)
    {
        $existing = Listing::where('user_id', Auth::id())->first();
        if ($existing) {
            return $this->update($request, $existing->id);
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
            'tagline' => 'nullable|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'address' => 'required|string',
            'city' => 'nullable|string|max:100',
            'district' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'website' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'years_experience' => 'nullable|integer',
            'gst_number' => 'nullable|string|max:50',
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
        $validated['status'] = 'active'; // Set active by default so it appears in search

        if (isset($validated['professional_type'])) {
            Auth::user()->update(['professional_type' => $validated['professional_type']]);
            unset($validated['professional_type']);
        }

        $business = Listing::create($validated);

        return $this->success($business, 'Business created successfully and is active', 201);
    }

    public function update(Request $request, $id)
    {
        $business = Listing::where('user_id', Auth::id())->where('id', $id)->first() 
                 ?? Listing::findOrFail($id);
        
        $this->authorize('update', $business);

        $validated = $request->validate([
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'city_id' => 'sometimes|nullable|exists:cities,id',
            'title' => 'sometimes|required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'address' => 'sometimes|required|string',
            'city' => 'nullable|string|max:100',
            'district' => 'sometimes|nullable|string|max:100',
            'state' => 'sometimes|nullable|string|max:100',
            'website' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'years_experience' => 'nullable|integer',
            'gst_number' => 'nullable|string|max:50',
            'availability' => 'nullable|string',
            'response_time' => 'nullable|string',
            'social_links' => 'nullable|array',
            'services' => 'nullable|array',
            'professional_type' => 'nullable|string',
            'gallery' => 'nullable|array',
            'gallery.*' => 'nullable|string',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $business->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . time();
        }

        // Map professional_type to category if present and category_id not explicitly set
        if (isset($validated['professional_type'])) {
            $business->user->update(['professional_type' => $validated['professional_type']]);
            
            // Try to resolve matching category if category_id not provided
            if (empty($validated['category_id'])) {
                $typeMap = [
                    'gym' => 'Gyms & Fitness',
                    'fitness' => 'Gyms & Fitness',
                    'restaurant' => 'Restaurants & Cafes',
                    'clinic' => 'Hospitals & Healthcare',
                    'hospital' => 'Hospitals & Healthcare',
                    'salon' => 'Salons & Beauty',
                    'interior_designer' => 'Interior Designers',
                ];
                $matchedName = $typeMap[strtolower($validated['professional_type'])] ?? null;
                if ($matchedName) {
                    $cat = \App\Models\Category::where('name', 'like', "%{$matchedName}%")->first();
                    if ($cat) {
                        $validated['category_id'] = $cat->id;
                    }
                }
            }
            unset($validated['professional_type']);
        }

        $galleryData = $validated['gallery'] ?? null;
        unset($validated['gallery']);

        $business->update($validated);

        if (is_array($galleryData)) {
            $business->media()->delete();
            foreach ($galleryData as $index => $imgUrl) {
                if (!empty($imgUrl)) {
                    $business->media()->create([
                        'url' => $imgUrl,
                        'is_cover' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        \Illuminate\Support\Facades\Cache::forget("business_profile_{$business->slug}");
        \Illuminate\Support\Facades\Cache::forget("business_profile_data_{$business->slug}");

        return $this->success($business->fresh(['category', 'city']), 'Business updated successfully');
    }

    public function updateProducts(Request $request, \App\Services\ProductService $productService)
    {
        $business = Listing::where('user_id', Auth::id())
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
        $business = Listing::where('user_id', Auth::id())
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
