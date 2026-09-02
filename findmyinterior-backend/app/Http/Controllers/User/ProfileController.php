<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Http\Resources\UserResource;
use App\Models\Listing;
use App\Models\ListingGallery;
use App\Services\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * GET /api/v1/user/profile
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new UserResource($request->user()->load('activeSubscription.plan')),
        ]);
    }

    /**
     * POST /api/v1/user/avatar
     * Upload and store a profile picture.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $storage = app(\App\Services\UnifiedStorageService::class);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            ]);
            $url = $storage->storeFile($request->file('avatar'), 'avatars');
        } elseif ($request->filled('avatar')) {
            $base64 = $request->input('avatar');
            if (\Illuminate\Support\Str::startsWith($base64, 'data:image')) {
                $url = $storage->storeBase64($base64, 'avatars');
            } else {
                $url = $base64;
            }
        } else {
            return response()->json(['success' => false, 'message' => 'No avatar image provided.'], 422);
        }

        $fullUrl = \Illuminate\Support\Str::startsWith($url, 'http') ? $url : url($url);
        if (config('app.env') === 'production' || str_contains($fullUrl, 'findmyinterior.com') || str_contains($fullUrl, 'localhost')) {
            if (\Illuminate\Support\Str::startsWith($url, '/')) {
                $fullUrl = 'https://findmyinterior.com' . $url;
            }
        }
        $user->update(['avatar' => $url]);

        $listing = \App\Models\Listing::withoutGlobalScopes()->where('user_id', $user->id)->first();
        if ($listing) {
            $listing->touch();
        }

        app(TrustScoreService::class)->recalculateForUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated.',
            'avatar'  => $fullUrl,
            'data'    => new UserResource($user->fresh()),
        ]);
    }

    /**
     * POST /api/v1/user/cover
     * Upload and store a cover picture for the user.
     */
    public function uploadCover(Request $request): JsonResponse
    {
        $user = $request->user();
        $file = $request->file('cover_image') ?? $request->file('cover');

        if ($file) {
            $request->validate([
                'cover_image' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
                'cover'       => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            ]);
            $url = \App\Helpers\ImageHelper::toStoragePath($file, 'covers');
        } elseif ($request->filled('cover_image') || $request->filled('cover')) {
            $url = $request->input('cover_image') ?? $request->input('cover');
        } else {
            return response()->json(['success' => false, 'message' => 'No cover image file provided.'], 422);
        }

        $fullUrl = \Illuminate\Support\Str::startsWith($url, 'http') ? $url : url($url);
        if (config('app.env') === 'production' || str_contains($fullUrl, 'findmyinterior.com') || str_contains($fullUrl, 'localhost')) {
            if (\Illuminate\Support\Str::startsWith($url, '/')) {
                $fullUrl = 'https://findmyinterior.com' . $url;
            }
        }
        $user->update(['cover_image' => $url]);

        $listing = \App\Models\Listing::withoutGlobalScopes()->where('user_id', $user->id)->first();
        if ($listing) {
            $listing->update(['cover_image' => $url]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cover image updated.',
            'cover_image' => $fullUrl,
            'data'        => new UserResource($user->fresh()),
        ]);
    }

    /**
     * PUT /api/v1/user/profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'     => ['sometimes', 'required', 'string', 'max:255'],
            'phone'    => ['sometimes', 'nullable', 'string', 'max:20'],
            'city'     => ['sometimes', 'nullable', 'string', 'max:100'],
            'district' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address'  => ['sometimes', 'nullable', 'string'],
            'avatar'   => ['sometimes', 'nullable', 'string'],
        ]);

        // If user has a listing, update city/district/address there too
        if (isset($data['city']) || isset($data['district']) || isset($data['address'])) {
            $listing = Listing::where('user_id', $user->id)
                ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
                ->first();
            if ($listing) {
                $listing->update(array_filter([
                    'city'     => $data['city'] ?? null,
                    'district' => $data['district'] ?? null,
                    'address'  => $data['address'] ?? null,
                ]));
            }
        }

        // Only update user-level fields
        $userFields = array_intersect_key($data, array_flip(['name', 'phone', 'avatar', 'city', 'district', 'address']));
        if (!empty($userFields)) {
            $user->update($userFields);
            
            // Keep Listing title in sync if user changes their name, but preserve existing slug!
            if (isset($userFields['name']) && !empty($userFields['name'])) {
                $listing = Listing::where('user_id', $user->id)->first();
                if ($listing) {
                    $listing->update([
                        'title' => $userFields['name'],
                        'slug'  => $listing->slug ?: (\Illuminate\Support\Str::slug($userFields['name']) . '-' . \Illuminate\Support\Str::random(6)),
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated.',
            'data'    => new UserResource($user->fresh()),
        ]);
    }

    /**
     * PUT /api/v1/user/change-password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed. Please login again.',
        ]);
    }

    // ─── Listing Management ───────────────────────────────────────────────────

    /**
     * GET /api/v1/user/listings
     */
    public function listings(Request $request): JsonResponse
    {
        $listings = Listing::where('user_id', $request->user()->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->with(['category', 'gallery'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => ListingResource::collection($listings),
        ]);
    }

    /**
     * POST /api/v1/user/listings
     */
    public function createListing(Request $request): JsonResponse
    {
        $user = $request->user();

        $entitlement = app(\App\Services\EntitlementService::class);
        $maxListings = $entitlement->getLimit($user, 'max_listings');
        $currentCount = Listing::where('user_id', $user->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->where('status', 'active')->count();

        if ($currentCount >= $maxListings) {
            return $entitlement->generateErrorResponse('max_listings', $maxListings, $currentCount, "Your plan allows a maximum of {$maxListings} active listing(s).");
        }

        $data = $request->validate([
            'category_id'      => ['required', 'exists:categories,id'],
            'title'            => ['required', 'string', 'max:255'],
            'tagline'          => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'cover_image'      => ['nullable', 'url'],
            'phone'            => ['required', 'string', 'max:20'],
            'whatsapp'         => ['nullable', 'string', 'max:20'],
            'email'            => ['nullable', 'email'],
            'website'          => ['nullable', 'url'],
            'city'             => ['required', 'string', 'max:100'],
            'district'         => ['required', 'string', 'max:100'],
            'address'          => ['nullable', 'string'],
            'years_experience' => ['nullable', 'integer', 'min:0'],
            'team_size'        => ['nullable', 'integer', 'min:1'],
            'gst_number'       => ['nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i'],
            'pan_number'       => ['nullable', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i'],
        ]);

        $entitlement = app(\App\Services\EntitlementService::class);
        if (!$entitlement->hasFeature($user, 'can_add_website')) {
            unset($data['website']);
        }
        if (!$entitlement->hasFeature($user, 'can_add_whatsapp')) {
            unset($data['whatsapp']);
        }

        $listing = Listing::create([
            ...$data,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId(),
            'user_id' => $user->id,
            'slug'    => Str::slug($data['title']) . '-' . Str::random(6),
            'state'   => 'Bihar',
            'status'  => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Listing created and is live.',
            'data'    => new ListingResource($listing->load('category')),
        ], 201);
    }

    /**
     * PUT /api/v1/user/listings/{id}
     */
    public function updateListing(Request $request, int $id): JsonResponse
    {
        $listing = Listing::where('user_id', $request->user()->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->findOrFail($id);

        $data = $request->validate([
            'title'            => ['sometimes', 'nullable', 'string', 'max:255'],
            'tagline'          => ['sometimes', 'nullable', 'string', 'max:255'],
            'description'      => ['sometimes', 'nullable', 'string'],
            'cover_image'      => ['sometimes', 'nullable', 'url'],
            'phone'            => ['sometimes', 'nullable', 'string', 'max:20'],
            'whatsapp'         => ['sometimes', 'nullable', 'string', 'max:20'],
            'email'            => ['sometimes', 'nullable', 'email'],
            'website'          => ['sometimes', 'nullable', 'url'],
            'city'             => ['sometimes', 'nullable', 'string', 'max:100'],
            'district'         => ['sometimes', 'nullable', 'string', 'max:100'],
            'address'          => ['sometimes', 'nullable', 'string'],
            'years_experience' => ['sometimes', 'nullable', 'integer'],
            'team_size'        => ['sometimes', 'nullable', 'integer'],
            'gst_number'       => ['sometimes', 'nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i'],
            'pan_number'       => ['sometimes', 'nullable', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i'],
            'custom_slug'      => ['sometimes', 'nullable', 'string', 'min:3', 'max:60', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/i'],
        ]);

        $user = $request->user();
        $plan = $user->activeSubscription?->plan;
        $isProOrElite = $user->isAdmin() || in_array($plan?->slug, ['probusiness', 'elitebusiness']);

        if (!empty($data['custom_slug'])) {
            if (!$isProOrElite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Custom Profile URLs are exclusively available for ProBusiness and EliteBusiness subscribers. Please upgrade your plan.',
                ], 403);
            }

            $sanitizedSlug = \Illuminate\Support\Str::slug($data['custom_slug']);
            // Check uniqueness
            $exists = Listing::where('slug', $sanitizedSlug)->where('id', '!=', $listing->id)->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => "The URL handle '{$sanitizedSlug}' is already claimed. Please pick another unique handle.",
                ], 422);
            }
            $data['slug'] = $sanitizedSlug;
            unset($data['custom_slug']);
        }

        $entitlement = app(\App\Services\EntitlementService::class);
        if (!$entitlement->hasFeature($user, 'can_add_website')) {
            unset($data['website']);
            $data['website'] = null; // force null if they previously had it but downgraded
        }
        if (!$entitlement->hasFeature($user, 'can_add_whatsapp')) {
            unset($data['whatsapp']);
            $data['whatsapp'] = null;
        }

        $listing->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Listing updated.',
            'data'    => new ListingResource($listing->fresh()->load('category', 'gallery')),
        ]);
    }

    /**
     * POST /api/v1/user/listings/{id}/cover
     * Upload and store a cover image for the listing.
     */
    public function uploadListingCover(Request $request, int $id): JsonResponse
    {
        $listing = Listing::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first()
            ?? Listing::where('user_id', $request->user()->id)->first();

        $request->validate([
            'cover_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $file = $request->file('cover_image');

        $url = app(\App\Services\UnifiedStorageService::class)->storeFile($file, 'covers');

        if ($listing) {
            $listing->update(['cover_image' => $url]);
        }
        
        $request->user()->update(['cover_image' => $url]);
        \App\Models\Supplier::where('user_id', $request->user()->id)->update(['cover_image' => $url]);
        \App\Models\Builder::where('user_id', $request->user()->id)->update(['cover_image' => $url]);

        return response()->json([
            'success' => true,
            'message' => 'Cover image updated.',
            'cover_image' => $url,
        ]);
    }

    /**
     * POST /api/v1/user/listings/{id}/gallery
     * Adds gallery images (S3 URLs from frontend upload).
     */
    public function addGalleryImages(Request $request, int $id): JsonResponse
    {
        $tenantId = null;
        try {
            $tenantId = app(\App\Core\Tenancy\TenantContext::class)->getTenantId();
        } catch (\Throwable $e) {}

        // Allow matching by provided listing ID or fallback to user's first listing
        $listing = Listing::where('id', $id)
            ->where(function ($q) use ($request) {
                if ($request->user()->role !== 'admin') {
                    $q->where('user_id', $request->user()->id);
                }
            })
            ->first()
            ?? Listing::where('user_id', $request->user()->id)->first();

        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Listing profile not found.'], 404);
        }

        // Check gallery image limit based on active subscription plan
        $entitlement = app(\App\Services\EntitlementService::class);
        $maxImages = $entitlement->getLimit($request->user(), 'max_gallery_images');
        $currentCount = ListingGallery::where('listing_id', $listing->id)->count();
        $allowed = max(0, $maxImages - $currentCount);

        if ($allowed <= 0) {
            return $entitlement->generateErrorResponse('max_gallery_images', $maxImages, $currentCount, "You have reached your portfolio limit of {$maxImages} images.");
        }

        $request->validate([
            'images'      => ['required', 'array', 'max:' . $allowed],
            'images.*.data'     => ['required', 'string'],
            'images.*.caption' => ['nullable', 'string', 'max:255'],
            'images.*.type' => ['nullable', 'string', 'in:image,video'],
            'images.*.is_before_after' => ['nullable', 'boolean'],
        ]);

        foreach ($request->images as $index => $image) {
            $type = $image['type'] ?? 'image';
            $dataUrl = $image['data'];

            // If the frontend sends a raw Base64 string, convert it to an actual file to prevent DB bloat/crashes
            if ($type === 'image' && \Illuminate\Support\Str::startsWith($dataUrl, 'data:image')) {
                try {
                    $dataUrl = app(\App\Services\UnifiedStorageService::class)->storeBase64($dataUrl, 'gallery');
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Gallery Base64 upload failed: ' . $e->getMessage());
                    continue; // Skip this image if it's corrupt
                }
            }

            ListingGallery::create([
                'listing_id' => $listing->id,
                'type'       => $type,
                'image_url'  => $type === 'image' ? $dataUrl : null,
                'video_url'  => $type === 'video' ? $dataUrl : null,
                'caption'    => $image['caption'] ?? null,
                'is_before_after' => $image['is_before_after'] ?? false,
                'sort_order' => $currentCount + $index,
            ]);
        }

        app(TrustScoreService::class)->recalculateForUser($request->user());

        return response()->json([
            'success' => true,
            'message' => count($request->images) . ' image(s) added to gallery.',
        ]);
    }

    /**
     * PUT /api/v1/user/listings/{id}/gallery/{imageId}
     */
    public function updateGalleryImage(Request $request, int $id, int $imageId): JsonResponse
    {
        $request->validate([
            'caption' => 'nullable|string|max:255',
            'is_before_after' => 'nullable|boolean'
        ]);

        $listing = Listing::where('user_id', $request->user()->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->findOrFail($id);
        $image = ListingGallery::where('listing_id', $listing->id)->findOrFail($imageId);
        
        $image->caption = $request->caption;
        if ($request->has('is_before_after')) {
            $image->is_before_after = $request->is_before_after;
        }
        $image->save();

        return response()->json(['success' => true, 'message' => 'Image updated.']);
    }

    /**
     * DELETE /api/v1/user/listings/{id}/gallery/{imageId}
     */
    public function deleteGalleryImage(Request $request, int $id, int $imageId): JsonResponse
    {
        $listing = Listing::where('user_id', $request->user()->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->findOrFail($id);
        $image = ListingGallery::where('listing_id', $listing->id)->findOrFail($imageId);
        $image->delete();

        return response()->json(['success' => true, 'message' => 'Image removed.']);
    }
}
