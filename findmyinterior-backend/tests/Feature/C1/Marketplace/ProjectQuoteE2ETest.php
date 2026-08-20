<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\ProjectQuote;
use App\Services\ProjectQuoteService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * End-to-end test for the canonical Project Quote flow:
 *
 *   Homeowner posts project (open)
 *     → Professional submits quote via POST /projects/{id}/quotes
 *     → Quote appears in project quotes
 *     → Homeowner awards via PATCH /projects/{id}/quotes/{q}/award
 *     → Project status becomes 'awarded' (not 'closed')
 *     → All other quotes become 'rejected'
 *
 * State machine source: C1-API-Audit-Matrix.md §1.A
 *   Open → (Award) → Awarded
 */
class ProjectQuoteE2ETest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'homeowner'], ['name' => 'Homeowner']);
    }

    private function makeOpenProject(User $homeowner): Requirement
    {
        return Requirement::create([
            'user_id'        => $homeowner->id,
            'title'          => '3BHK Full Home Interior',
            'description'    => 'Modern minimalist interior for 3BHK flat',
            'category_id'    => Category::first()->id,
            'city_id'        => City::first()->id,
            'district_id'    => District::first()->id,
            'city'           => 'Patna',
            'district'       => 'Patna',
            'project_type'   => 'residential',
            'name'           => 'Jane Homeowner',
            'phone'          => '9876543210',
            'status'         => 'open',
        ]);
    }

    /**
     * GOLDEN FLOW: Project Quote end-to-end
     */
    public function test_canonical_project_quote_e2e_flow()
    {
        // ── Step 1: Setup actors ──────────────────────────────────────────
        $homeowner = User::factory()->create();
        $pro1      = User::factory()->create();
        $pro2      = User::factory()->create();

        // ── Step 2: Homeowner has an open project ─────────────────────────
        $project = $this->makeOpenProject($homeowner);
        $this->assertEquals('open', $project->status, 'Project must start as open');

        // ── Step 3: Professional 1 submits quote via new canonical route ──
        $response = $this->actingAs($pro1)
            ->postJson("/api/v1/projects/{$project->id}/quotes", [
                'amount'           => 500000,
                'estimated_cost'   => 500000,
                'proposal_message' => 'I specialize in modern minimalist interiors.',
                'timeline_days'    => 45,
            ]);

        $response->assertStatus(201);
        $quote1Id = $response->json('data.id');
        $this->assertNotNull($quote1Id, 'Quote 1 must be created with an ID');

        // ── Step 4: Professional 2 also submits a quote ───────────────────
        $response2 = $this->actingAs($pro2)
            ->postJson("/api/v1/projects/{$project->id}/quotes", [
                'amount'           => 480000,
                'estimated_cost'   => 480000,
                'proposal_message' => 'Budget-friendly option with premium materials.',
                'timeline_days'    => 60,
            ]);

        $response2->assertStatus(201);
        $quote2Id = $response2->json('data.id');

        // Confirm both quotes are 'pending'
        $this->assertEquals('pending', ProjectQuote::find($quote1Id)->status);
        $this->assertEquals('pending', ProjectQuote::find($quote2Id)->status);

        // ── Step 5: Homeowner awards Quote 1 ──────────────────────────────
        $awardResponse = $this->actingAs($homeowner)
            ->patchJson("/api/v1/projects/{$project->id}/quotes/{$quote1Id}/award");

        $awardResponse->assertStatus(200);

        // ── Step 6: Verify canonical state machine transitions ─────────────
        $project->refresh();

        // CRITICAL: State machine says Open → Award → Awarded (NOT 'closed')
        $this->assertEquals('awarded', $project->status,
            'Project status must be "awarded" after quote is accepted. ' .
            'Source: C1-API-Audit-Matrix.md §1.A: Open → (Award) → Awarded');

        // Awarded quote must be 'accepted'
        $this->assertEquals('accepted', ProjectQuote::find($quote1Id)->status,
            'Awarded quote must have status = accepted');

        // All other quotes must be 'rejected' atomically
        $this->assertEquals('rejected', ProjectQuote::find($quote2Id)->status,
            'Non-awarded quotes must be rejected atomically on award');
    }

    /**
     * NEGATIVE: Homeowner cannot award a quote on someone else's project
     */
    public function test_only_project_owner_can_award()
    {
        $homeowner = User::factory()->create();
        $interloper = User::factory()->create();
        $pro = User::factory()->create();

        $project = $this->makeOpenProject($homeowner);

        $this->actingAs($pro)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 300000,
            'estimated_cost'   => 300000,
            'proposal_message' => 'Quote from pro',
            'timeline_days'    => 30,
        ])->assertStatus(201);

        $quoteId = ProjectQuote::where('requirement_id', $project->id)->first()->id;

        // Interloper tries to award — must be 403
        $this->actingAs($interloper)
            ->patchJson("/api/v1/projects/{$project->id}/quotes/{$quoteId}/award")
            ->assertStatus(403);

        // Project must still be open
        $this->assertEquals('open', $project->fresh()->status);
    }

    /**
     * NEGATIVE: Cannot submit a quote to an already-awarded project
     */
    public function test_cannot_submit_quote_to_awarded_project()
    {
        $homeowner = User::factory()->create();
        $pro1 = User::factory()->create();
        $pro2 = User::factory()->create();

        $project = $this->makeOpenProject($homeowner);

        // Pro1 submits and gets awarded
        $this->actingAs($pro1)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 400000,
            'estimated_cost'   => 400000,
            'proposal_message' => 'First quote',
            'timeline_days'    => 30,
        ])->assertStatus(201);

        $quoteId = ProjectQuote::where('requirement_id', $project->id)->first()->id;

        $this->actingAs($homeowner)
            ->patchJson("/api/v1/projects/{$project->id}/quotes/{$quoteId}/award")
            ->assertStatus(200);

        // Pro2 tries to quote on an already-awarded project — must be rejected
        $this->actingAs($pro2)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 350000,
            'estimated_cost'   => 350000,
            'proposal_message' => 'Late quote attempt',
            'timeline_days'    => 25,
        ])->assertStatus(403); // Service rejects: project not 'open'
    }
}
