<?php

namespace App\Policies;

use App\Models\Offer;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use App\Core\Tenancy\TenantContext;

class OfferPolicy
{
    private function checkTenant(Offer $model): bool
    {
        return $model->tenant_id === app(TenantContext::class)->getTenantId();
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Offer $model): bool
    {
        return $this->checkTenant($model);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Offer $model): bool
    {
        if (!$this->checkTenant($model)) return false;
        
        $roles = $user->roles->pluck('slug')->toArray();
        $isAdmin = in_array('platform_admin', $roles) || in_array('tenant_admin', $roles) || in_array('admin', $roles);
        
        return $isAdmin || ($user->id === $model->listing->user_id);
    }

    public function delete(User $user, Offer $model): bool
    {
        return $this->update($user, $model);
    }

    public function restore(User $user, Offer $model): bool
    {
        $roles = $user->roles->pluck('slug')->toArray();
        return in_array('platform_admin', $roles) || in_array('tenant_admin', $roles) || in_array('admin', $roles);
    }

    public function forceDelete(User $user, Offer $model): bool
    {
        $roles = $user->roles->pluck('slug')->toArray();
        return in_array('platform_admin', $roles) || in_array('admin', $roles);
    }
}
