<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\ListingProduct;
use App\Models\ListingService;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    use ApiResponse;

    public function myBusiness(Request $request)
    {
        $business = Listing::where('user_id', $request->user()->id)
            ->with(['category', 'gallery', 'offers', 'listingProducts', 'listingServices', 'media'])
            ->first();

        if (!$business) {
            return $this->success(null);
        }

        return $this->success($business);
    }

    public function store(Request $request)
    {
        $existing = Listing::where('user_id', $request->user()->id)->first();
        if ($existing) {
            return $this->error('You already have a registered business listing', 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'tagline' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'availability' => 'nullable|string',
            'social_links' => 'nullable|array',
            'services' => 'nullable|array',
            'products' => 'nullable|array',
            'professional_type' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();
        $validated['status'] = 'active';

        if (isset($validated['professional_type'])) {
            $request->user()->update(['professional_type' => $validated['professional_type']]);
            unset($validated['professional_type']);
        }

        $business = Listing::create($validated);

        return $this->success($business, 'Business profile created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $business = Listing::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'tagline' => 'nullable|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'availability' => 'nullable|string',
            'social_links' => 'nullable|array',
            'services' => 'nullable|array',
            'products' => 'nullable|array',
            'professional_type' => 'nullable|string',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $business->title) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();
        }

        if (isset($validated['professional_type'])) {
            $request->user()->update(['professional_type' => $validated['professional_type']]);
            unset($validated['professional_type']);
        }

        $business->update($validated);

        return $this->success($business, 'Business profile updated successfully');
    }

    public function updateProducts(Request $request)
    {
        $business = Listing::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'products' => 'present|array',
            'products.*.id' => 'nullable',
            'products.*.name' => 'required|string|max:255',
            'products.*.description' => 'nullable|string',
            'products.*.price' => 'nullable|numeric',
        ]);

        // Clear existing and re-sync
        ListingProduct::where('listing_id', $business->id)->delete();

        foreach ($validated['products'] as $p) {
            ListingProduct::create([
                'listing_id' => $business->id,
                'name' => $p['name'],
                'description' => $p['description'] ?? null,
                'price' => $p['price'] ?? null,
                'is_active' => true
            ]);
        }

        $business->load('listingProducts');
        return $this->success($business->listingProducts, 'Products updated successfully');
    }

    public function updateServices(Request $request)
    {
        $business = Listing::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'services' => 'present|array',
            'services.*.id' => 'nullable',
            'services.*.name' => 'required|string|max:255',
            'services.*.description' => 'nullable|string',
            'services.*.price_from' => 'nullable|numeric',
            'services.*.price_to' => 'nullable|numeric',
        ]);

        // Clear existing and re-sync
        ListingService::where('listing_id', $business->id)->delete();

        foreach ($validated['services'] as $s) {
            ListingService::create([
                'listing_id' => $business->id,
                'name' => $s['name'],
                'description' => $s['description'] ?? null,
                'price_from' => $s['price_from'] ?? ($s['price'] ?? null),
                'price_to' => $s['price_to'] ?? null,
                'is_active' => true
            ]);
        }

        $business->load('listingServices');
        return $this->success($business->listingServices, 'Services updated successfully');
    }
}
