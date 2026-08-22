<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Facades\DB;

/**
 * Base class for all Security Sweep tests.
 *
 * Rules enforced here:
 * - Tests run only against findmyinterior_testing (enforced by safety gate)
 * - Uses DatabaseTruncation (not RefreshDatabase) so migrations are NOT
 *   re-run on every test — only tables are truncated. This keeps tests fast.
 * - Only the lightweight SecurityTestSeeder is used (no geo/heavy fixtures)
 * - No production writes, no migrate:fresh, no destructive ops
 */
abstract class SecurityTestCase extends TestCase
{
    use DatabaseTruncation;

    protected function setUp(): void
    {
        // Tell Laravel the DB is already migrated — skip re-running 125+ migrations
        \Illuminate\Foundation\Testing\RefreshDatabaseState::$migrated = true;

        parent::setUp();

        $this->verifyDatabaseSafetyGate();

        $this->artisan('db:seed', ['--class' => 'SecurityTestSeeder']);
    }

    /**
     * Abort entirely if we are not connected to the testing database.
     * This is a hard production safety gate — if it triggers, tests stop immediately.
     */
    private function verifyDatabaseSafetyGate(): void
    {
        $dbName = DB::connection()->getDatabaseName();
        $expected = 'findmyinterior_testing';

        if ($dbName !== $expected) {
            echo "\n\n[CRITICAL] SECURITY SWEEP SAFETY GATE TRIGGERED.\n";
            echo "Expected database: {$expected}\n";
            echo "Actual database:   {$dbName}\n";
            echo "Aborting to prevent destructive operations on non-testing environment.\n\n";
            exit(1);
        }

        static $printed = false;
        if (!$printed) {
            echo "\n--- SECURITY SWEEP SAFETY GATE VERIFIED ---\n";
            echo "ENVIRONMENT: " . app()->environment() . "\n";
            echo "DATABASE: {$dbName}\n";
            echo "-------------------------------------------\n\n";
            $printed = true;
        }
    }
}
