<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StateTransitionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);
        
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']);
    }

    public function test_cannot_bid_on_closed_or_completed_project()
    {
        // 1. Setup Customer and Closed Project
        $customer = User::factory()->create();
        $customer->roles()->attach(Role::where('slug', 'customer')->first());

        $project = Requirement::create([
            'user_id' => $customer->id,
            'title' => 'Need 3BHK Design',
            'description' => 'Looking for full home interior',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'completed' // Project is already completed
        ]);

        // 2. Setup Professional
        $pro = User::factory()->create();
        $pro->roles()->attach(Role::where('slug', 'business')->first());

        // 3. Pro tries to bid on the Completed Project
        $bidData = [
            'requirement_id' => $project->id,
            'requirement_type' => 'project',
            'amount' => 500000,
            'estimated_cost' => 500000,
            'timeline_days' => 30,
            'proposal_message' => 'I can do this!',
            'experience_years' => 5
        ];

        $response = $this->actingAs($pro)->postJson("/api/v1/projects/{$project->id}/quotes", $bidData);
        
        // Assert it is rejected (403 or 422 depending on how we want to handle it, but it should NOT be 201)
        $response->assertStatus(403);
    }
}
