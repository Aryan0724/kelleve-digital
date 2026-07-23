<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Requirement;
use App\Models\Bid;
use App\Models\Project;
use App\Models\Category;
use App\Models\City;
use App\Models\District;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GoldenPathTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed base data needed by most flows
        City::factory()->create(['name' => 'Mumbai']);
        District::factory()->create(['name' => 'Mumbai']);
        Category::factory()->create(['name' => 'Interior Designer', 'slug' => 'interior-designer']);
    }

    protected function makeUser(string $roleSlug): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => $roleSlug], ['name' => ucfirst($roleSlug)]);
        $user->roles()->syncWithoutDetaching([$role->id]);
        return $user;
    }

    public function test_marketplace_golden_path_transaction_loop()
    {
        // 1. Setup Users
        $client       = $this->makeUser('customer');
        $professional = $this->makeUser('business');

        $category = Category::first();

        // 2. Homeowner creates an Opportunity
        $response = $this->actingAs($client)->postJson('/api/v1/requirements', [
            'title'            => 'Kitchen Renovation',
            'description'      => 'Looking for a complete kitchen overhaul.',
            'budget_min'       => 140000,
            'budget_max'       => 160000,
            'city'             => 'Mumbai',
            'district'         => 'Mumbai',
            'category_id'      => $category->id,
            'project_type'     => 'residential',
            'name'             => 'John Client',
            'phone'            => '9876543210',
            'email'            => 'john@example.com',
        ]);
        $response->assertStatus(201);
        $requirementId = $response->json('data.id');

        // Requirement starts as 'pending' (awaiting admin approval); manually open it for test flow
        Requirement::where('id', $requirementId)->update(['status' => 'open']);

        // 3. Professional submits Bid (no requirement_type — defaults to 'project')
        $response = $this->actingAs($professional)->postJson('/api/v1/bids', [
            'requirement_id'  => $requirementId,
            'estimated_cost'  => 140000,
            'timeline_days'   => 30,
            'proposal_message' => 'We can do this perfectly.',
        ]);
        $response->assertStatus(201);
        $bidId = $response->json('bid.id');

        $this->assertNotNull($bidId, 'Bid ID should not be null after bid submission');

        // 4. Client awards the bid
        $response = $this->actingAs($client)->patchJson("/api/v1/bids/{$bidId}/award");
        $response->assertStatus(200);

        // 5. Verify Requirement status updated
        $this->assertDatabaseHas('projects', [
            'id'     => $requirementId,
            'status' => 'awarded',
        ]);
    }
}
