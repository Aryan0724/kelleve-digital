<?php

namespace App\Http\Resources\Truedial;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => url('/storage/media/' . $this->file_name), // Or map from S3 if configured
            'file_name' => $this->file_name,
            'collection_name' => $this->collection_name,
            'is_cover' => (bool) $this->is_cover,
            'sort_order' => $this->sort_order,
            'custom_properties' => $this->custom_properties,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
