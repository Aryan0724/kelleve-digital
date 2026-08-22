<?php

namespace Tests\Feature\C1\Admin;

use App\Models\User;
use App\Models\Listing;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    protected function tearDown(): void
    {
        Listing::where('id', '>', 0)->delete();
        User::where('id', '>', 0)->delete();
        parent::tearDown();
    }

    public function test_admin_routes_require_authentication()
    {
        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(401);
    }

    public function test_admin_routes_forbidden_for_normal_users()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_admin_routes_allowed_for_admins()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $this->actingAs($admin, 'sanctum');

        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(200);
    }
}
