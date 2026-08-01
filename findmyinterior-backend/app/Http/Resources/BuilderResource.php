<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuilderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'company_name'       => $this->company_name,
            'slug'               => $this->slug,
            'tagline'            => $this->tagline,
            'logo'               => $this->logo,
            'cover_image'        => $this->cover_image,
            'city'               => $this->city,
            'district'           => $this->district,
            'rera_number'        => $this->rera_number,
            'established_year'   => $this->established_year,
            'total_projects'     => $this->total_projects,
            'delivered_projects' => $this->delivered_projects,
            'avg_rating'         => (float) $this->avg_rating,
            'review_count'       => $this->review_count,
            'is_verified'        => $this->is_verified,
            'is_featured'        => $this->is_featured,
            'phone'              => $this->phone,
            'email'              => $this->when(
                $request->user()?->hasPremiumSubscription() || $request->user()?->isAdmin(),
                $this->email
            ),
            'website'            => $this->website,
            'projects'           => BuilderProjectResource::collection($this->whenLoaded('projects')),
            'possession_projects' => BuilderProjectResource::collection($this->whenLoaded('possessionProjects')),
            'reviews'            => ReviewResource::collection($this->whenLoaded('approvedReviews')),
            'created_at'         => $this->created_at?->toDateString(),
        ];
    }
}
