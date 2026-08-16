<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $formatUrl = function($img) {
            if (empty($img)) return null;
            if (\Illuminate\Support\Str::startsWith($img, 'data:')) {
                return $img;
            }
            if (\Illuminate\Support\Str::startsWith($img, 'http://findmyinterior.com')) {
                $img = str_replace('http://', 'https://', $img);
            }
            if (\Illuminate\Support\Str::startsWith($img, 'http://') || \Illuminate\Support\Str::startsWith($img, 'https://')) {
                return $img;
            }
            $url = url($img);
            if (config('app.env') === 'production' || str_contains($url, 'findmyinterior.com')) {
                $url = str_replace('http://', 'https://', $url);
            }
            return $url;
        };

        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'role'               => $this->isAdmin() ? 'admin' : ($this->roles->first()?->slug ?? 'customer'),
            'professional_type'  => $this->professional_type ?: null,
            'roles'              => $this->roles->pluck('slug'),
            'isAdmin'            => $this->isAdmin(),
            'avatar'             => $formatUrl($this->avatar),
            'cover_image'        => $formatUrl($this->cover_image),
            'city'               => $this->city,
            'district'           => $this->district,
            'address'            => $this->address,
            'is_active'          => $this->is_active,
            'email_verified'     => !is_null($this->email_verified_at),
            'trust_score'        => $this->trust_score ?? 0,
            'profile_completion_score' => $this->profile_completion_score ?? 0,
            'verification_level' => $this->verification_level ?? 'unverified',
            'has_listing'        => $this->listings()->exists(),
            'wallet_balance'     => (float) (\Illuminate\Support\Facades\DB::table('wallets')->where('user_id', $this->id)->value('balance') ?? 0.0),
            'subscription'       => $this->whenLoaded('activeSubscription', fn() =>
                $this->activeSubscription
                    ? new UserSubscriptionResource($this->activeSubscription)
                    : null
            ),
            'created_at'         => $this->created_at?->toDateString(),
        ];
    }
}
