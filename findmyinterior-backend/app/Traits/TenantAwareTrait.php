<?php

namespace App\Traits;

use App\Core\Tenancy\TenantContext;
use App\Models\Scopes\TenantScope;

trait TenantAwareTrait
{
    /**
     * Boot the trait and apply the global tenant scope.
     */
    protected static function bootTenantAwareTrait(): void
    {
        static::addGlobalScope(new TenantScope);
        
        static::creating(function ($model) {
            $tenantId = app(TenantContext::class)->getTenantId();
            if ($tenantId && empty($model->tenant_id)) {
                $model->tenant_id = $tenantId;
            }
        });
    }

    /**
     * Scope a query to only include records for a specific tenant ID.
     */
    public function scopeForTenant($query, $tenantId)
    {
        return $query->withoutGlobalScope(TenantScope::class)->where('tenant_id', $tenantId);
    }

    /**
     * Scope a query to only include records for the currently active tenant.
     */
    public function scopeForCurrentTenant($query)
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        
        if (!$tenantId) {
            // Failsafe in case context is missing
            throw new \Exception('Cannot apply scopeForCurrentTenant without an active TenantContext.');
        }

        return $query->where('tenant_id', $tenantId);
    }

    /**
     * Check if this model instance belongs to the currently active tenant.
     */
    public function belongsToCurrentTenant(): bool
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        return $this->tenant_id === $tenantId;
    }
}
