<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Tests\Feature\Security\SecurityTestCase;
use App\Models\User;
use App\Models\Role;

/**
 * Phase 2: Admin Escalation Sweep
 * Verifies that standard users cannot access admin endpoints.
 */
class AdminEscalationTest extends SecurityTestCase
{
    use DatabaseTruncation;
    protected $seeder = \Database\Seeders\SecurityTestSeeder::class;

    private function makeUser(string $roleSlug = 'homeowner'): User
    {
        $user = User::factory()->create();
        $role = Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
            $user->update(['primary_role_id' => $role->id]);
        }
        return $user;
    }

    public function test_non_admin_cannot_access_admin_dashboard()
    {
        $user = $this->makeUser('homeowner');
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/dashboard');
        
        $this->assertEquals(403, $response->status(), 'SEC-007 VIOLATED: Non-admin accessed admin dashboard');
    }

    public function test_unauthenticated_cannot_access_admin_dashboard()
    {
        $response = $this->getJson('/api/v1/admin/dashboard');
        $this->assertEquals(401, $response->status(), 'SEC-008 VIOLATED: Unauthenticated accessed admin dashboard');
    }

    public function test_non_admin_cannot_delete_user()
    {
        $attacker = $this->makeUser('skilled_worker');
        $victim = User::factory()->create();

        $response = $this->actingAs($attacker, 'sanctum')->deleteJson("/api/v1/admin/users/{$victim->id}");
        
        $this->assertEquals(403, $response->status(), 'SEC-009 VIOLATED: Non-admin could delete user');
        $this->assertDatabaseHas('users', ['id' => $victim->id]);
    }

    public function test_admin_can_access_admin_dashboard()
    {
        $admin = $this->makeUser('admin');
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/dashboard');
        
        $this->assertContains($response->status(), [200, 204], 'Admin could not access admin dashboard');
    }
}
