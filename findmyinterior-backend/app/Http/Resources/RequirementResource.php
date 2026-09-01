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

        $isPremiumUser = $user && ($user->isAdmin() || $user->hasPremiumSubscription());
        $earlyAccessHours = 2;
        $unlocksAt = $this->created_at ? \Carbon\Carbon::parse($this->created_at)->addHours($earlyAccessHours) : null;
        $isEarlyAccessLocked = !$isPremiumUser && $unlocksAt && $unlocksAt->isFuture() && ($user ? $user->id !== $this->user_id : true);
        $remainingMinutes = $isEarlyAccessLocked ? (int) max(0, now()->diffInMinutes($unlocksAt, false)) : 0;

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
            'unlock_price'   => (float) ($this->unlock_price ?? \App\Models\Setting::where('key', 'contact_unlock_fee')->value('value') ?? \App\Models\Setting::where('key', 'lead_price')->value('value') ?? 49.00),
            'views_count'    => $this->views_count ?? null,
            'image'          => $this->image,
            'images'         => RequirementImageResource::collection($this->whenLoaded('images')),
            // Early Lead Access status
            'is_early_access_locked'         => $isEarlyAccessLocked,
            'early_access_unlocks_at'        => $isEarlyAccessLocked && $unlocksAt ? $unlocksAt->toIso8601String() : null,
            'early_access_remaining_minutes' => $remainingMinutes,
            // Contact details — only for premium subscribers or admin
            'name'           => $canSeeContact ? ($this->user->name ?? $this->name) : '***',
            'phone'          => $canSeeContact ? ($this->user->phone ?? $this->phone) : substr($this->user->phone ?? $this->phone, 0, 2) . '********',
            'email'          => $canSeeContact ? ($this->user->email ?? $this->email) : null,
            'is_unlocked'    => $canSeeContact,
            'created_at'     => $this->created_at ? \Carbon\Carbon::parse($this->created_at)->diffForHumans() : null,
        ];
    }
}
