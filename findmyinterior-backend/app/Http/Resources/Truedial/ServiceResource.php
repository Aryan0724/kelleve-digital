<?php

namespace App\Http\Resources\Truedial;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price_starting_at' => $this->price_starting_at,
            'media' => MediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
