<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;
use App\Core\Tenancy\TenantContext;

class ListingPolicy
{
    private function checkTenant(Listing $model): bool
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        if (!$tenantId) return true;
        return $model->tenant_id === $tenantId || $model->tenant_id === null;
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Listing $model): bool
    {
        if ($user && $user->id === $model->user_id) {
            return true;
        }
        return $this->checkTenant($model);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Listing $model): bool
    {
        if ($user->id === $model->user_id) {
            return true;
        }
        
        $roles = $user->roles ? $user->roles->pluck('slug')->toArray() : [];
        $isAdmin = in_array('platform_admin', $roles) || in_array('tenant_admin', $roles) || in_array('admin', $roles) || $user->role === 'admin';
        
        return $isAdmin;
    }

    public function delete(User $user, Listing $model): bool
    {
        return $this->update($user, $model);
    }

    public function restore(User $user, Listing $model): bool
    {
        $roles = $user->roles->pluck('slug')->toArray();
        return in_array('platform_admin', $roles) || in_array('tenant_admin', $roles) || in_array('admin', $roles);
    }

    public function forceDelete(User $user, Listing $model): bool
    {
        $roles = $user->roles->pluck('slug')->toArray();
        return in_array('platform_admin', $roles) || in_array('admin', $roles);
    }

    /**
     * Determine whether the user can unlock the contact.
     */
    public function unlock(User $user, Listing $model): bool
    {
        // Owner doesn't need to unlock their own listing
        if ($user->id === $model->user_id) {
            return false;
        }

        // Any authenticated user can unlock professional contacts
        return true;
    }
}