<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\ProjectQuote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * End-to-end test for the canonical Project Quote flow:
 *
 *   Homeowner posts project (open)
 *     → Professional submits quote via POST /api/v1/projects/{id}/quotes
 *     → Quote appears in project quotes
 *     → Homeowner awards via PATCH /api/v1/projects/{id}/quotes/{q}/award
 *     → Project status becomes 'awarded' (canonical state machine)
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

        Role::firstOrCreate(['slug' => 'business'],  ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'customer'],  ['name' => 'Customer']);
        Role::firstOrCreate(['slug' => 'homeowner'], ['name' => 'Homeowner']);
    }

    private function makeHomeowner(): User
    {
        $user = User::factory()->create();
        // homeowner/customer role — cannot bid
        $role = Role::where('slug', 'customer')->first() ?? Role::where('slug', 'homeowner')->first();
        if ($role) $user->roles()->attach($role);
        return $user;
    }

    private function makeProfessional(): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('slug', 'business')->first());
        return $user;
    }

    private function makeOpenProject(User $homeowner): Requirement
    {
        return Requirement::create([
            'user_id'      => $homeowner->id,
            'title'        => '3BHK Full Home Interior',
            'description'  => 'Modern minimalist interior for 3BHK flat',
            'category_id'  => Category::first()->id,
            'city_id'      => City::first()->id,
            'district_id'  => District::first()->id,
            'city'         => 'Patna',
            'district'     => 'Patna',
            'project_type' => 'residential',
            'name'         => 'Jane Homeowner',
            'phone'        => '9876543210',
            'status'       => 'open',
        ]);
    }

    /**
     * GOLDEN FLOW: Full canonical Project Quote lifecycle
     *   open → quote → award → awarded, others rejected
     */
    public function test_canonical_project_quote_e2e_flow()
    {
        $homeowner = $this->makeHomeowner();
        $pro1      = $this->makeProfessional();
        $pro2      = $this->makeProfessional();

        // ── 1: Project starts open ────────────────────────────────────────
        $project = $this->makeOpenProject($homeowner);
        $this->assertEquals('open', $project->status);

        // ── 2: Pro1 submits quote via canonical route ─────────────────────
        $r1 = $this->actingAs($pro1)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 500000,
            'estimated_cost'   => 500000,
            'proposal_message' => 'I specialize in modern minimalist interiors.',
            'timeline_days'    => 45,
        ]);
        $r1->assertStatus(201);
        $quote1Id = $r1->json('data.id');
        $this->assertNotNull($quote1Id);

        // ── 3: Pro2 submits competing quote ──────────────────────────────
        $r2 = $this->actingAs($pro2)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 480000,
            'estimated_cost'   => 480000,
            'proposal_message' => 'Budget-friendly option with premium materials.',
            'timeline_days'    => 60,
        ]);
        $r2->assertStatus(201);
        $quote2Id = $r2->json('data.id');

        // Both quotes start as pending
        $this->assertEquals('pending', ProjectQuote::find($quote1Id)->status);
        $this->assertEquals('pending', ProjectQuote::find($quote2Id)->status);

        // ── 4: Homeowner awards Quote 1 ───────────────────────────────────
        $award = $this->actingAs($homeowner)
            ->patchJson("/api/v1/projects/{$project->id}/quotes/{$quote1Id}/award");
        $award->assertStatus(200);

        // ── 5: Verify canonical state machine ─────────────────────────────
        $project->refresh();
        // State machine: Open → Award → Awarded (NOT 'closed')
        $this->assertEquals('awarded', $project->status,
            'Project must be "awarded" after quote accepted. ' .
            'Ref: C1-API-Audit-Matrix.md §1.A: Open → (Award) → Awarded');

        $this->assertEquals('accepted', ProjectQuote::find($quote1Id)->status,
            'Awarded quote must be accepted');

        $this->assertEquals('rejected', ProjectQuote::find($quote2Id)->status,
            'Non-awarded quotes must be rejected atomically');
    }

    /**
     * NEGATIVE: Only project owner can award
     */
    public function test_only_project_owner_can_award()
    {
        $homeowner  = $this->makeHomeowner();
        $interloper = $this->makeProfessional();
        $pro        = $this->makeProfessional();
        $project    = $this->makeOpenProject($homeowner);

        $this->actingAs($pro)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 300000,
            'estimated_cost'   => 300000,
            'proposal_message' => 'Quote from pro',
            'timeline_days'    => 30,
        ])->assertStatus(201);

        $quoteId = ProjectQuote::where('requirement_id', $project->id)->first()->id;

        // Interloper cannot award another homeowner's project
        $this->actingAs($interloper)
            ->patchJson("/api/v1/projects/{$project->id}/quotes/{$quoteId}/award")
            ->assertStatus(403);

        // Project still open
        $this->assertEquals('open', $project->fresh()->status);
    }

    /**
     * NEGATIVE: Cannot quote on already-awarded project
     */
    public function test_cannot_submit_quote_to_awarded_project()
    {
        $homeowner = $this->makeHomeowner();
        $pro1      = $this->makeProfessional();
        $pro2      = $this->makeProfessional();
        $project   = $this->makeOpenProject($homeowner);

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

        // Pro2 quotes AFTER award — must be rejected (project now 'awarded', not 'open')
        $this->actingAs($pro2)->postJson("/api/v1/projects/{$project->id}/quotes", [
            'amount'           => 350000,
            'estimated_cost'   => 350000,
            'proposal_message' => 'Late quote attempt',
            'timeline_days'    => 25,
        ])->assertStatus(403);
    }
}
