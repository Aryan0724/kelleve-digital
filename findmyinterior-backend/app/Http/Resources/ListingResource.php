<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'tagline'          => $this->tagline,
            'description'      => $this->description,
            'cover_image'      => $this->cover_image,
            'category'         => new CategoryResource($this->whenLoaded('category')),
            'city'             => $this->city,
            'district'         => $this->district,
            'state'            => $this->state,
            'address'          => $this->address,
            'years_experience' => $this->years_experience,
            'team_size'        => $this->team_size,
            'avg_rating'       => (float) $this->avg_rating,
            'review_count'     => $this->review_count,
            'is_verified'      => (bool) $this->is_verified,
            'is_featured'      => (bool) $this->is_featured,
            'is_premium'       => (bool) $this->is_premium,
            'is_sponsored'     => $this->sponsored_until && $this->sponsored_until->isFuture(),
            'is_top_rated'     => $this->avg_rating >= 4.5 && $this->review_count >= 5,
            'status'           => $this->status,
            'views_count'      => $this->views_count,
            'trust_score'      => $this->whenLoaded('user', fn() => $this->user->trust_score),
            'profile_completion_score' => $this->whenLoaded('user', fn() => $this->user->profile_completion_score),
            'verification_level' => $this->whenLoaded('user', fn() => $this->user->verification_level),
            'phone_clicks'     => $this->when($this->isOwner($request), $this->phone_clicks),
            'whatsapp_clicks'  => $this->when($this->isOwner($request), $this->whatsapp_clicks),
            'website_clicks'   => $this->when($this->isOwner($request), $this->website_clicks),
            // Contact — only expose if user has premium or it's the owner
            'phone'            => $this->when(
                $this->shouldShowContact($request),
                $this->phone
            ),
            'whatsapp'         => $this->when(
                $this->shouldShowContact($request),
                $this->whatsapp
            ),
            'email'            => $this->when(
                $this->shouldShowContact($request),
                $this->email
            ),
            'website'          => $this->website,
            'gallery'          => ListingGalleryResource::collection($this->whenLoaded('gallery')),
            'reviews'          => ReviewResource::collection($this->whenLoaded('approvedReviews')),
            'created_at'       => $this->created_at?->toDateString(),
        ];
    }

    private function shouldShowContact(Request $request): bool
    {
        $user = $request->user();
        if (!$user) return false;
        // Owner always sees contact
        if ($user->id === $this->user_id) return true;
        // Admin always sees
        if ($user->isAdmin()) return true;
        // Premium subscriber sees
        return $user->hasPremiumSubscription();
    }

    private function isOwner(Request $request): bool
    {
        $user = $request->user();
        return $user && $user->id === $this->user_id;
    }
}
