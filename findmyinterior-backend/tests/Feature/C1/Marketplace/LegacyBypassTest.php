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

class LegacyBypassTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);
        
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
    }

    public function test_legacy_bids_endpoint_rejects_new_domains()
    {
        $user = User::factory()->create();
        $pro = User::factory()->create();
        $pro->roles()->attach(Role::where('slug', 'business')->first());
        
        $project = Requirement::create([
            'user_id' => $user->id,
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

        $payloads = ['project', 'job', 'rfq'];

        foreach ($payloads as $type) {
            $bidData = [
                'requirement_id' => $project->id,
                'amount' => 500000,
                'estimated_cost' => 500000,
                'timeline_days' => 30,
                'proposal_message' => 'Valid quote',
                'requirement_type' => $type
            ];

            $response = $this->actingAs($pro)->postJson('/api/v1/bids', $bidData);
            
            $response->assertStatus(400);
            $response->assertJson([
                'error' => 'LEGACY_BID_ENDPOINT'
            ]);
        }
    }
}
