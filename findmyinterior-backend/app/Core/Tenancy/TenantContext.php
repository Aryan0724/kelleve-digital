<?php

namespace App\Core\Tenancy;

use App\Models\Tenant;

class TenantContext
{
    protected ?Tenant $currentTenant = null;

    /**
     * Set the current active tenant.
     *
     * @param Tenant $tenant
     * @return void
     */
    public function setTenant(Tenant $tenant): void
    {
        $this->currentTenant = $tenant;
    }

    /**
     * Get the current active tenant.
     *
     * @return Tenant|null
     */
    public function getTenant(): ?Tenant
    {
        return $this->currentTenant;
    }

    /**
     * Get the current active tenant ID.
     *
     * @return int|null
     */
    public function getTenantId(): ?int
    {
        return $this->currentTenant ? $this->currentTenant->id : null;
    }

    /**
     * Check if a specific module is enabled for the current tenant.
     *
     * @param string $moduleName
     * @return bool
     */
    public function hasModule(string $moduleName): bool
    {
        if (!$this->currentTenant) {
            return false;
        }

        return $this->currentTenant->modules()
            ->where('module_name', $moduleName)
            ->where('enabled', true)
            ->exists();
    }
}
