<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'avatar'           => $this->avatar,
            'city'             => $this->city,
            'district'         => $this->district,
            'skill'            => $this->skill,
            'skills_tags'      => $this->skills_tags ?? [],
            'experience_years' => $this->experience_years,
            'daily_rate'       => $this->daily_rate,
            'daily_rate_formatted' => $this->daily_rate_formatted,
            'is_available'     => $this->is_available,
            'is_verified'      => $this->is_verified,
            'is_featured'      => $this->is_featured,
            'avg_rating'       => (float) $this->avg_rating,
            'review_count'     => $this->review_count,
            'bio'              => $this->bio,
            'phone'            => $this->when(
                $request->user()?->hasPremiumSubscription() || $request->user()?->isAdmin(),
                $this->phone
            ),
            'reviews'          => ReviewResource::collection($this->whenLoaded('approvedReviews')),
        ];
    }
}
