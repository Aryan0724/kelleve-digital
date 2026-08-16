<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingGalleryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $formatUrl = function($img) {
            if (empty($img)) return null;
            if (\Illuminate\Support\Str::startsWith($img, 'http://') || \Illuminate\Support\Str::startsWith($img, 'https://')) {
                return $img;
            }
            return url($img);
        };

        return [
            'id'              => $this->id,
            'type'            => $this->type ?? 'image',
            'image_url'       => $formatUrl($this->image_url),
            'video_url'       => $this->video_url,
            'is_before_after' => (bool)$this->is_before_after,
            'caption'         => $this->caption,
            'sort_order'      => $this->sort_order,
        ];
    }
}
