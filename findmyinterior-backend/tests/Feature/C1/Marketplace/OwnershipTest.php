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

class OwnershipTest extends TestCase
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

    // 1. Direct Ownership
    
    public function test_user_can_update_own_profile()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->putJson("/api/v1/user/profile", [
            'name' => 'Updated Name'
        ]);
        $response->assertStatus(200);
    }
    
    public function test_user_cannot_edit_other_project()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());
        
        $project = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project',
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

        $attacker = User::factory()->create();
        $attacker->roles()->attach(Role::where('slug', 'customer')->first());

        $response = $this->actingAs($attacker)->putJson("/api/v1/projects/{$project->id}", [
            'title' => 'Hacked Project'
        ]);
        
        $response->assertStatus(403);
    }

    public function test_project_owner_can_edit_own_project()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());
        
        $project = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project',
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

        $response = $this->actingAs($owner)->putJson("/api/v1/projects/{$project->id}", [
            'title' => 'Updated Title'
        ]);
        
        $response->assertStatus(200);
    }

    // 2. Role Relationship

    public function test_awarded_professional_can_update_project_progress()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());

        $project = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project',
            'description' => 'Looking for full home interior',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'awarded',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
        ]);

        $pro = User::factory()->create();
        $pro->roles()->attach(Role::where('slug', 'business')->first());

        $quote = Bid::create([
            'requirement_id' => $project->id,
            'professional_id' => $pro->id,
            'requirement_type' => 'project',
            'status' => 'awarded'
        ]);

        $response = $this->actingAs($pro)->postJson("/api/v1/projects/{$project->id}/progress", [
            'status' => 'work_started'
        ]);

        $response->assertStatus(200);
    }

    public function test_random_professional_cannot_update_project_progress()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());

        $project = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project',
            'description' => 'Looking for full home interior',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'awarded',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
        ]);

        $pro = User::factory()->create();
        $pro->roles()->attach(Role::where('slug', 'business')->first());

        $randomPro = User::factory()->create();
        $randomPro->roles()->attach(Role::where('slug', 'business')->first());

        $quote = Bid::create([
            'requirement_id' => $project->id,
            'professional_id' => $pro->id,
            'requirement_type' => 'project',
            'status' => 'awarded'
        ]);

        $response = $this->actingAs($randomPro)->postJson("/api/v1/projects/{$project->id}/progress", [
            'status' => 'work_started'
        ]);

        $response->assertStatus(403);
    }

    // 3. State tests

    public function test_owner_cannot_edit_awarded_project()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());

        $project = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project',
            'description' => 'Looking for full home interior',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'awarded',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
        ]);

        $response = $this->actingAs($owner)->putJson("/api/v1/projects/{$project->id}", [
            'title' => 'Hacked Title'
        ]);

        $response->assertStatus(409);
    }

    // 4. Nested Resource
    
    public function test_cannot_award_quote_belonging_to_another_project()
    {
        $owner = User::factory()->create();
        $owner->roles()->attach(Role::where('slug', 'customer')->first());

        $project1 = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project 1',
            'description' => 'Looking for full home interior',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'open',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
        ]);

        $project2 = Requirement::create([
            'user_id' => $owner->id,
            'title' => 'My Project 2',
            'description' => 'Looking for full home interior',
            'project_type' => 'residential',
            'name' => 'John Doe',
            'phone' => '9876543210',
            'status' => 'open',
            'category_id' => Category::first()->id,
            'city_id' => City::first()->id,
            'district_id' => District::first()->id,
            'city' => 'Patna',
            'district' => 'Patna',
        ]);

        $pro = User::factory()->create();
        $pro->roles()->attach(Role::where('slug', 'business')->first());

        $quoteOnProject2 = Bid::create([
            'requirement_id' => $project2->id,
            'professional_id' => $pro->id,
            'requirement_type' => 'project',
            'status' => 'pending'
        ]);

        // Try to award Quote 2 on Project 1
        $response = $this->actingAs($owner)->patchJson("/api/v1/projects/{$project1->id}/quotes/{$quoteOnProject2->id}/award");

        // Should be 404 (because quote doesn't belong to project) or 403.
        $response->assertStatus(404);
    }
}
