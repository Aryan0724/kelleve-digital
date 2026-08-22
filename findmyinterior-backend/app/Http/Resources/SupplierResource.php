<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    use \App\Http\Resources\Traits\HasContactPrivacy;

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
            'phone'         => $this->when(
                $this->shouldShowContact($request),
                $this->phone
            ),
            'email'         => $this->when(
                $this->shouldShowContact($request),
                $this->email
            ),
            'website'       => $this->website,
            'products'      => SupplierProductResource::collection($this->whenLoaded('activeProducts')),
            'reviews'       => ReviewResource::collection($this->whenLoaded('approvedReviews')),
        ];
    }
}
