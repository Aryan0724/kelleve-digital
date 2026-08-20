<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\ProjectQuote;
use App\Models\JobApplication;
use App\Models\RfqQuotation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseInvariantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);
        
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Worker']);
    }

    public function test_project_quote_model_forces_requirement_type_to_project()
    {
        $user = User::factory()->create();
        $pro = User::factory()->create();
        
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

        // Even if we try to maliciously pass 'job' as requirement_type to the model
        $quote = ProjectQuote::create([
            'requirement_id' => $project->id,
            'professional_id' => $pro->id,
            'amount' => 500000,
            'timeline_days' => 30,
            'proposal_message' => 'Valid quote',
            'requirement_type' => 'job' // malicious payload
        ]);

        // Fetch raw from DB
        $rawDbRow = \DB::table('bids')->where('id', $quote->id)->first();

        $this->assertEquals('project', $rawDbRow->requirement_type);
        $this->assertEquals('project', $quote->requirement_type);
    }
}
