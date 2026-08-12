<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'name'                     => $this->name,
            'slug'                     => $this->slug,
            'target_role_category'     => $this->target_role_category,
            'price_monthly'            => $this->price_monthly,
            'price_yearly'             => $this->price_yearly,
            'features'                 => $this->features,
            'max_listings'             => $this->max_listings,
            'max_gallery_images'       => $this->max_gallery_images,
            'can_see_all_leads'        => $this->can_see_all_leads,
            'is_featured_listing'      => $this->is_featured_listing,
        ];
    }
}
