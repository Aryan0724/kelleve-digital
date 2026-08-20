<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Role;
use App\Models\ProjectQuote;
use App\Models\JobApplication;
use App\Models\RfqQuotation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseInvariantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $district = District::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'state' => 'Bihar']);
        City::firstOrCreate(['slug' => 'patna'], ['name' => 'Patna', 'district_id' => $district->id]);
        Category::firstOrCreate(['slug' => 'interior-designer'], ['name' => 'Interior Designer']);

        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Worker']);
    }

    private function makeProject(int $userId): Requirement
    {
        return Requirement::create([
            'user_id'        => $userId,
            'title'          => 'Need 3BHK Design',
            'description'    => 'Looking for full home interior',
            'category_id'    => Category::first()->id,
            'city_id'        => City::first()->id,
            'district_id'    => District::first()->id,
            'city'           => 'Patna',
            'district'       => 'Patna',
            'project_type'   => 'residential',
            'name'           => 'John Doe',
            'phone'          => '9876543210',
            'status'         => 'open',
        ]);
    }

    /** INVARIANT 1: ProjectQuote always stores requirement_type = 'project', even if attacker supplies 'job' */
    public function test_project_quote_model_forces_requirement_type_to_project()
    {
        $user    = User::factory()->create();
        $pro     = User::factory()->create();
        $project = $this->makeProject($user->id);

        $quote = ProjectQuote::create([
            'requirement_id'   => $project->id,
            'professional_id'  => $pro->id,
            'amount'           => 500000,
            'timeline_days'    => 30,
            'proposal_message' => 'Valid quote',
            'requirement_type' => 'job', // malicious override — must be rejected
        ]);

        $raw = \DB::table('bids')->where('id', $quote->id)->first();
        $this->assertEquals('project', $raw->requirement_type, 'ProjectQuote must always persist requirement_type=project');
        $this->assertEquals('project', $quote->requirement_type);
    }

    /** INVARIANT 2: JobApplication always stores requirement_type = 'job', even if attacker supplies 'project' */
    public function test_job_application_model_forces_requirement_type_to_job()
    {
        $user   = User::factory()->create();
        $worker = User::factory()->create();
        $req    = $this->makeProject($user->id);

        $application = JobApplication::create([
            'requirement_id'   => $req->id,
            'professional_id'  => $worker->id,
            'amount'           => 10000,
            'timeline_days'    => 7,
            'proposal_message' => 'I can do this job',
            'requirement_type' => 'project', // malicious override — must be rejected
        ]);

        $raw = \DB::table('bids')->where('id', $application->id)->first();
        $this->assertEquals('job', $raw->requirement_type, 'JobApplication must always persist requirement_type=job');
        $this->assertEquals('job', $application->requirement_type);
    }

    /** INVARIANT 3: RfqQuotation always stores requirement_type = 'rfq', even if attacker supplies 'project' */
    public function test_rfq_quotation_model_forces_requirement_type_to_rfq()
    {
        $user     = User::factory()->create();
        $supplier = User::factory()->create();
        $req      = $this->makeProject($user->id);

        $quotation = RfqQuotation::create([
            'requirement_id'   => $req->id,
            'professional_id'  => $supplier->id,
            'amount'           => 50000,
            'timeline_days'    => 14,
            'proposal_message' => 'Supply quotation for materials',
            'requirement_type' => 'project', // malicious override — must be rejected
        ]);

        $raw = \DB::table('bids')->where('id', $quotation->id)->first();
        $this->assertEquals('rfq', $raw->requirement_type, 'RfqQuotation must always persist requirement_type=rfq');
        $this->assertEquals('rfq', $quotation->requirement_type);
    }
}
