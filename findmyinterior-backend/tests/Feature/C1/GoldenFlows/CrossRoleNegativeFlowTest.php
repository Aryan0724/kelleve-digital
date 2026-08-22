<?php

namespace Tests\Feature\C1\GoldenFlows;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\User;
use App\Models\Role;
use App\Models\Listing;
use App\Models\OpportunityType;

class CrossRoleNegativeFlowTest extends GoldenFlowTestCase
{
    private function makeWorker(): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'worker'], ['name' => 'Worker']);
        $user->roles()->attach($role->id);
        return $user;
    }

    private function makeHomeowner(): User
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']);
        $user->roles()->attach($role->id);
        return $user;
    }

    public function test_homeowner_cannot_apply_for_job()
    {
        // First we need a job. We can skip creating it and just assert authorization failure
        $homeowner = $this->makeHomeowner();
        $this->actingAs($homeowner);

        // Homeowner applying for a job should get 403 before even validating the job ID
        $res = $this->postJson('/api/v1/worker-jobs/999/apply', [
            'proposal_message' => 'I am available',
            'amount' => 4000,
            'estimated_cost' => 4000,
            'timeline_days' => 10,
        ]);
        
        $res->assertStatus(403);
    }
}
