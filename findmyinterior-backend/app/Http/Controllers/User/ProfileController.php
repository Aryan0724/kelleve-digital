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

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            ]);
            $file = $request->file('avatar');
            $url = \App\Helpers\ImageHelper::toStoragePath($file, 'avatars');
        } elseif ($request->filled('avatar')) {
            $url = $request->input('avatar');
        } else {
            return response()->json(['success' => false, 'message' => 'No avatar image provided.'], 422);
        }

        $fullUrl = \Illuminate\Support\Str::startsWith($url, 'http') ? $url : url($url);
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
            'avatar'   => ['sometimes', 'nullable', 'string'],
            'city'     => ['sometimes', 'nullable', 'string', 'max:255'],
            'district' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address'  => ['sometimes', 'nullable', 'string', 'max:1000'],
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
            
            // Keep Listing title & slug in sync if user changes their name
            if (isset($userFields['name']) && !empty($userFields['name'])) {
                $listing = Listing::where('user_id', $user->id)->first();
                if ($listing) {
                    $listing->update([
                        'title' => $userFields['name'],
                        'slug'  => \Illuminate\Support\Str::slug($userFields['name']) . '-' . \Illuminate\Support\Str::random(6),
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

        // Check plan listing limit
        $activePlan = $user->activeSubscription?->plan;
        $maxListings = $activePlan?->max_listings ?? 1;
        $currentCount = Listing::where('user_id', $user->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->where('status', 'active')->count();

        if ($currentCount >= $maxListings) {
            return response()->json([
                'success' => false,
                'message' => "Your plan allows a maximum of {$maxListings} active listing(s). Please upgrade to add more.",
            ], 403);
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

        $plan = $user->activeSubscription?->plan;
        if (!$plan || !$plan->can_add_website) {
            unset($data['website']);
        }
        if (!$plan || !$plan->can_add_whatsapp) {
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
        ]);

        $plan = $request->user()->activeSubscription?->plan;
        if (!$plan || !$plan->can_add_website) {
            unset($data['website']);
            $data['website'] = null; // force null if they previously had it but downgraded
        }
        if (!$plan || !$plan->can_add_whatsapp) {
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
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->findOrFail($id);

        $request->validate([
            'cover_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $file = $request->file('cover_image');

        // Convert to base64 data URI — stored directly in DB, no filesystem needed.
        $dataUri = \App\Helpers\ImageHelper::toBase64($file, 1200, 82);

        $listing->update(['cover_image' => $dataUri]);
        
        $request->user()->update(['cover_image' => $dataUri]);

        return response()->json([
            'success' => true,
            'message' => 'Cover image updated.',
            'cover_image' => $dataUri,
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

        // Check gallery image limit (default 50 images per gallery)
        $maxImages = $request->user()->role === 'admin' ? 100 : ($request->user()->activeSubscription?->plan?->max_gallery_images ?? 50);
        $currentCount = ListingGallery::where('listing_id', $listing->id)->count();
        $allowed = max(1, $maxImages - $currentCount);

        if ($allowed <= 0) {
            return response()->json([
                'success' => false,
                'message' => "You have reached your gallery limit ($maxImages). Please upgrade your plan."
            ], 403);
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
