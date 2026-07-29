<?php

namespace Tests\Feature\Truedial;

use App\Models\Listing;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewModuleTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;

    protected function setUp(): void
    {
        parent::setUp();
        // Set tenant context for tenant-aware models
        $this->tenant = \App\Models\Tenant::firstOrCreate(
            ['slug' => 'test-tenant'],
            [
                'id' => 1,
                'name' => 'Test Tenant',
                'domain' => 'test.localhost',
            ]
        );
    }

    public function test_customer_can_create_review()
    {
        $vendor = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $vendor->id, 'tenant_id' => $this->tenant->id, 'status' => 'active', 'slug' => 'test-slug']);
        $customer = User::factory()->create();

        $response = $this->actingAs($customer)
                         ->withHeader('X-Tenant-ID', $this->tenant->id)
                         ->postJson("/api/v1/truedial/user/businesses/{$listing->slug}/reviews", [
            'rating' => 5,
            'title' => 'Great business!',
            'body' => 'Highly recommended.'
        ]);

        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200)
                 ->assertJsonPath('data.rating', 5)
                 ->assertJsonPath('data.title', 'Great business!');

        $this->assertDatabaseHas('reviews', [
            'listing_id' => $listing->id,
            'user_id' => $customer->id,
            'rating' => 5,
            'status' => 'approved' // Because in MVP we auto-approved
        ]);
    }

    public function test_customer_cannot_review_own_business()
    {
        $vendor = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $vendor->id, 'tenant_id' => $this->tenant->id, 'status' => 'active', 'slug' => 'test-slug-2']);

        $response = $this->actingAs($vendor)
                         ->withHeader('X-Tenant-ID', $this->tenant->id)
                         ->postJson("/api/v1/truedial/user/businesses/{$listing->slug}/reviews", [
            'rating' => 5,
            'title' => 'My business',
            'body' => 'Is great'
        ]);

        if ($response->status() !== 403) {
            dump($response->json());
        }

        $response->assertStatus(403);
    }

    public function test_vendor_can_reply_to_review()
    {
        $vendor = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $vendor->id, 'tenant_id' => $this->tenant->id, 'status' => 'active', 'slug' => 'test-slug-3']);
        $customer = User::factory()->create();

        $review = Review::factory()->create([
            'listing_id' => $listing->id,
            'reviewable_id' => $listing->id,
            'reviewable_type' => \App\Models\Listing::class,
            'user_id' => $customer->id,
            'reviewer_id' => $customer->id,
            'tenant_id' => $this->tenant->id,
            'rating' => 4,
            'status' => 'approved'
        ]);

        $response = $this->actingAs($vendor)
                         ->withHeader('X-Tenant-ID', $this->tenant->id)
                         ->postJson("/api/v1/truedial/vendor/reviews/{$review->id}/reply", [
            'body' => 'Thank you for the review!'
        ]);

        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200)
                 ->assertJsonPath('data.body', 'Thank you for the review!');

        $this->assertDatabaseHas('review_replies', [
            'review_id' => $review->id,
            'user_id' => $vendor->id,
            'body' => 'Thank you for the review!'
        ]);
    }

    public function test_vendor_can_report_review()
    {
        $vendor = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $vendor->id, 'tenant_id' => $this->tenant->id, 'status' => 'active', 'slug' => 'test-slug-4']);
        $customer = User::factory()->create();

        $review = Review::factory()->create([
            'listing_id' => $listing->id,
            'reviewable_id' => $listing->id,
            'reviewable_type' => \App\Models\Listing::class,
            'user_id' => $customer->id,
            'reviewer_id' => $customer->id,
            'tenant_id' => $this->tenant->id,
            'rating' => 1,
            'status' => 'approved'
        ]);

        $response = $this->actingAs($vendor)
                         ->withHeader('X-Tenant-ID', $this->tenant->id)
                         ->postJson("/api/v1/truedial/vendor/reviews/{$review->id}/report", [
            'reason' => 'Spam',
            'notes' => 'This is a spam review'
        ]);

        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200);

        $this->assertDatabaseHas('review_reports', [
            'review_id' => $review->id,
            'user_id' => $vendor->id,
            'reason' => 'Spam',
        ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'status' => 'flagged' // According to ReviewService logic
        ]);
    }
}
