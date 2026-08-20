<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Requirement;
use App\Models\Bid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure roles exist for testing
        Role::firstOrCreate(['slug' => 'customer', 'name' => 'Customer']);
        Role::firstOrCreate(['slug' => 'worker', 'name' => 'Worker']);
        Role::firstOrCreate(['slug' => 'business', 'name' => 'Business']);
    }

    public function test_unauthenticated_cannot_store_bid()
    {
        $response = $this->postJson('/api/v1/bids', [
            'requirement_id' => 1,
            'estimated_cost' => 100,
            'timeline_days' => 5,
            'proposal_message' => 'Hello',
        ]);

        $response->assertStatus(401);
    }

    public function test_customer_cannot_store_bid()
    {
        $customer = User::factory()->create();
        $customer->assignRole('customer');
        
        $token = $customer->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/bids', [
            'requirement_id' => 1,
            'estimated_cost' => 100,
            'timeline_days' => 5,
            'proposal_message' => 'Hello',
        ]);

        $response->assertStatus(403);
    }

    public function test_professional_can_store_bid()
    {
        $pro = User::factory()->create();
        $pro->assignRole('business');
        
        $requirement = Requirement::factory()->create();
        
        $token = $pro->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/bids', [
            'requirement_id' => $requirement->id,
            'estimated_cost' => 100,
            'timeline_days' => 5,
            'proposal_message' => 'Hello',
        ]);

        $response->assertStatus(201);
    }

    public function test_customer_cannot_unlock_requirement()
    {
        $customer = User::factory()->create();
        $customer->assignRole('customer');
        
        $requirement = Requirement::factory()->create();
        
        $token = $customer->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/requirements/' . $requirement->id . '/unlock');

        // Customer cannot unlock requirement, returns 403
        $response->assertStatus(403);
    }

    public function test_professional_cannot_unlock_listing()
    {
        $pro = User::factory()->create();
        $pro->assignRole('business');
        
        // Listing is created with a different user by default via factory
        $listing = \App\Models\Listing::factory()->create();
        
        $token = $pro->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/listings/' . $listing->id . '/unlock');

        // Professional cannot unlock another professional's listing
        $response->assertStatus(403);
    }
}
