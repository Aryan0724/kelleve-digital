<?php
namespace App\Traits;
trait TenantAwareTrait {
    public function scopeForCurrentTenant($query) { return $query; } // Dedicated platform
    public function scopeByCategory($query, $id) { return $query->where('category_id', $id); }
}
