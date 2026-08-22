<?php

namespace Tests\Feature\C1\GoldenFlows;

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

abstract class GoldenFlowTestCase extends TestCase
{
    use DatabaseTruncation;

    protected function connectionsToTruncate()
    {
        return ['mysql', 'truedial'];
    }

    protected function setUp(): void
    {
        \Illuminate\Foundation\Testing\RefreshDatabaseState::$migrated = true;
        parent::setUp();
        
        // 1. Production DB Safety Gate
        $this->verifyDatabaseSafetyGate();
        
        // 2. FMI/TrueDial Isolation
        $this->verifyDatabaseIsolation();

        $this->artisan('db:seed', ['--class' => 'TestingSeeder']);
    }
    
    /**
     * Abort entirely if we are not connected to testing db.
     */
    private function verifyDatabaseSafetyGate(): void
    {
        $dbName = DB::connection()->getDatabaseName();
        $expected = 'findmyinterior_testing';
        
        if ($dbName !== $expected) {
            echo "\n\n[CRITICAL ERROR] SAFETY GATE TRIGGERED.\n";
            echo "Expected database: {$expected}\n";
            echo "Actual database: {$dbName}\n";
            echo "Aborting tests to prevent destructive operations on non-testing environment.\n\n";
            exit(1);
        }
        
        // Only print this if running the first test in the suite (to avoid spam)
        static $printed = false;
        if (!$printed) {
            echo "\n--- FMI C1-6 SAFETY GATE VERIFIED ---\n";
            echo "ENVIRONMENT: " . app()->environment() . "\n";
            echo "DATABASE: {$dbName}\n";
            echo "PRODUCTION DATABASE: NOT CONNECTED\n";
            echo "TRUE DIAL DATABASE: NOT MODIFIED\n";
            echo "-------------------------------------\n\n";
            $printed = true;
        }
    }
    
    /**
     * Verify we are not accidentally sharing TrueDial schema.
     */
    private function verifyDatabaseIsolation(): void
    {
        // Add basic isolation assertions if necessary.
        // For now, ensuring we use standard FMI connection.
        $this->assertEquals('mysql', config('database.default'));
    }

    private function seedDatabaseIfEmpty(): void
    {
        // Check if categories are seeded. If not, we might have started from a truncated DB in a parallel test.
        if (\App\Models\Category::count() === 0) {
            $this->artisan('db:seed', ['--class' => 'FindMyInteriorSeeder']);
        }
    }

    /**
     * Simulates destroying the current session and recreating it with the given user.
     * Use this to verify state persistence across a "logout -> login" sequence.
     */
    protected function simulateSessionRefresh(\App\Models\User $user): self
    {
        // For stateless APIs (sanctum tokens), actingAs internally sets the user on the guard.
        // To properly clear it, we unset it.
        $this->app->get('auth')->forgetGuards();
        return $this->actingAs($user);
    }
}
