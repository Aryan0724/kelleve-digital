<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequirementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user('sanctum');
        
        $hasBid = false;
        if ($user) {
            $hasBid = \App\Models\Bid::where('requirement_id', $this->id)
                ->where('professional_id', $user->id)
                ->exists();
        }
        
        $canSeeContact = $user && (
            $user->id === $this->user_id ||
            $user->isAdmin() || 
            $user->hasPremiumSubscription() || 
            $user->hasUnlockedRequirement($this->id) ||
            $hasBid
        );

        return [
            'id'             => $this->id,
            'user_id'        => $this->user_id,
            'title'          => $this->title,
            'description'    => $this->description,
            'project_type'   => $this->project_type,
            'has_bid'        => $hasBid,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'budget_min'     => $this->budget_min,
            'budget_max'     => $this->budget_max,
            'formatted_budget' => $this->formatted_budget,
            'city'           => $this->city,
            'district'       => $this->district,
            'status'         => $this->status,
            'unlock_price'   => $this->unlock_price !== null ? (float) $this->unlock_price : null,
            'bids_count'     => $this->whenCounted('bids'),
            'views_count'    => $this->views_count ?? null,
            'image'          => $this->image,
            'images'         => RequirementImageResource::collection($this->whenLoaded('images')),
            // Contact details — only for premium subscribers or admin
            'name'           => $canSeeContact ? $this->name : '***',
            'phone'          => $canSeeContact ? $this->phone : '+91 ***** *****',
            'email'          => $canSeeContact ? $this->email : null,
            'is_unlocked'    => $canSeeContact,
            'created_at'     => $this->created_at ? \Carbon\Carbon::parse($this->created_at)->diffForHumans() : null,
        ];
    }
}
