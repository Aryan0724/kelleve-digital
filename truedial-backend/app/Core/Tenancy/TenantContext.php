<?php
namespace App\Core\Tenancy;
class TenantContext {
    protected $tenant_id = 1; // Always 1 for TrueDial dedicated
    public function __construct() {}
    public function getTenantId() { return $this->tenant_id; }
    public function getTenant() { return null; }
    public function hasModule() { return true; }
}
