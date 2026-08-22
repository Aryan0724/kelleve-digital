<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\Listing;

class WorkerGoldenFlowTest extends GoldenFlowTestCase
{
    private function makeWorker(): User
    {
        $user = User::factory()->create();
        $workerRole = Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Skilled Worker']);
        $user->roles()->attach($workerRole->id);
        
        Listing::factory()->create([
            'user_id' => $user->id,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1,
            'status' => 'active',
            'is_verified' => 1
        ]);
        return $user;
    }

    private function makeContractorWithJob(): array
    {
        $contractor = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'contractor'], ['name' => 'Contractor']);
        $contractor->roles()->attach($role->id);

        $this->actingAs($contractor);
        
        $postData = [
            'title'        => 'Worker Job - Painting',
            'description'  => 'Need 5 painters for 10 days',
            'category_id'  => Category::first()->id,
            'city_id'      => City::first()->id,
            'district_id'  => District::first()->id,
            'city'         => City::first()->name,
            'district'     => District::first()->name,
            'project_type' => 'commercial',
            'name'         => 'Test Contractor',
            'phone'        => '9876543210',
            'opportunity_type' => \App\Models\OpportunityType::first()->slug ?? 'labour',
            'requirement_type' => 'LABOUR_REQUEST',
            'budget_min'       => 1000,
            'budget_max'       => 5000,
        ];

        // Ensure requirement type is mapped properly. Jobs usually use `POST /api/v1/worker-jobs`
        // We will post to worker-jobs endpoint.
        $res = $this->postJson('/api/v1/worker-jobs', $postData);
        $res->assertStatus(201);
        $jobId = $res->json('data.id');

        return [$contractor, $jobId];
    }

    public function test_worker_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Worker ───────────────────────────────────────
        $worker = $this->makeWorker();

        // ── 2: Find Worker Job ────────────────────────────────────────────────
        [$contractor, $jobId] = $this->makeContractorWithJob();
        
        $this->simulateSessionRefresh($worker);
        $res = $this->getJson("/api/v1/worker-jobs");
        $res->assertStatus(200);

        // ── 3: Apply for Job ──────────────────────────────────────────────────
        $applyRes = $this->postJson("/api/v1/worker-jobs/{$jobId}/apply", [
            'proposal_message' => 'I am available for this job',
            'amount' => 4000,
            'estimated_cost' => 4000,
            'timeline_days' => 10,
        ]);
        
        // Assert successful application creation
        $applyRes->assertStatus(201);
        $applicationId = $applyRes->json('data.id');

        // ── 4: Receive Acceptance ─────────────────────────────────────────────
        $this->simulateSessionRefresh($contractor);
        $awardRes = $this->patchJson("/api/v1/worker-jobs/{$jobId}/apply/{$applicationId}/award");
        $awardRes->assertStatus(200);

        // ── 5: Verify status ──────────────────────────────────────────────────
        $this->simulateSessionRefresh($worker);
        $jobRes = $this->getJson("/api/v1/worker-jobs/{$jobId}");
        $jobRes->assertStatus(200);
        $this->assertEquals('closed', $jobRes->json('data.status'));
    }
}
