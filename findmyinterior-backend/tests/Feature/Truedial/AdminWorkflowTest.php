<?php

namespace Tests\Feature\Truedial;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AdminWorkflowTest extends TestCase
{
    use RefreshDatabase;

    // Normally we'd use RefreshDatabase, but if we don't have migrations fully set up for admin yet,
    // we'll just test the API contract.

    protected function setUp(): void
    {
        parent::setUp();
        // Create a mock user to act as admin
        $this->admin = User::factory()->create();
    }

    /**
     * Test admin stats endpoint.
     */
    public function test_admin_can_fetch_platform_stats()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/truedial/admin/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'total_vendors',
                         'total_users',
                         'active_campaigns',
                         'revenue_mtd'
                     ]
                 ]);
                 
        $this->assertTrue($response->json('success'));
    }

    /**
     * Test admin vendors list endpoint.
     */
    public function test_admin_can_fetch_vendors()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/truedial/admin/vendors');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => [
                             'id',
                             'business_name',
                             'owner',
                             'status',
                             'created_at'
                         ]
                     ]
                 ]);
    }

    /**
     * Test admin can approve a vendor.
     */
    public function test_admin_can_approve_vendor()
    {
        $vendorId = 2; // Assuming ID 2 from mock data
        $response = $this->actingAs($this->admin)->patchJson("/api/v1/truedial/admin/vendors/{$vendorId}/approve");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Vendor approved successfully.',
                     'data' => [
                         'id' => $vendorId,
                         'status' => 'active'
                     ]
                 ]);
    }
}
