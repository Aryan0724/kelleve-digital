<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\User;
use App\Models\Role;
use App\Models\Listing;
use App\Models\OpportunityType;

class SupplierGoldenFlowTest extends GoldenFlowTestCase
{
    private function makeSupplier(): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'supplier'], ['name' => 'Supplier']);
        $user->roles()->attach($role->id);
        
        Listing::factory()->create([
            'user_id' => $user->id,
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1,
            'status' => 'active',
            'is_verified' => 1
        ]);
        return $user;
    }

    private function makeContractorWithRfq(): array
    {
        $contractor = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'contractor'], ['name' => 'Contractor']);
        $contractor->roles()->attach($role->id);

        $this->actingAs($contractor);
        
        $postData = [
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

        // Ensure requirement type is mapped properly. RFQs usually use `POST /api/v1/rfqs`
        $res = $this->postJson('/api/v1/rfqs', $postData);
        $res->assertStatus(201);
        $rfqId = $res->json('data.id');

        return [$contractor, $rfqId];
    }

    public function test_supplier_golden_flow_with_session_persistence()
    {
        // ── 1: Register/Login as Supplier ─────────────────────────────────────
        $supplier = $this->makeSupplier();

        // ── 2: Find RFQ ───────────────────────────────────────────────────────
        [$contractor, $rfqId] = $this->makeContractorWithRfq();
        
        $this->simulateSessionRefresh($supplier);
        $res = $this->getJson("/api/v1/rfqs");
        $res->assertStatus(200);

        // ── 3: Submit Quotation ───────────────────────────────────────────────
        $quoteRes = $this->postJson("/api/v1/rfqs/{$rfqId}/quotes", [
            'proposal_message' => 'We can supply this.',
            'amount' => 45000,
            'estimated_cost' => 45000,
            'timeline_days' => 5,
        ]);
        // Same as jobs, they probably used to share bids. 
        // Let's assert it created it, if not, debug the payload or foreign keys.
        $quoteRes->assertStatus(201);
        $quoteId = $quoteRes->json('data.id');

        // ── 4: Receive Acceptance ─────────────────────────────────────────────
        $this->simulateSessionRefresh($contractor);
        $awardRes = $this->patchJson("/api/v1/rfqs/{$rfqId}/quotes/{$quoteId}/award");
        $awardRes->assertStatus(200);

        // ── 5: Verify status ──────────────────────────────────────────────────
        $this->simulateSessionRefresh($supplier);
        $rfqRes = $this->getJson("/api/v1/rfqs/{$rfqId}");
        $rfqRes->assertStatus(200);
        
        // Asserting the final state of the RFQ
        $status = $rfqRes->json('data.status');
        $this->assertTrue(in_array($status, ['awarded', 'closed']), "Status is {$status}");
    }
}
