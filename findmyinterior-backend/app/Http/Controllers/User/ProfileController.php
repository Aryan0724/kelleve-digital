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
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $user = $request->user();
        $file = $request->file('avatar');

        // Convert to base64 data URI — stored directly in DB, no filesystem needed.
        // Works on Render, Vercel, any ephemeral host.
        $dataUri = \App\Helpers\ImageHelper::toBase64($file, 600, 82);

        $user->update(['avatar' => $dataUri]);

        app(TrustScoreService::class)->recalculateForUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated.',
            'avatar'  => $dataUri,
        ]);
    }

    /**
     * PUT /api/v1/user/profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'   => ['sometimes', 'required', 'string', 'max:255'],
            'phone'  => ['sometimes', 'nullable', 'string', 'max:20'],
            'avatar' => ['sometimes', 'nullable', 'url'],
        ]);

        $user->update($data);

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
        $currentCount = Listing::where('user_id', $user->id)->where('status', 'active')->count();

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
            'description'      => ['required', 'string'],
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

        $listing = Listing::create([
            ...$data,
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
        $listing = Listing::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'title'            => ['sometimes', 'string', 'max:255'],
            'tagline'          => ['sometimes', 'nullable', 'string', 'max:255'],
            'description'      => ['sometimes', 'string'],
            'cover_image'      => ['sometimes', 'nullable', 'url'],
            'phone'            => ['sometimes', 'string', 'max:20'],
            'whatsapp'         => ['sometimes', 'nullable', 'string', 'max:20'],
            'email'            => ['sometimes', 'nullable', 'email'],
            'website'          => ['sometimes', 'nullable', 'url'],
            'city'             => ['sometimes', 'string', 'max:100'],
            'district'         => ['sometimes', 'string', 'max:100'],
            'address'          => ['sometimes', 'nullable', 'string'],
            'years_experience' => ['sometimes', 'nullable', 'integer'],
            'team_size'        => ['sometimes', 'nullable', 'integer'],
            'gst_number'       => ['sometimes', 'nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i'],
            'pan_number'       => ['sometimes', 'nullable', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i'],
        ]);

        $listing->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Listing updated.',
            'data'    => new ListingResource($listing->fresh()->load('category', 'gallery')),
        ]);
    }

    /**
     * POST /api/v1/user/listings/{id}/gallery
     * Adds gallery images (S3 URLs from frontend upload).
     */
    public function addGalleryImages(Request $request, int $id): JsonResponse
    {
        $listing = Listing::where('user_id', $request->user()->id)->findOrFail($id);

        // Check gallery image limit
        $maxImages = $request->user()->activeSubscription?->plan?->max_gallery_images ?? 5;
        $currentCount = ListingGallery::where('listing_id', $listing->id)->count();

        $request->validate([
            'images'      => ['required', 'array', 'max:' . ($maxImages - $currentCount)],
            'images.*.data'     => ['required', 'string'],
            'images.*.caption' => ['nullable', 'string', 'max:255'],
        ]);

        foreach ($request->images as $index => $image) {
            // Check if it's base64 or just a plain url
            $imageUrl = $image['data'];
            if (preg_match('/^data:image\/(\w+);base64,/', $imageUrl)) {
                // We're just saving the base64 string directly in the database as image_url for now, or we could decode and upload
            }

            ListingGallery::create([
                'listing_id' => $listing->id,
                'image_url'  => $imageUrl,
                'caption'    => $image['caption'] ?? null,
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
     * DELETE /api/v1/user/listings/{id}/gallery/{imageId}
     */
    public function deleteGalleryImage(Request $request, int $id, int $imageId): JsonResponse
    {
        $listing = Listing::where('user_id', $request->user()->id)->findOrFail($id);
        $image = ListingGallery::where('listing_id', $listing->id)->findOrFail($imageId);
        $image->delete();

        return response()->json(['success' => true, 'message' => 'Image removed.']);
    }
}
