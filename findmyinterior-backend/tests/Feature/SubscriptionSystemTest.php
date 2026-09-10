<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Listing;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Requirement;
use App\Models\WorkerJob;
use App\Models\Rfq;
use App\Models\VendorMetric;
use App\Services\EntitlementService;
use App\Services\RecommendationEngineService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SubscriptionSystemTest extends TestCase
{
    use DatabaseTransactions;

    protected EntitlementService $entitlement;

    protected function setUp(): void
    {
        parent::setUp();
        $this->entitlement = app(EntitlementService::class);
    }

    /**
     * Test Phase A: Exactly 4 canonical active plans exist in the database.
     */
    public function test_canonical_plans_migration(): void
    {
        $activePlans = SubscriptionPlan::where('is_active', true)
            ->where('is_archived', false)
            ->pluck('slug')
            ->toArray();

        sort($activePlans);
        $expected = ['elite', 'growth', 'professional', 'starter'];
        $this->assertEquals($expected, $activePlans);

        $elite = SubscriptionPlan::where('slug', 'elite')->first();
        $this->assertEquals(0, $elite->early_lead_access_hours);
        $this->assertEquals('elite', $elite->badge_type);
        $this->assertTrue((bool) $elite->is_featured_listing);
        $this->assertEquals(25, $elite->recommendation_score_boost);
    }

    /**
     * Test Phase B: Entitlement limits and badge types for canonical users.
     */
    public function test_entitlement_resolution(): void
    {
        $starterUser = User::where('email', 'fmi_test_starter@test.local')->first();
        $growthUser  = User::where('email', 'fmi_test_growth@test.local')->first();
        $proUser     = User::where('email', 'fmi_test_pro@test.local')->first();
        $eliteUser   = User::where('email', 'fmi_test_elite@test.local')->first();

        $this->assertEquals(1, $this->entitlement->getLimit($starterUser, 'max_listings'));
        $this->assertEquals(1, $this->entitlement->getLimit($growthUser, 'max_listings'));
        $this->assertEquals(3, $this->entitlement->getLimit($proUser, 'max_listings'));
        $this->assertEquals(5, $this->entitlement->getLimit($eliteUser, 'max_listings'));

        $this->assertEquals(5, $this->entitlement->getLimit($starterUser, 'max_gallery_images'));
        $this->assertEquals(15, $this->entitlement->getLimit($growthUser, 'max_gallery_images'));
        $this->assertEquals(30, $this->entitlement->getLimit($proUser, 'max_gallery_images'));
        $this->assertEquals(60, $this->entitlement->getLimit($eliteUser, 'max_gallery_images'));
    }

    /**
     * Test Phase C: Recommendation score boost belongs to the vendor being scored.
     */
    public function test_recommendation_boost_applies_to_professional(): void
    {
        $starterVendor = User::where('email', 'fmi_test_starter@test.local')->first();
        $eliteVendor   = User::where('email', 'fmi_test_elite@test.local')->first();

        $requirement = Requirement::first();
        $starterListing = Listing::where('user_id', $starterVendor->id)->first();
        $eliteListing   = Listing::where('user_id', $eliteVendor->id)->first();

        $service = app(RecommendationEngineService::class);
        $scoreStarter = $service->calculateScore($requirement, $starterListing, $starterVendor);
        $scoreElite   = $service->calculateScore($requirement, $eliteListing, $eliteVendor);

        $this->assertEquals(0, $scoreStarter['breakdown']['subscription_boost']);
        $this->assertEquals(25, $scoreElite['breakdown']['subscription_boost']);
        $this->assertGreaterThan($scoreStarter['score'], $scoreElite['score']);
    }

    /**
     * Test Phase F: Analytics Gating (Starter 403, Pro 200 summary, Elite 200 full).
     */
    public function test_analytics_gating(): void
    {
        $starterUser = User::where('email', 'fmi_test_starter@test.local')->first();
        $proUser     = User::where('email', 'fmi_test_pro@test.local')->first();
        $eliteUser   = User::where('email', 'fmi_test_elite@test.local')->first();

        // Starter -> 403
        $responseStarter = $this->actingAs($starterUser, 'sanctum')->getJson('/api/v1/user/analytics');
        $responseStarter->assertStatus(403)
            ->assertJsonPath('code', 'ANALYTICS_UPGRADE_REQUIRED');

        // Professional -> 200 with summary
        $responsePro = $this->actingAs($proUser, 'sanctum')->getJson('/api/v1/user/analytics');
        $responsePro->assertStatus(200)
            ->assertJsonPath('data.tier', 'summary')
            ->assertJsonPath('data.label', 'Profile Statistics');

        // Elite -> 200 with full
        $responseElite = $this->actingAs($eliteUser, 'sanctum')->getJson('/api/v1/user/analytics');
        $responseElite->assertStatus(200)
            ->assertJsonPath('data.tier', 'full')
            ->assertJsonPath('data.label', 'Comprehensive Analytics');
    }

    /**
     * Test Phase G: Competitor Insights (Elite only -> else 403).
     */
    public function test_competitor_insights_access(): void
    {
        $starterUser = User::where('email', 'fmi_test_starter@test.local')->first();
        $eliteUser   = User::where('email', 'fmi_test_elite@test.local')->first();

        $responseStarter = $this->actingAs($starterUser, 'sanctum')->getJson('/api/v1/user/competitor-insights');
        $responseStarter->assertStatus(403);

        $responseElite = $this->actingAs($eliteUser, 'sanctum')->getJson('/api/v1/user/competitor-insights');
        $responseElite->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'comparison_scope',
                    'your_stats',
                    'category_averages',
                    'your_rank',
                ]
            ]);
    }

    /**
     * Test Phase I & J: Dynamic Top-3 eligibility and Featured Homepage.
     */
    public function test_top3_spotlight_and_featured_homepage(): void
    {
        $eliteUser   = User::where('email', 'fmi_test_elite@test.local')->first();
        $proUser     = User::where('email', 'fmi_test_pro@test.local')->first();
        $starterUser = User::where('email', 'fmi_test_starter@test.local')->first();

        $listingElite   = Listing::where('user_id', $eliteUser->id)->first();
        $listingPro     = Listing::where('user_id', $proUser->id)->first();
        $listingStarter = Listing::where('user_id', $starterUser->id)->first();

        $resElite   = (new \App\Http\Resources\ListingResource($listingElite))->toArray(request());
        $resPro     = (new \App\Http\Resources\ListingResource($listingPro))->toArray(request());
        $resStarter = (new \App\Http\Resources\ListingResource($listingStarter))->toArray(request());

        $this->assertTrue($resElite['is_top3_eligible']);
        $this->assertTrue($resElite['is_spotlight_eligible']);

        $this->assertFalse($resPro['is_top3_eligible']);
        $this->assertTrue($resPro['is_spotlight_eligible']);

        $this->assertFalse($resStarter['is_top3_eligible']);
        $this->assertFalse($resStarter['is_spotlight_eligible']);

        // Featured homepage returns only active Elite listings
        $response = $this->getJson('/api/v1/listings/featured-homepage');
        $response->assertStatus(200);
        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertEquals('elite', $item['badge_type']);
        }
    }

    /**
     * Test Phase K: Responds Fast Badge requires Elite + >=5 responses + avg <= 120min.
     */
    public function test_responds_fast_badge(): void
    {
        $eliteUser = User::where('email', 'fmi_test_elite@test.local')->first();
        $proUser   = User::where('email', 'fmi_test_pro@test.local')->first();
        $starterUser = User::where('email', 'fmi_test_starter@test.local')->first();

        $this->assertTrue($this->entitlement->hasRespondsFastBadge($eliteUser));
        $this->assertFalse($this->entitlement->hasRespondsFastBadge($proUser));
        $this->assertFalse($this->entitlement->hasRespondsFastBadge($starterUser));
    }

    /**
     * Test Phase L: Admin Delete endpoints for Requirements, Worker Jobs, and RFQs.
     */
    public function test_admin_delete_endpoints(): void
    {
        $admin = User::whereHas('roles', fn($q) => $q->where('slug', 'admin'))->first();
        if (!$admin) {
            $admin = User::create([
                'name'        => 'Admin Test User',
                'email'       => 'admin_test_' . uniqid() . '@example.com',
                'password'    => bcrypt('password123'),
                'is_active'   => true,
                'is_verified' => true,
            ]);
            $adminRole = \App\Models\Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // Create disposable requirement
        $req = Requirement::create([
            'user_id'      => $admin->id,
            'title'        => 'Disposable Requirement For Test',
            'description'  => 'Disposable requirement description for delete test',
            'project_type' => 'Residential',
            'category_id'  => 1,
            'city'         => 'Patna',
            'district'     => 'Patna',
            'status'       => 'open',
            'phone'        => '9999999999',
            'name'         => 'Admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/requirements/{$req->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('projects', ['id' => $req->id]);

        // Create disposable worker job
        $job = WorkerJob::create([
            'user_id'     => $admin->id,
            'title'       => 'Disposable Job For Test',
            'description' => 'Disposable job description for delete test',
            'category_id' => 1,
            'city'        => 'Patna',
            'district'    => 'Patna',
            'status'      => 'open',
            'phone'       => '9999999999',
        ]);

        $responseJob = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/worker-jobs/{$job->id}");
        $responseJob->assertStatus(200);
        $this->assertDatabaseMissing('worker_jobs', ['id' => $job->id]);

        // Create disposable RFQ
        $rfq = Rfq::create([
            'user_id'     => $admin->id,
            'title'       => 'Disposable RFQ For Test',
            'description' => 'Disposable RFQ description for delete test',
            'category_id' => 1,
            'city'        => 'Patna',
            'district'    => 'Patna',
            'status'      => 'open',
            'phone'       => '9999999999',
        ]);

        $responseRfq = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/rfqs/{$rfq->id}");
        $responseRfq->assertStatus(200);
        $this->assertDatabaseMissing('rfqs', ['id' => $rfq->id]);
    }
}
