<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\RevenueAnalyticsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RevenueAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    protected RevenueAnalyticsService $service;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(RevenueAnalyticsService::class);
        $this->admin = User::factory()->create();
        
        // Assign admin role — use firstOrCreate to avoid UNIQUE slug violations between tests
        $roleId = \App\Models\Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin']
        )->id;
        DB::table('user_roles')->insertOrIgnore(['user_id' => $this->admin->id, 'role_id' => $roleId]);
    }

    protected function seedWalletTransactions(): void
    {
        $wallet = DB::table('wallets')->insertGetId([
            'user_id' => $this->admin->id,
            'balance' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('wallet_transactions')->insert([
            ['wallet_id' => $wallet, 'type' => 'credit', 'amount' => 1000, 'description' => 'Recharge', 'created_at' => now(), 'updated_at' => now()],
            ['wallet_id' => $wallet, 'type' => 'debit', 'amount' => 299, 'description' => 'contact_unlock', 'created_at' => now(), 'updated_at' => now()],
            ['wallet_id' => $wallet, 'type' => 'debit', 'amount' => 499, 'description' => 'subscription', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function test_revenue_summary_calculates_today_revenue(): void
    {
        $this->seedWalletTransactions();

        $summary = $this->service->getRevenueSummary();

        $this->assertEquals(798.0, $summary['revenue_today']);  // 299 + 499
        $this->assertEquals(798.0, $summary['revenue_week']);
        $this->assertEquals(798.0, $summary['revenue_month']);
    }

    public function test_revenue_by_category_calculates_unlock_and_subscription(): void
    {
        $this->seedWalletTransactions();

        $summary = $this->service->getRevenueSummary();

        $this->assertEquals(299.0, (float) $summary['by_category']['contact_unlock']);
        $this->assertEquals(499.0, (float) $summary['by_category']['subscription']);
        $this->assertEquals(1000.0, (float) $summary['by_category']['recharges_total']);
    }

    public function test_funnel_metrics_calculate_conversion_rates(): void
    {
        $customer = User::factory()->create();
        $vendor = User::factory()->create();

        // Seed category required by requirements FK
        $categoryId = \Illuminate\Support\Facades\DB::table('categories')->insertGetId([
            'name' => 'Test Cat', 'slug' => 'test-cat-' . uniqid(), 'sort_order' => 0, 'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $req1 = DB::table('projects')->insertGetId(['user_id' => $customer->id, 'category_id' => $categoryId, 'title' => 'Req1', 'status' => 'completed', 'description' => 'x', 'project_type' => 'residential', 'city' => 'City', 'district' => 'Dist', 'name' => 'Name', 'phone' => '1234567890', 'created_at' => now(), 'updated_at' => now()]);
        $req2 = DB::table('projects')->insertGetId(['user_id' => $customer->id, 'category_id' => $categoryId, 'title' => 'Req2', 'status' => 'awarded', 'description' => 'x', 'project_type' => 'residential', 'city' => 'City', 'district' => 'Dist', 'name' => 'Name', 'phone' => '1234567890', 'created_at' => now(), 'updated_at' => now()]);
        $req3 = DB::table('projects')->insertGetId(['user_id' => $customer->id, 'category_id' => $categoryId, 'title' => 'Req3', 'status' => 'open', 'description' => 'x', 'project_type' => 'residential', 'city' => 'City', 'district' => 'Dist', 'name' => 'Name', 'phone' => '1234567890', 'created_at' => now(), 'updated_at' => now()]);

        DB::table('bids')->insert(['requirement_id' => $req1, 'professional_id' => $vendor->id, 'status' => 'accepted', 'amount' => 1000, 'timeline_days' => 30, 'proposal_message' => 'ok', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('bids')->insert(['requirement_id' => $req2, 'professional_id' => $vendor->id, 'status' => 'pending', 'amount' => 2000, 'timeline_days' => 30, 'proposal_message' => 'ok', 'created_at' => now(), 'updated_at' => now()]);

        $funnel = $this->service->getFunnelMetrics();

        $this->assertEquals(3, $funnel['total_requirements']);
        $this->assertEquals(2, $funnel['requirements_with_bids']);
        $this->assertEquals(1, $funnel['awarded_requirements']);
        $this->assertEquals(1, $funnel['completed_requirements']);
        $this->assertEqualsWithDelta(66.67, $funnel['lead_to_bid_rate'], 0.1);
        $this->assertEqualsWithDelta(100.0, $funnel['award_to_completion_rate'], 0.1);
    }

    public function test_admin_revenue_endpoint_forbidden_for_non_admin(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/revenue');
        $response->assertForbidden();
    }

    public function test_admin_revenue_endpoint_returns_data_for_admin(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/v1/admin/revenue');
        $response->assertOk()
            ->assertJsonStructure([
                'revenue' => ['revenue_today', 'revenue_week', 'revenue_month', 'mrr', 'arpu', 'by_category'],
                'funnel'  => ['total_requirements', 'lead_to_bid_rate', 'bid_to_award_rate', 'award_to_completion_rate'],
            ]);
    }
}
