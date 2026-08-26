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
            'tagline' => $business->tagline,
            'description' => $business->description,
            'address' => $business->address,
            'city' => $business->city ?? ($business->cityRel?->name ?? null),
            'city_id' => $business->city_id,
            'district' => $business->district,
            'state' => $business->state,
            'category' => $business->category ? $business->category->name : null,
            'professional_type' => $business->user?->professional_type,
            'cover_image' => $business->cover_image,
            'verified' => $business->is_verified,
            'is_verified' => $business->is_verified,
            'is_premium' => $business->is_premium,
            'subscription_plan' => $business->subscription_plan,
            'created_at' => $business->created_at?->toIso8601String(),
            'user_id' => $business->user_id,
            'whatsapp' => $business->whatsapp,
            'phone' => $business->phone,
            'email' => $business->email ?? $business->user?->email,
            'website' => $business->website,
            'gallery' => MediaResource::collection($business->media)->resolve(),
            'services' => $business->services ?? [],
            'products' => $business->products ?? [],
            'social_links' => $business->social_links ?? [],
            'availability' => $business->availability,
            'response_time' => $business->response_time,
            'years_experience' => $business->years_experience,
            'gst_number' => $business->gst_number,
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
            'rating' => $business->avg_rating ?? 0,
            'reviews_count' => $business->review_count ?? 0,
        ];

        $catalog = [
            'products' => ProductResource::collection($business->listingProducts)->resolve(),
            'services' => ServiceResource::collection($business->listingServices)->resolve(),
        ];

        $media = [];
        if (!empty($business->cover_image)) {
            $media[] = [
                'id' => 0,
                'url' => $business->cover_image,
                'is_cover' => true,
                'sort_order' => 0,
            ];
        }
        if ($business->gallery && $business->gallery->isNotEmpty()) {
            foreach ($business->gallery as $g) {
                if (!empty($g->image_url) && $g->image_url !== $business->cover_image) {
                    $media[] = [
                        'id' => $g->id,
                        'url' => $g->image_url,
                        'is_cover' => false,
                        'sort_order' => $g->sort_order,
                    ];
                }
            }
        }
        if (empty($media)) {
            $media = MediaResource::collection($business->media)->resolve();
        }

        $basicInfo['gallery'] = $media;

        return new BusinessProfileDTO([
            'basicInfo' => $basicInfo,
            'actions' => $actions,
            'metrics' => $metrics,
            'catalog' => $catalog,
            'media' => $media,
        ]);
    }
}
