<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'company_name'  => $this->company_name,
            'slug'          => $this->slug,
            'tagline'       => $this->tagline,
            'logo'          => $this->logo,
            'cover_image'   => $this->cover_image,
            'city'          => $this->city,
            'district'      => $this->district,
            'business_type' => $this->business_type,
            'gst_number'    => $this->when($request->user()?->isAdmin(), $this->gst_number),
            'avg_rating'    => (float) $this->avg_rating,
            'review_count'  => $this->review_count,
            'is_verified'   => $this->is_verified,
            'is_featured'   => $this->is_featured,
            'phone'         => $this->phone,
            'email'         => $this->when(
                $request->user()?->hasPremiumSubscription() || $request->user()?->isAdmin(),
                $this->email
            ),
            'website'       => $this->website,
            'products'      => SupplierProductResource::collection($this->whenLoaded('activeProducts')),
            'reviews'       => ReviewResource::collection($this->whenLoaded('approvedReviews')),
        ];
    }
}
