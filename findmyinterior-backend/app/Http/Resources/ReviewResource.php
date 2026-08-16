<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'id'         => $this->id,
            'rating'     => $this->rating,
            'title'      => $this->title,
            'body'       => $this->body,
            'reviewer'   => [
                'id'     => $this->reviewer?->id,
                'name'   => $this->reviewer?->name,
                'avatar' => $formatUrl($this->reviewer?->avatar),
            ],
            'created_at' => $this->created_at?->diffForHumans(),
        ];
    }
}
