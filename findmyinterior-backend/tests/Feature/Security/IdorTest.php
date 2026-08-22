<?php

namespace Tests\Feature\Security;

use App\Models\User;
use App\Models\Listing;
use App\Models\ListingGallery;
use Illuminate\Support\Facades\DB;

/**
 * SEC-PHASE-1: IDOR & Ownership Boundary Tests
 *
 * Each test proves that User A cannot act on resources owned by User B.
 * Tests are adversarial: they attempt the unauthorized action and assert
 * it is blocked AND that the data is unmodified in the database.
 *
 * Status vocabulary: DISCOVERED → FIXED → TESTED → VERIFIED
 *
 * FINDING NOTES:
 * - Several controllers use implicit ownership via query scope (WHERE user_id = X)
 *   combined with findOrFail(). This returns 404 for cross-user access.
 *   This is resource-hiding behavior. Our tests verify no mutation occurs.
 */
class IdorTest extends SecurityTestCase
{
    // -------------------------------------------------------------------------
    // Helper: create a user and assign a role via pivot (not 'role' column)
    // -------------------------------------------------------------------------
    private function makeUser(string $roleSlug = 'homeowner'): User
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
            $user->update(['primary_role_id' => $role->id]);
        }
        return $user;
    }

    /**
     * Create a user who can submit project quotes (isBusiness() === true).
     * The 'business' role slug satisfies User::isBusiness().
     */
    private function makeBusinessUser(): User
    {
        return $this->makeUser('business');
    }

    // -------------------------------------------------------------------------
    // Listings: SEC-001, SEC-002
    // -------------------------------------------------------------------------

    /**
     * SEC-001 — VERIFIED
     * User cannot update another user's listing.
     * Returns 404 (resource hidden via ownership scope). No mutation occurs.
     */
    public function test_user_cannot_update_another_users_listing()
    {
        $victim  = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $victim->id, 'title' => 'Victim Listing']);

        $attacker = User::factory()->create();

        $response = $this->actingAs($attacker, 'sanctum')
            ->putJson("/api/v1/user/listings/{$listing->id}", ['title' => 'Hacked Title']);

        // 404: listing is hidden from attacker's ownership scope
        $response->assertStatus(404);
        $this->assertEquals('Victim Listing', $listing->fresh()->title, 'SEC-001 VIOLATED: Listing was mutated by unauthorized user');
    }

    /**
     * SEC-002 — VERIFIED
     * User cannot delete another user's listing gallery image.
     * Returns 404 (parent listing hidden via ownership scope). No deletion occurs.
     */
    public function test_user_cannot_delete_another_users_listing_gallery_image()
    {
        $victim  = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $victim->id]);
        $gallery = ListingGallery::create([
            'listing_id' => $listing->id,
            'image_url'  => 'test.jpg',
        ]);

        $attacker = User::factory()->create();

        $response = $this->actingAs($attacker, 'sanctum')
            ->deleteJson("/api/v1/user/listings/{$listing->id}/gallery/{$gallery->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('listing_galleries', ['id' => $gallery->id]);
    }

    // -------------------------------------------------------------------------
    // Ventures: SEC-003
    // -------------------------------------------------------------------------

    /**
     * SEC-003 — VERIFIED
     * User cannot delete another user's venture.
     * VentureController uses raw DB with WHERE user_id = auth_id.
     * Returns 404 (resource hidden). No deletion occurs.
     */
    public function test_user_cannot_delete_another_users_venture()
    {
        $victim    = User::factory()->create();
        $ventureId = DB::table('ventures')->insertGetId([
            'user_id'           => $victim->id,
            'name'              => 'Victim Venture',
            'professional_type' => 'architect',
            'broad_role'        => 'professional',
            'status'            => 'active',
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        $attacker = User::factory()->create();

        $response = $this->actingAs($attacker, 'sanctum')
            ->deleteJson("/api/v1/user/ventures/{$ventureId}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('ventures', ['id' => $ventureId, 'deleted_at' => null]);
    }

    // -------------------------------------------------------------------------
    // Projects: SEC-004, SEC-005
    // Created via API (no factory) to match real application flow.
    // -------------------------------------------------------------------------

    /**
     * SEC-004 — TESTED
     * Homeowner cannot update another homeowner's project.
     * Must return 403 or 404 — never 200 with mutated data.
     */
    public function test_user_cannot_update_another_users_project()
    {
        $victim  = $this->makeUser('homeowner');

        // Create project as victim via API
        $createRes = $this->actingAs($victim, 'sanctum')->postJson('/api/v1/projects', [
            'title'            => 'Victim Project',
            'description'      => 'Should not be hackable',
            'budget_min'       => 50000,
            'budget_max'       => 200000,
            'city'             => 'Patna',
            'district'         => 'Patna',
            'requirement_type' => 'HOME_INTERIOR',
            'opportunity_type' => 'HOME_INTERIOR',
        ]);
        $projectId = $createRes->json('data.id');
        $this->assertNotNull($projectId, 'SEC-004 setup: victim project was not created');

        // Now attacker tries to update it
        $attacker = $this->makeUser('homeowner');
        $response = $this->actingAs($attacker, 'sanctum')
            ->putJson("/api/v1/projects/{$projectId}", ['title' => 'HACKED']);

        // Must be 403 or 404 — never 200
        $this->assertContains($response->status(), [403, 404],
            "SEC-004 VIOLATED: Attacker received HTTP {$response->status()} on victim's project update");

        // Verify no mutation in DB
        $projectTitle = DB::table('projects')->where('id', $projectId)->value('title');
        $this->assertEquals('Victim Project', $projectTitle, 'SEC-004 VIOLATED: Project was mutated by attacker');
    }

    /**
     * SEC-005 — TESTED
     * Homeowner cannot award a bid on another homeowner's project.
     */
    public function test_user_cannot_award_bid_on_another_users_project()
    {
        $victim  = $this->makeUser('homeowner');

        // Create project as victim
        $createRes = $this->actingAs($victim, 'sanctum')->postJson('/api/v1/projects', [
            'title'            => 'Victim Award Project',
            'description'      => 'Award test',
            'budget_min'       => 50000,
            'budget_max'       => 200000,
            'city'             => 'Patna',
            'district'         => 'Patna',
            'requirement_type' => 'HOME_INTERIOR',
            'opportunity_type' => 'HOME_INTERIOR',
        ]);
        $projectId = $createRes->json('data.id');
        $this->assertNotNull($projectId, 'SEC-005 setup: victim project was not created');

        // Professional submits a quote
        $professional = $this->makeBusinessUser();
        $quoteRes     = $this->actingAs($professional, 'sanctum')->postJson("/api/v1/projects/{$projectId}/quotes", [
            'amount'           => 100000,
            'estimated_cost'   => 100000,
            'proposal_message' => 'I can do this.',
            'timeline_days'    => 30,
        ]);
        $quoteId = $quoteRes->json('data.id');

        if (!$quoteId) {
            $this->markTestSkipped('SEC-005: Could not create quote — skipping award test');
        }

        // Attacker (different homeowner) tries to award the quote
        $attacker = $this->makeUser('homeowner');
        $response = $this->actingAs($attacker, 'sanctum')
            ->patchJson("/api/v1/projects/{$projectId}/quotes/{$quoteId}/award");

        $this->assertContains($response->status(), [403, 404],
            "SEC-005 VIOLATED: Attacker received HTTP {$response->status()} awarding bid on victim's project");

        // Verify quote status unchanged
        $quoteStatus = DB::table('bids')->where('id', $quoteId)->value('status');
        $this->assertNotEquals('accepted', $quoteStatus, 'SEC-005 VIOLATED: Bid was awarded by unauthorized attacker');
    }

    // -------------------------------------------------------------------------
    // Unauthenticated: SEC-006
    // -------------------------------------------------------------------------

    /**
     * SEC-006 — VERIFIED
     * Unauthenticated user cannot update any listing.
     */
    public function test_unauthenticated_cannot_update_listing()
    {
        $victim  = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $victim->id, 'title' => 'Safe Listing']);

        $response = $this->putJson("/api/v1/user/listings/{$listing->id}", ['title' => 'Hacked']);

        $response->assertStatus(401);
        $this->assertEquals('Safe Listing', $listing->fresh()->title, 'SEC-006 VIOLATED: Listing was mutated without authentication');
    }
}
