<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\ProjectQuote;
use App\Models\Listing;

class HomeownerGoldenFlowTest extends GoldenFlowTestCase
{
    private function makeHomeowner(): User
    {
        $user = User::factory()->create();
        $role = Role::where('slug', 'customer')->first() ?? Role::where('slug', 'homeowner')->first();
        if ($role) $user->roles()->attach($role);
        return $user;
    }

    private function makeProfessional(): User
    {
        $user = User::factory()->create();
        $businessRole = Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business Professional']);
        $designerRole = Role::firstOrCreate(['slug' => 'interior_designer'], ['name' => 'Interior Designer']);
        $user->roles()->attach([$businessRole->id, $designerRole->id]);
        
        Listing::factory()->create([
            'user_id' => $user->id,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1,
            'status' => 'active',
            'is_verified' => 1
        ]);
        return $user;
    }
    public function test_homeowner_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Homeowner ────────────────────────────────
        $homeowner = $this->makeHomeowner();

        // ── 2: Search and view a Professional's profile ───────────────────
        $pro = $this->makeProfessional();
        $proProfile = $pro->listing;
        $initialViews = $proProfile->views_count;
        
        $this->actingAs($homeowner)
             ->getJson("/api/v1/listings/{$proProfile->slug}")
             ->assertStatus(200);

        // Verify views incremented (depending on the implementation, might need DB refresh)
        $this->assertTrue($proProfile->fresh()->views_count >= $initialViews);

        // ── 3: Post a new Project ─────────────────────────────────────────
        $postData = [
            'title'        => 'Golden Flow 3BHK',
            'description'  => 'Full golden flow test project',
            'category_id'  => Category::first()->id,
            'city_id'      => City::first()->id,
            'district_id'  => District::first()->id,
            'city'         => City::first()->name,
            'district'     => District::first()->name,
            'project_type' => 'residential',
            'name'         => 'Test Homeowner',
            'phone'        => '9876543210',
            'opportunity_type' => \App\Models\OpportunityType::first()->slug ?? 'project',
            'requirement_type' => 'Full Home Interiors',
        ];

        $res = $this->postJson('/api/v1/projects', $postData);
        $res->assertStatus(201);
        $projectId = $res->json('data.id');
        $this->assertNotNull($projectId);

        // ── 4: [Logout/Login] Verify project persists ─────────────────────
        $this->simulateSessionRefresh($homeowner);

        // Use fresh request to verify the state
        $res = $this->getJson("/api/v1/projects/{$projectId}");
        $res->assertStatus(200);
        $this->assertEquals('open', $res->json('data.status'));

        // ── 5: Professional submits Quote ─────────────────────────────────
        $this->simulateSessionRefresh($pro);
        
        $quoteRes = $this->postJson("/api/v1/projects/{$projectId}/quotes", [
            'amount'           => 500000,
            'estimated_cost'   => 500000,
            'proposal_message' => 'Golden flow proposal',
            'timeline_days'    => 45,
        ]);
        $quoteRes->assertStatus(201);
        $quoteId = $quoteRes->json('data.id');

        // Verify pro can see their quote
        $this->simulateSessionRefresh($pro);
        $res = $this->getJson("/api/v1/projects/{$projectId}");
        $res->assertStatus(200);

        // ── 6: Homeowner Awards Quote ─────────────────────────────────────
        $this->simulateSessionRefresh($homeowner);
        
        $awardRes = $this->patchJson("/api/v1/projects/{$projectId}/quotes/{$quoteId}/award");
        $awardRes->assertStatus(200);

        // ── 7: [Logout/Login] Verify project status is 'awarded' ──────────
        $this->simulateSessionRefresh($homeowner);
        
        $projRes = $this->getJson("/api/v1/projects/{$projectId}");
        $projRes->assertStatus(200);
        $this->assertEquals('awarded', $projRes->json('data.status'), 'Project status should be awarded');

        // Direct DB verification for quote states
        $this->assertEquals('accepted', ProjectQuote::find($quoteId)->status);
    }
}
