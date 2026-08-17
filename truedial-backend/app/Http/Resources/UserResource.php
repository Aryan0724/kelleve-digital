<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class UserResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'professional_type' => $this->professional_type,
            'role' => $this->roles->first()?->slug,
            'is_active' => $this->is_active,
            'is_verified' => $this->is_verified,
            'is_verified_business' => $this->is_verified_business,
        ];
    }
}
