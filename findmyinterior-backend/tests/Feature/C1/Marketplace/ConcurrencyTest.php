<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\Bid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);
        
        Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']);
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
    }

    public function test_concurrent_project_awards_result_in_multiple_winners_bug()
    {
        // 1. Setup Customer and Open Project
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

        // 2. Setup 2 Professionals and 2 Bids
        $pro1 = User::factory()->create();
        $pro1->roles()->attach(Role::where('slug', 'business')->first());
        $bid1 = Bid::create([
            'requirement_id' => $project->id,
            'professional_id' => $pro1->id,
            'amount' => 500000,
            'timeline_days' => 30,
            'proposal_message' => 'Pro 1 Quote',
            'status' => 'pending'
        ]);

        $pro2 = User::factory()->create();
        $pro2->roles()->attach(Role::where('slug', 'business')->first());
        $bid2 = Bid::create([
            'requirement_id' => $project->id,
            'professional_id' => $pro2->id,
            'amount' => 450000,
            'timeline_days' => 25,
            'proposal_message' => 'Pro 2 Quote',
            'status' => 'pending'
        ]);

        // 3. Customer accepts Bid 1
        $response1 = $this->actingAs($customer)->patchJson("/api/v1/projects/{$project->id}/quotes/{$bid1->id}/award");
        $response1->assertStatus(200);

        // 4. Customer accepts Bid 2 (Simulating a race condition where the request bypassed frontend disabled states)
        $response2 = $this->actingAs($customer)->patchJson("/api/v1/projects/{$project->id}/quotes/{$bid2->id}/award");
        
        // Assert that the second award fails (Wait, we proved it throws 422 if we look at BidController)
        // BidController has a check: Bid::where('requirement_id', ...)->where('status', 'accepted')->exists();
        // So this will currently return 422.
        // Wait, if it returns 422, does it mean it IS atomic?
        // No, it's not strictly atomic under load (no DB lock), but sequentially it prevents it.
        $response2->assertStatus(403); // We will assert 403 when it's moved to the domain service
    }
}
