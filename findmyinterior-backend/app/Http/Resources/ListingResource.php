<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    use \App\Http\Resources\Traits\HasContactPrivacy;

    public function toArray(Request $request): array
    {
        $ownerUser = $this->relationLoaded('user') ? $this->user : null;
        $ownerPlan = $ownerUser ? $ownerUser->activeSubscription?->plan : null;
        
        $canHaveWebsite = $ownerPlan?->can_add_website ?? false;
        $canHaveWhatsapp = $ownerPlan?->can_add_whatsapp ?? false;

        $formatUrl = function($img) {
            if (empty($img)) return null;
            if (\Illuminate\Support\Str::startsWith($img, 'data:')) {
                return $img;
            }
            if (\Illuminate\Support\Str::startsWith($img, 'http://findmyinterior.com')) {
                $img = str_replace('http://', 'https://', $img);
            }
            if (\Illuminate\Support\Str::startsWith($img, 'http://') || \Illuminate\Support\Str::startsWith($img, 'https://')) {
                return $img;
            }
            $url = url($img);
            if (config('app.env') === 'production' || str_contains($url, 'findmyinterior.com') || str_contains($url, 'localhost')) {
                return 'https://findmyinterior.com' . $img;
            }
            return $url;
        };

        $coverImage = $formatUrl($this->cover_image ?: $ownerUser?->cover_image);
        $avatarImage = $formatUrl($ownerUser?->avatar);

        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'tagline'          => $this->tagline,
            'description'      => $this->description,
            'cover_image'      => $coverImage,
            'category'         => new CategoryResource($this->whenLoaded('category')),
            'city'             => $this->city,
            'district'         => $this->district,
            'state'            => $this->state,
            'address'          => $this->address,
            'years_experience' => $this->years_experience,
            'team_size'        => $this->team_size,
            'gst_number'       => $this->gst_number,
            'pan_number'       => $this->pan_number,
            'avg_rating'       => (float) $this->avg_rating,
            'review_count'     => $this->review_count,
            'is_verified'      => (bool) $this->is_verified,
            'is_featured'      => (bool) $this->is_featured,
            'is_premium'       => (bool) $this->is_premium,
            'is_gold_verified' => (bool) ($ownerPlan?->is_gold_verified ?? false),
            'is_sponsored'     => $this->sponsored_until && $this->sponsored_until->isFuture(),
            'is_top_rated'     => $this->avg_rating >= 4.5 && $this->review_count >= 5,
            'status'           => $this->status,
            'views_count'      => $this->views_count,
            'trust_score'      => $this->trust_score ?? $ownerUser?->trust_score ?? 0,
            'profile_completion_score' => $this->profile_completion_score ?? $ownerUser?->profile_completion_score ?? 0,
            'verification_level' => $this->verification_level ?? $ownerUser?->verification_level ?? 'unverified',
            'user'             => $ownerUser ? [
                'id'          => $ownerUser->id,
                'name'        => $ownerUser->name,
                'avatar'      => $avatarImage,
                'cover_image' => $coverImage,
                'role'        => $ownerUser->role ?? null,
            ] : null,
            'phone_clicks'     => $this->when($this->isOwner($request), $this->phone_clicks),
            'whatsapp_clicks'  => $this->when($this->isOwner($request), $this->whatsapp_clicks),
            'website_clicks'   => $this->when($this->isOwner($request), $this->website_clicks),
            // Contact — only expose if user has premium or it's the owner
            'phone'            => $this->when(
                $this->shouldShowContact($request),
                $this->phone
            ),
            'whatsapp'         => $this->when(
                $canHaveWhatsapp && $this->shouldShowContact($request),
                $this->whatsapp
            ),
            'email'            => $this->when(
                $this->shouldShowContact($request),
                $this->email
            ),
            'website'          => $canHaveWebsite ? $this->website : null,
            'gallery'          => ListingGalleryResource::collection($this->whenLoaded('gallery')),
            'gallery_count'    => $this->gallery_count ?? 0,
            'services'         => $this->services ?? [],
            'products'         => $this->products ?? [],
            'achievements'     => $this->achievements ?? [],
            'languages'        => $this->languages ?? [],
            'social_links'     => $this->social_links ?? [],
            'availability'     => $this->availability,
            'response_time'    => $this->response_time,
            'reviews'          => ReviewResource::collection($this->whenLoaded('approvedReviews')),
            'created_at'       => $this->created_at?->toDateString(),
        ];
    }

    // Contact methods shouldShowContact and isOwner have been moved to HasContactPrivacy trait
}
