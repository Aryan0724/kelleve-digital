<?php

namespace App\Traits;

use App\Core\Tenancy\TenantContext;

trait TenantAwareJob
{
    /**
     * The tenant ID active when the job was dispatched.
     */
    protected ?int $tenantId = null;

    /**
     * Set the tenant ID before serialization.
     */
    public function __sleep()
    {
        $this->tenantId = app(TenantContext::class)->getTenantId();
        
        $properties = array_keys(get_object_vars($this));
        return $properties;
    }

    /**
     * Restore the tenant ID upon deserialization and job execution.
     */
    public function __wakeup()
    {
        if ($this->tenantId !== null) {
            app(TenantContext::class)->setTenantId($this->tenantId);
        }
    }
}
