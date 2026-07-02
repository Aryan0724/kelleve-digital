<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'role'               => $this->isAdmin() ? 'admin' : ($this->roles->first()?->slug ?? 'customer'),
            'roles'              => $this->roles->pluck('slug'),
            'isAdmin'            => $this->isAdmin(),
            'avatar'             => $this->avatar,
            'is_active'          => $this->is_active,
            'email_verified'     => !is_null($this->email_verified_at),
            'trust_score'        => $this->trust_score ?? 0,
            'profile_completion_score' => $this->profile_completion_score ?? 0,
            'verification_level' => $this->verification_level ?? 'unverified',
            'subscription'       => $this->whenLoaded('activeSubscription', fn() =>
                $this->activeSubscription
                    ? new UserSubscriptionResource($this->activeSubscription)
                    : null
            ),
            'created_at'         => $this->created_at?->toDateString(),
        ];
    }
}
