<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\User;
use App\Models\Role;
use App\Models\Listing;
use App\Models\OpportunityType;

class BuilderGoldenFlowTest extends GoldenFlowTestCase
{
    private function makeBuilder(): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'builder'], ['name' => 'Builder']);
        $user->roles()->attach($role->id);
        
        Listing::factory()->create([
            'user_id' => $user->id,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1,
            'status' => 'active',
            'is_verified' => 1
        ]);
        return $user;
    }

    public function test_builder_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Builder ──────────────────────────────────────
        $builder = $this->makeBuilder();

        // ── 2: Create RFQ ─────────────────────────────────────────────────────
        $this->actingAs($builder);
        
        $rfqData = [
            'title'        => 'RFQ for 100 bags of Cement',
            'description'  => 'Need cement delivered to site',
            'category_id'  => Category::first()->id,
            'city_id'      => City::first()->id,
            'district_id'  => District::first()->id,
            'city'         => City::first()->name,
            'district'     => District::first()->name,
            'project_type' => 'commercial',
            'opportunity_type' => OpportunityType::where('type', 'material')->first()->type ?? 'material',
            'requirement_type' => 'MATERIAL_REQUEST',
            'budget_min'       => 10000,
            'budget_max'       => 50000,
        ];

        $rfqRes = $this->postJson('/api/v1/rfqs', $rfqData);
        $rfqRes->assertStatus(201);
        $rfqId = $rfqRes->json('data.id');

        // ── 3: Create Worker Job ──────────────────────────────────────────────
        $this->simulateSessionRefresh($builder);
        
        $jobData = [
            'title'        => 'Worker Job - Painting',
            'description'  => 'Need 5 painters for 10 days',
            'category_id'  => Category::first()->id,
            'city_id'      => City::first()->id,
            'district_id'  => District::first()->id,
            'city'         => City::first()->name,
            'district'     => District::first()->name,
            'project_type' => 'commercial',
            'opportunity_type' => OpportunityType::where('type', 'labour')->first()->type ?? 'labour',
            'requirement_type' => 'LABOUR_REQUEST',
            'budget_min'       => 1000,
            'budget_max'       => 5000,
        ];

        $jobRes = $this->postJson('/api/v1/worker-jobs', $jobData);
        $jobRes->assertStatus(201);
        $jobId = $jobRes->json('data.id');

        // ── 4: View Responses ─────────────────────────────────────────────────
        $this->simulateSessionRefresh($builder);
        
        // Check if builder can view their created RFQ
        $rfqView = $this->getJson("/api/v1/rfqs/{$rfqId}");
        $rfqView->assertStatus(200);

        // Check if builder can view their created Worker Job
        $jobView = $this->getJson("/api/v1/worker-jobs/{$jobId}");
        $jobView->assertStatus(200);
    }
}
