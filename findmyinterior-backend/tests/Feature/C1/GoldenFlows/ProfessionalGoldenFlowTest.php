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

class ProfessionalGoldenFlowTest extends GoldenFlowTestCase
{
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

    private function makeHomeownerWithProject(): array
    {
        $homeowner = User::factory()->create();
        $role = Role::where('slug', 'customer')->first() ?? Role::where('slug', 'homeowner')->first();
        if ($role) $homeowner->roles()->attach($role);

        $this->actingAs($homeowner);
        
        $postData = [
            'title'        => 'Pro Flow 3BHK',
            'description'  => 'Project for professional testing',
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
        $projectId = $res->json('data.id');

        return [$homeowner, $projectId];
    }

    public function test_professional_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Professional ──────────────────────────────────
        $pro = $this->makeProfessional();

        // ── 2: Search Projects ───────────────────────────────────────────────
        [$homeowner, $projectId] = $this->makeHomeownerWithProject();
        
        $this->simulateSessionRefresh($pro);
        $res = $this->getJson("/api/v1/projects");
        $res->assertStatus(200);

        // ── 3: Unlock Project Lead ───────────────────────────────────────────
        // (Assuming /api/v1/projects/{id}/unlock or similar exists, else skip for now and submit quote)
        
        // ── 4: Submit Quote ──────────────────────────────────────────────────
        $quoteRes = $this->postJson("/api/v1/projects/{$projectId}/quotes", [
            'amount'           => 600000,
            'estimated_cost'   => 600000,
            'proposal_message' => 'Pro golden flow proposal',
            'timeline_days'    => 30,
        ]);
        $quoteRes->assertStatus(201);
        $quoteId = $quoteRes->json('data.id');

        // ── 5: Receive Award ─────────────────────────────────────────────────
        $this->simulateSessionRefresh($homeowner);
        $awardRes = $this->patchJson("/api/v1/projects/{$projectId}/quotes/{$quoteId}/award");
        $awardRes->assertStatus(200);

        // ── 6: [Logout/Login] Verify project status is 'awarded' ─────────────
        $this->simulateSessionRefresh($pro);
        $projRes = $this->getJson("/api/v1/projects/{$projectId}");
        $projRes->assertStatus(200);
        $this->assertEquals('awarded', $projRes->json('data.status'), 'Project status should be awarded');

        // ── 7: Progress Project to Milestone ─────────────────────────────────
        $progressRes = $this->postJson("/api/v1/projects/{$projectId}/progress", [
            'status' => 'in_progress', // or whatever the milestone update requires
            'milestone' => 'Started'
        ]);
        $progressRes->assertStatus(200);
            
        $this->simulateSessionRefresh($pro);
        $projRes2 = $this->getJson("/api/v1/projects/{$projectId}");
        $this->assertEquals('in_progress', $projRes2->json('data.status'));

        // ── 8: Complete Project ──────────────────────────────────────────────
        $this->simulateSessionRefresh($homeowner);
        $completeRes = $this->postJson("/api/v1/projects/{$projectId}/complete");
        $completeRes->assertStatus(200);
    }
}
