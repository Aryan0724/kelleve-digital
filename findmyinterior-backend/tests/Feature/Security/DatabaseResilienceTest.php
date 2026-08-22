<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;

/**
 * Phase 5: Database Reliability & Failure Handling
 * Verifies that the system safely handles and retries transaction deadlocks.
 */
class DatabaseResilienceTest extends TestCase
{
    public function test_transaction_retries_on_deadlock_and_eventually_succeeds()
    {
        $attempts = 0;
        
        try {
            DB::transaction(function () use (&$attempts) {
                $attempts++;
                
                // Simulate a deadlock on the first 2 attempts
                if ($attempts < 3) {
                    throw new \Illuminate\Database\QueryException(
                        "mysql",
                        "select * from wallets for update",
                        [],
                        new \PDOException("Deadlock found when trying to get lock; try restarting transaction", "40001")
                    );
                }
                
                // Succeed on the 3rd attempt
                return true;
            }, 3);
        } catch (\Exception $e) {
            $this->fail("Transaction should have retried and succeeded, but it failed: " . $e->getMessage());
        }
        
        $this->assertEquals(3, $attempts, 'Transaction did not retry the expected number of times');
    }

    public function test_transaction_fails_safely_after_max_deadlock_retries()
    {
        $attempts = 0;
        
        try {
            DB::transaction(function () use (&$attempts) {
                $attempts++;
                throw new \Illuminate\Database\QueryException(
                    "mysql",
                    "select * from wallets for update",
                    [],
                    new \PDOException("Deadlock found when trying to get lock; try restarting transaction", "40001")
                );
            }, 3);
            
            $this->fail("Transaction should have ultimately failed due to continuous deadlocks.");
        } catch (\Illuminate\Database\QueryException $e) {
            // Expected behavior
            $this->assertEquals("40001", $e->getCode(), 'Expected the deadlock code to bubble up after max retries.');
        }
        
        $this->assertEquals(3, $attempts, 'Transaction did not retry exactly the max allowed times (3)');
    }
}
