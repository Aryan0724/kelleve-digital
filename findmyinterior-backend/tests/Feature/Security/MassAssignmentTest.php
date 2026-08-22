<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Tests\Feature\Security\SecurityTestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\WorkerJob;
use App\Models\Rfq;
use App\Models\Requirement;

/**
 * Phase 4: Payload & Input Security Sweep (Mass Assignment)
 * Verifies that users cannot mass-assign restricted fields like user_id, status, etc.
 */
class MassAssignmentTest extends SecurityTestCase
{
    use DatabaseTruncation;
    protected $seeder = \Database\Seeders\SecurityTestSeeder::class;

    private function makeUser(string $roleSlug = 'homeowner'): User
    {
        $user = User::factory()->create();
        $role = Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
            $user->update(['primary_role_id' => $role->id]);
        }
        return $user;
    }

    public function test_attacker_cannot_hijack_worker_job_via_mass_assignment()
    {
        $victim = $this->makeUser('builder');
        $attacker = $this->makeUser('homeowner'); // Or builder

        $job = WorkerJob::create([
            'user_id' => $victim->id,
            'title' => 'Victim Job',
            'description' => 'Test',
            'city' => 'Patna',
            'district' => 'Patna',
            'status' => 'posted'
        ]);

        // Attacker is NOT the owner. So if they PUT to the job... wait, the IDOR check in JobController 
        // stops the attacker from calling PUT on someone else's job entirely (403).
        // 
        // The real danger is the VICTIM themselves changing the status directly to 'completed'
        // or a malicious user creating a job and setting user_id to someone else,
        // or changing the worker_id to themselves.
        // Let's test the owner updating their own job and trying to change the worker_id or status.

        $response = $this->actingAs($victim, 'sanctum')->putJson("/api/v1/worker-jobs/{$job->id}", [
            'title' => 'Updated Job',
            'worker_id' => $attacker->id, // Trying to assign a worker via mass assignment
            'user_id' => $attacker->id, // Trying to transfer ownership
            'status' => 'completed' // Trying to complete it outside the workflow
        ]);

        $response->assertStatus(200);

        $job->refresh();
        $this->assertEquals('Updated Job', $job->title, 'Normal fields should update');
        
        $this->assertEquals($victim->id, $job->user_id, 'SEC-010 VIOLATED: user_id was mass-assigned');
        $this->assertNull($job->worker_id, 'SEC-010 VIOLATED: worker_id was mass-assigned');
        $this->assertEquals('posted', $job->status, 'SEC-010 VIOLATED: status was mass-assigned');
    }

    public function test_attacker_cannot_hijack_rfq_via_mass_assignment()
    {
        $victim = $this->makeUser('homeowner');
        $attacker = $this->makeUser('supplier');

        $rfq = Rfq::create([
            'user_id' => $victim->id,
            'title' => 'Victim RFQ',
            'description' => 'Test',
            'city' => 'Patna',
            'district' => 'Patna',
            'status' => 'posted'
        ]);

        $response = $this->actingAs($victim, 'sanctum')->putJson("/api/v1/rfqs/{$rfq->id}", [
            'title' => 'Updated RFQ',
            'supplier_id' => $attacker->id,
            'user_id' => $attacker->id,
            'status' => 'completed'
        ]);

        $response->assertStatus(200);

        $rfq->refresh();
        $this->assertEquals('Updated RFQ', $rfq->title, 'Normal fields should update');
        
        $this->assertEquals($victim->id, $rfq->user_id, 'SEC-011 VIOLATED: user_id was mass-assigned');
        $this->assertNull($rfq->supplier_id, 'SEC-011 VIOLATED: supplier_id was mass-assigned');
        $this->assertEquals('posted', $rfq->status, 'SEC-011 VIOLATED: status was mass-assigned');
    }

    public function test_attacker_cannot_hijack_project_via_mass_assignment()
    {
        $victim = $this->makeUser('homeowner');
        $attacker = $this->makeUser('interior_designer');

        $project = Requirement::factory()->create([
            'user_id' => $victim->id,
            'title' => 'Victim Project',
            'description' => 'Test',
            'city' => 'Patna',
            'district' => 'Patna',
            'status' => 'open'
        ]);

        $response = $this->actingAs($victim, 'sanctum')->putJson("/api/v1/projects/{$project->id}", [
            'title' => 'Updated Project',
            'professional_id' => $attacker->id,
            'user_id' => $attacker->id,
            'status' => 'completed'
        ]);

        $response->assertStatus(200);

        $project->refresh();
        $this->assertEquals('Updated Project', $project->title, 'Normal fields should update');
        
        $this->assertEquals($victim->id, $project->user_id, 'SEC-012 VIOLATED: user_id was mass-assigned');
        $this->assertNull($project->professional_id, 'SEC-012 VIOLATED: professional_id was mass-assigned');
        $this->assertEquals('open', $project->status, 'SEC-012 VIOLATED: status was mass-assigned');
    }
}
