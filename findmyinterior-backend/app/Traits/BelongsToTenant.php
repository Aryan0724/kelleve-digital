<?php

namespace App\Traits;

use App\Models\Scopes\TenantScope;
use App\Core\Tenancy\TenantContext;

trait BelongsToTenant
{
    /**
     * Boot the trait and apply the tenant scope.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            $tenantContext = app(TenantContext::class);
            $tenant = $tenantContext->getTenant();

            if ($tenant && !$model->tenant_id) {
                $model->tenant_id = $tenant->id;
            }
        });
    }

    /**
     * Relationship to the Tenant model.
     */
    public function tenant()
    {
        return $this->belongsTo(\App\Models\Tenant::class);
    }
}
