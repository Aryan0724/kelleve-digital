<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Category;
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

    /**
     * Maps professional_type strings to category names.
     * Returns the resolved category_id or null if not found.
     */
    private static function resolveCategoryFromProfessionalType(string $type): ?int
    {
        $typeMap = [
            // Salons & Beauty
            'hair_salon'         => 'Salons & Beauty',
            'beauty_salon'       => 'Salons & Beauty',
            'unisex_salon'       => 'Salons & Beauty',
            'spa'                => 'Salons & Beauty',
            'makeup_artist'      => 'Salons & Beauty',
            'nail_studio'        => 'Salons & Beauty',
            'barber'             => 'Salons & Beauty',
            'mehndi_artist'      => 'Salons & Beauty',
            'salon'              => 'Salons & Beauty',
            'beauty'             => 'Salons & Beauty',
            // Gyms & Fitness
            'gym'                => 'Gyms & Fitness',
            'fitness'            => 'Gyms & Fitness',
            'crossfit'           => 'Gyms & Fitness',
            'yoga_studio'        => 'Gyms & Fitness',
            'yoga'               => 'Gyms & Fitness',
            'zumba'              => 'Gyms & Fitness',
            'pilates'            => 'Gyms & Fitness',
            'martial_arts'       => 'Gyms & Fitness',
            'personal_trainer'   => 'Gyms & Fitness',
            // Restaurants & Cafes
            'restaurant'         => 'Restaurants & Cafes',
            'cafe'               => 'Restaurants & Cafes',
            'dhaba'              => 'Restaurants & Cafes',
            'food_truck'         => 'Restaurants & Cafes',
            'catering'           => 'Restaurants & Cafes',
            'cloud_kitchen'      => 'Restaurants & Cafes',
            'bakery'             => 'Restaurants & Cafes',
            'sweet_shop'         => 'Restaurants & Cafes',
            'juice_bar'          => 'Restaurants & Cafes',
            // Hospitals & Healthcare
            'clinic'             => 'Hospitals & Healthcare',
            'hospital'           => 'Hospitals & Healthcare',
            'doctor'             => 'Hospitals & Healthcare',
            'dentist'            => 'Hospitals & Healthcare',
            'physiotherapist'    => 'Hospitals & Healthcare',
            'optician'           => 'Hospitals & Healthcare',
            'pharmacy'           => 'Hospitals & Healthcare',
            'nursing_home'       => 'Hospitals & Healthcare',
            'diagnostic_center'  => 'Hospitals & Healthcare',
            // Interior Designers (ONLY actual interior types)
            'interior_designer'  => 'Interior Designers',
            'architect'          => 'Interior Designers',
            'vastu_consultant'   => 'Interior Designers',
            'modular_kitchen'    => 'Interior Designers',
            'furniture'          => 'Interior Designers',
            // Education & Coaching
            'coaching_center'    => 'Education & Coaching',
            'tutor'              => 'Education & Coaching',
            'school'             => 'Education & Coaching',
            'college'            => 'Education & Coaching',
            'music_school'       => 'Education & Coaching',
            'dance_academy'      => 'Education & Coaching',
            'language_institute' => 'Education & Coaching',
            // Hotels & Hospitality
            'hotel'              => 'Hotels & Hospitality',
            'resort'             => 'Hotels & Hospitality',
            'guest_house'        => 'Hotels & Hospitality',
            'pg'                 => 'Hotels & Hospitality',
            'hostel'             => 'Hotels & Hospitality',
            // Automobile
            'car_service'        => 'Automobile',
            'car_dealer'         => 'Automobile',
            'bike_service'       => 'Automobile',
            'driving_school'     => 'Automobile',
            'auto_accessories'   => 'Automobile',
            // Home Services
            'plumber'            => 'Home Services',
            'electrician'        => 'Home Services',
            'carpenter'          => 'Home Services',
            'painter'            => 'Home Services',
            'ac_repair'          => 'Home Services',
            'pest_control'       => 'Home Services',
            'cleaning'           => 'Home Services',
            // Real Estate
            'real_estate_agent'  => 'Real Estate & Property',
            'property_dealer'    => 'Real Estate & Property',
            'builder'            => 'Real Estate & Property',
        ];

        $normalized = strtolower(trim($type));
        $categoryName = $typeMap[$normalized] ?? null;

        if (!$categoryName) {
            return null; // Unknown type — let caller decide fallback
        }

        // Try exact name match first, then LIKE
        $cat = Category::where('name', $categoryName)->first()
            ?? Category::where('name', 'like', "%{$categoryName}%")->first();

        return $cat?->id;
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

        // Resolve category from professional_type BEFORE falling back to first category
        if (!isset($data['category_id']) || empty($data['category_id'])) {
            $profType = $data['professional_type'] ?? Auth::user()->professional_type ?? null;
            $resolvedCategoryId = $profType ? self::resolveCategoryFromProfessionalType($profType) : null;
            $data['category_id'] = $resolvedCategoryId ?? (Category::where('name', 'Interior Designers')->first()->id ?? 1);
        }

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

            // Resolve category from professional_type using comprehensive mapping
            if (empty($validated['category_id'])) {
                $resolvedId = self::resolveCategoryFromProfessionalType($validated['professional_type']);
                if ($resolvedId) {
                    $validated['category_id'] = $resolvedId;
                }
            }
            unset($validated['professional_type']);
        }

        $galleryData = $validated['gallery'] ?? null;
        unset($validated['gallery']);

        $business->update($validated);

        if (is_array($galleryData)) {
            $business->gallery()->delete();
            foreach ($galleryData as $index => $imgUrl) {
                if (!empty($imgUrl)) {
                    $business->gallery()->create([
                        'image_url' => $imgUrl,
                        'caption' => null,
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
