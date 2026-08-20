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

class GenericBidBugTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['name' => 'Patna', 'slug' => 'patna', 'state' => 'Bihar']);
        City::firstOrCreate(['name' => 'Patna', 'slug' => 'patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['name' => 'Interior Designer', 'slug' => 'interior-designer']);
        
        Role::firstOrCreate(['slug' => 'worker', 'name' => 'Worker']);
        Role::firstOrCreate(['slug' => 'business', 'name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'customer', 'name' => 'Customer']);
    }

    public function test_worker_cannot_bid_on_interior_project_via_generic_endpoint()
    {
        // 1. Setup Customer and Project
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
            'status' => 'open'
        ]);

        // 2. Setup Worker
        $worker = User::factory()->create();
        $worker->roles()->attach(Role::where('slug', 'worker')->first());

        // 3. Worker tries to bid on the Interior Project
        $bidData = [
            'requirement_id' => $project->id,
            'requirement_type' => 'project',
            'estimated_cost' => 500000, // old payload format
            'amount' => 500000,
            'timeline_days' => 30,
            'proposal_message' => 'I am a worker bidding on your project!',
            'experience_years' => 5
        ];

        $response = $this->actingAs($worker)->postJson('/api/v1/bids', $bidData);
        
        // Assert it is forbidden (403)
        $response->assertStatus(403);
    }
}
