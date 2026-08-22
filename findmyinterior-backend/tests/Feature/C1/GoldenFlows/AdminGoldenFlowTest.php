<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\User;
use App\Models\Role;
use App\Models\Listing;

class AdminGoldenFlowTest extends GoldenFlowTestCase
{
    private function makeAdmin(): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrator']);
        $user->roles()->attach($role->id);
        
        return $user;
    }

    private function makeUnverifiedListing(): Listing
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        $user->roles()->attach($role->id);
        
        return Listing::factory()->create([
            'user_id' => $user->id,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1,
            'status' => 'pending',
            'is_verified' => 0
        ]);
    }

    public function test_admin_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Admin ────────────────────────────────────────
        $admin = $this->makeAdmin();

        // ── 2: Find Pending Listing ───────────────────────────────────────────
        $listing = $this->makeUnverifiedListing();
        
        $this->actingAs($admin);
        
        // ── 3: Approve Listing ────────────────────────────────────────────────
        $verifyRes = $this->patchJson("/api/v1/admin/listings/{$listing->id}/verify", [
            'reason' => 'Verification complete'
        ]);
        $verifyRes->assertStatus(200);

        // ── 4: View Platform Stats ────────────────────────────────────────────
        $this->simulateSessionRefresh($admin);
        
        $dashboardRes = $this->getJson("/api/v1/admin/dashboard");
        $dashboardRes->assertStatus(200);
    }
}
