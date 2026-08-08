<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingGalleryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'type'            => $this->type ?? 'image',
            'image_url'       => $this->image_url,
            'video_url'       => $this->video_url,
            'is_before_after' => (bool)$this->is_before_after,
            'caption'         => $this->caption,
            'sort_order'      => $this->sort_order,
        ];
    }
}
