<?php

namespace App\Modules\Truedial\Services;

use App\Models\Listing;
use App\Modules\Truedial\DTOs\BusinessProfileDTO;
use App\Http\Resources\Truedial\ProductResource;
use App\Http\Resources\Truedial\ServiceResource;
use App\Http\Resources\Truedial\MediaResource;

class BusinessProfileAssembler
{
    public function assemble(Listing $business): BusinessProfileDTO
    {
        $basicInfo = [
            'id' => $business->id,
            'slug' => $business->slug,
            'title' => $business->title,
            'description' => $business->description,
            'address' => $business->address,
            'city_id' => $business->city_id,
            'state' => $business->state,
            'category' => $business->category ? $business->category->name : null,
            'verified' => $business->is_verified,
            'created_at' => $business->created_at?->toIso8601String(),
            'whatsapp' => $business->whatsapp,
            'phone' => $business->phone,
            'website' => $business->website,
        ];

        // Action Buttons mapped dynamically
        $actions = [];
        
        if (!empty($business->phone)) {
            $actions[] = [
                'type' => 'call',
                'label' => 'Call Now',
                'icon' => 'Phone',
                'url' => 'tel:' . $business->phone,
                'priority' => 'primary'
            ];
        }

        if (!empty($business->whatsapp)) {
            $actions[] = [
                'type' => 'whatsapp',
                'label' => 'WhatsApp',
                'icon' => 'MessageCircle',
                'url' => 'https://wa.me/' . preg_replace('/[^0-9]/', '', $business->whatsapp),
                'priority' => 'secondary'
            ];
        }
        
        if (!empty($business->website)) {
            $actions[] = [
                'type' => 'website',
                'label' => 'Visit Website',
                'icon' => 'Globe',
                'url' => $business->website,
                'priority' => 'outline'
            ];
        }

        $actions[] = [
            'type' => 'direction',
            'label' => 'Directions',
            'icon' => 'MapPin',
            'url' => 'https://maps.google.com/?q=' . urlencode($business->address),
            'priority' => 'outline'
        ];

        $metrics = [
            'rating' => $business->rating ?? 0,
            'reviews_count' => $business->reviews_count ?? 0,
        ];

        $catalog = [
            'products' => ProductResource::collection($business->listingProducts)->resolve(),
            'services' => ServiceResource::collection($business->listingServices)->resolve(),
        ];

        $media = MediaResource::collection($business->media)->resolve();

        return new BusinessProfileDTO([
            'basicInfo' => $basicInfo,
            'actions' => $actions,
            'metrics' => $metrics,
            'catalog' => $catalog,
            'media' => $media,
        ]);
    }
}
