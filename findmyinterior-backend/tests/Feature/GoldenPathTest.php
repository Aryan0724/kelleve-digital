<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Requirement;
use App\Models\Bid;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GoldenPathTest extends TestCase
{
    use RefreshDatabase;

    public function test_marketplace_golden_path_transaction_loop()
    {
        // 1. Setup Users
        $client = User::factory()->create(['roles' => ['customer']]);
        $professional = User::factory()->create(['roles' => ['business']]);

        // 2. Homeowner creates an Opportunity
        $response = $this->actingAs($client)->postJson('/api/v1/requirements', [
            'title' => 'Kitchen Renovation',
            'description' => 'Looking for a complete kitchen overhaul.',
            'budget' => 150000,
            'budget_type' => 'fixed',
            'city' => 'Mumbai',
            'property_type' => 'Apartment',
            'requirement_type' => 'Interior Design',
            'name' => 'John Client',
            'phone' => '9876543210',
            'email' => 'john@example.com',
            'target_roles' => ['business'],
        ]);
        $response->assertStatus(201);
        $requirementId = $response->json('data.id');

        // 3. Professional submits Bid
        $response = $this->actingAs($professional)->postJson('/api/v1/bids', [
            'requirement_id' => $requirementId,
            'estimated_cost' => 140000,
            'timeline_days' => 30,
            'proposal_message' => 'We can do this perfectly.',
        ]);
        $response->assertStatus(201);
        $bidId = $response->json('bid.id');

        // 4. Client awards Project
        $response = $this->actingAs($client)->postJson("/api/v1/bids/{$bidId}/award");
        $response->assertStatus(200);

        // 5. Verify Project & Conversation are created
        $this->assertDatabaseHas('projects', [
            'requirement_id' => $requirementId,
            'winning_bid_id' => $bidId,
            'client_id' => $client->id,
            'professional_id' => $professional->id,
            'status' => 'awarded',
        ]);
        
        $project = Project::where('winning_bid_id', $bidId)->first();
        
        $this->assertDatabaseHas('conversations', [
            'project_id' => $project->id,
            'customer_id' => $client->id,
            'vendor_id' => $professional->id,
        ]);

        // 6. Check Project Management endpoints (Homeowner views project)
        $response = $this->actingAs($client)->getJson("/api/v1/projects/{$project->id}");
        $response->assertStatus(200);

        // 7. Check Unauthorized Access (Random User)
        $randomUser = User::factory()->create(['roles' => ['customer']]);
        $response = $this->actingAs($randomUser)->getJson("/api/v1/projects/{$project->id}");
        $response->assertStatus(403);

        // 8. Professional marks progress
        $response = $this->actingAs($professional)->postJson("/api/v1/projects/{$project->id}/progress", [
            'status' => 'in_progress'
        ]);
        $response->assertStatus(200);
        
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'status' => 'in_progress',
        ]);

        // 9. Client completes the project
        $response = $this->actingAs($client)->postJson("/api/v1/projects/{$project->id}/complete");
        $response->assertStatus(200);
        
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'status' => 'completed',
        ]);

        // 10. Client submits Review for Professional
        $response = $this->actingAs($client)->postJson("/api/v1/projects/{$project->id}/reviews", [
            'rating' => 5,
            'review' => 'Excellent work by the professional!',
        ]);
        $response->assertStatus(200);

        // 11. Professional submits Review for Client
        $response = $this->actingAs($professional)->postJson("/api/v1/projects/{$project->id}/reviews", [
            'rating' => 4,
            'review' => 'Great client to work with.',
        ]);
        $response->assertStatus(200);

        // 12. Verify Reviews exist in DB
        $this->assertDatabaseHas('reviews', [
            'project_id' => $project->id,
            'reviewer_id' => $client->id,
            'reviewed_user_id' => $professional->id,
        ]);
        
        $this->assertDatabaseHas('reviews', [
            'project_id' => $project->id,
            'reviewer_id' => $professional->id,
            'reviewed_user_id' => $client->id,
        ]);
    }
}
