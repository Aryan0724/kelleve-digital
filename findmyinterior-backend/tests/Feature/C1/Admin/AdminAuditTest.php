<?php

namespace Tests\Feature\C1\Admin;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AdminAuditTest extends TestCase
{
    protected function tearDown(): void
    {
        ActivityLog::truncate();
        User::where('id', '>', 0)->delete();
        parent::tearDown();
    }

    public function test_audit_logs_are_immutable()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $log = ActivityLog::recordAdminAction(
            $admin->id,
            'ADMIN_TEST',
            $admin,
            ['state' => 'old'],
            ['state' => 'new'],
            'Testing immutability'
        );

        $this->assertDatabaseHas('activity_logs', ['id' => $log->id]);

        // Attempting to update should throw an exception
        try {
            $log->update(['description' => 'Changed description']);
            $this->fail('Expected an Exception for updating an ActivityLog');
        } catch (\Exception $e) {
            $this->assertEquals('Audit logs are immutable and cannot be updated.', $e->getMessage());
        }

        // Attempting to delete should throw an exception
        try {
            $log->delete();
            $this->fail('Expected an Exception for deleting an ActivityLog');
        } catch (\Exception $e) {
            $this->assertEquals('Audit logs are immutable and cannot be deleted.', $e->getMessage());
        }

        $this->assertDatabaseHas('activity_logs', ['id' => $log->id]);
    }
}
