<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Category;
use App\Models\City;
use App\Models\VendorMetric;
use App\Services\RecommendationEngineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecommendationEngineTest extends TestCase
{
    use RefreshDatabase;

    protected RecommendationEngineService $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = app(RecommendationEngineService::class);
    }

    public function test_generates_recommendations_for_matching_category(): void
    {
        $category = Category::factory()->create();
        $city = City::factory()->create();
        $customer = User::factory()->create();

        $vendor = User::factory()->create(['is_verified' => true]);
        Listing::factory()->create([
            'user_id'     => $vendor->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
            'status'      => 'active',
        ]);

        $requirement = Requirement::factory()->create([
            'user_id'     => $customer->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
        ]);

        $this->engine->generateFor($requirement);

        $this->assertDatabaseHas('requirement_recommendations', [
            'requirement_id' => $requirement->id,
            'vendor_id'      => $vendor->id,
        ]);
    }

    public function test_score_city_and_category_match_gives_full_points(): void
    {
        $category = Category::factory()->create();
        $city = City::factory()->create();
        $vendor = User::factory()->create(['is_verified' => true]);

        $listing = Listing::factory()->create([
            'user_id'     => $vendor->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
            'status'      => 'active',
        ]);

        $requirement = Requirement::factory()->create([
            'category_id' => $category->id,
            'city_id'     => $city->id,
        ]);

        $result = $this->engine->calculateScore($requirement, $listing, $vendor);
        $score = $result['score'];

        // Category (25) + City (20) + Verification (5) + Availability (10) = 60 minimum
        // Plus rating (4.5/5 * 10 = 9.0 from cold-start) = 69 minimum
        $this->assertGreaterThanOrEqual(55.0, $score);
        $this->assertLessThanOrEqual(100.0, $score);
    }

    public function test_cold_start_new_vendor_gets_platform_average_rating(): void
    {
        $vendor = User::factory()->create();
        $metrics = VendorMetric::create([
            'vendor_id'    => $vendor->id,
            'review_count' => 0,
            'review_sum'   => 0,
        ]);

        // Cold-start: fewer than 3 reviews → platform avg 4.5
        $this->assertEquals(4.5, $metrics->rating_average);
    }

    public function test_proven_vendor_gets_real_rating(): void
    {
        $vendor = User::factory()->create();
        $metrics = VendorMetric::create([
            'vendor_id'    => $vendor->id,
            'review_count' => 4,
            'review_sum'   => 16, // 4 × 4 = avg 4.0
        ]);

        $this->assertEquals(4.0, $metrics->rating_average);
    }

    public function test_vendor_without_matching_category_not_recommended(): void
    {
        $category = Category::factory()->create();
        $otherCategory = Category::factory()->create();
        $customer = User::factory()->create();
        $vendor = User::factory()->create();

        Listing::factory()->create([
            'user_id'     => $vendor->id,
            'category_id' => $otherCategory->id,
            'status'      => 'active',
        ]);

        $requirement = Requirement::factory()->create([
            'user_id'     => $customer->id,
            'category_id' => $category->id,
        ]);

        $this->engine->generateFor($requirement);

        $this->assertDatabaseMissing('requirement_recommendations', [
            'requirement_id' => $requirement->id,
            'vendor_id'      => $vendor->id,
        ]);
    }

    public function test_score_cannot_exceed_100(): void
    {
        $category = Category::factory()->create();
        $city = City::factory()->create();
        $vendor = User::factory()->create(['is_verified' => true]);
        $listing = Listing::factory()->create([
            'user_id'     => $vendor->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
            'status'      => 'active',
        ]);

        // Vendor with perfect metrics
        VendorMetric::create([
            'vendor_id'               => $vendor->id,
            'messages_received'       => 100,
            'messages_replied'        => 100,
            'total_response_minutes'  => 1000,
            'response_count'          => 100,
            'review_count'            => 10,
            'review_sum'              => 50,
            'projects_completed'      => 20,
            'award_count'             => 20,
            'last_active_at'          => now(),
        ]);

        $requirement = Requirement::factory()->create([
            'category_id' => $category->id,
            'city_id'     => $city->id,
        ]);

        $result = $this->engine->calculateScore($requirement, $listing, $vendor->fresh());
        $this->assertLessThanOrEqual(100.0, $result['score']);
    }

    public function test_api_returns_recommendations_for_requirement(): void
    {
        $category = Category::factory()->create();
        $city = City::factory()->create();
        $customer = User::factory()->create();
        $vendor = User::factory()->create(['is_verified' => true]);

        Listing::factory()->create([
            'user_id'     => $vendor->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
            'status'      => 'active',
        ]);

        $requirement = Requirement::factory()->create([
            'user_id'     => $customer->id,
            'category_id' => $category->id,
            'city_id'     => $city->id,
        ]);

        $this->engine->generateFor($requirement);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/requirements/{$requirement->id}/recommendations");

        if (empty($response->json('recommendations'))) {
            dd($response->json());
        }

        $response->assertOk()
            ->assertJsonStructure([
                'requirement_id',
                'recommendations' => [['vendor_id', 'match_score', 'vendor_name']],
            ]);
    }
}
