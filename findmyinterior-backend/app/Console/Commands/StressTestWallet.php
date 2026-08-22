<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use App\Models\User;
use App\Models\Requirement;
use App\Models\Category;
use App\Models\UserWallet;

class StressTestWallet extends Command
{
    protected $signature = 'test:stress-wallet {--url=http://localhost:8000} {--concurrency=10}';
    protected $description = 'Stress test the wallet unlock endpoint for concurrency and race conditions';

    public function handle()
    {
        $this->info("Setting up stress test data...");

        // Ensure we have a user and a project
        $user = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business']);
        \Illuminate\Support\Facades\DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => $role->id,
        ]);
        $token = $user->createToken('stress-test')->plainTextToken;
        
        $category = Category::firstOrCreate(['slug' => 'test-category'], ['name' => 'Test Category']);
        
        $project = Requirement::factory()->create([
            'category_id' => $category->id,
            'status' => 'open'
        ]);

        // Give user exact amount for ONE unlock
        $unlockPrice = $project->unlock_price ?? config('marketplace.unlock_fee', 49.00);
        $walletId = \Illuminate\Support\Facades\DB::table('wallets')->insertGetId([
            'user_id' => $user->id,
            'balance' => $unlockPrice,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $url = rtrim($this->option('url'), '/') . '/api/v1/requirements/' . $project->id . '/unlock';
        $concurrency = (int) $this->option('concurrency');

        $this->info("Firing $concurrency concurrent requests to: $url");
        
        $start = microtime(true);

        $responses = Http::pool(function (\Illuminate\Http\Client\Pool $pool) use ($concurrency, $url, $token) {
            $requests = [];
            for ($i = 0; $i < $concurrency; $i++) {
                $requests[] = $pool->acceptJson()->withToken($token)->post($url);
            }
            return $requests;
        });

        $end = microtime(true);
        $totalTime = round($end - $start, 3);

        $successes = 0;
        $failures = 0;
        $times = [];

        foreach ($responses as $response) {
            if ($response instanceof \Exception) {
                $failures++;
                continue;
            }
            
            // Get transfer time if available
            $stats = $response->handlerStats();
            $times[] = $stats['total_time'] ?? 0;

            if ($response->successful()) {
                $successes++;
            } else {
                $failures++;
                $this->error("Failed request status: " . $response->status() . " Body: " . $response->body());
            }
        }

        sort($times);
        $p50 = count($times) > 0 ? $times[floor(count($times) * 0.50)] : 0;
        $p95 = count($times) > 0 ? $times[floor(count($times) * 0.95)] : 0;
        $p99 = count($times) > 0 ? $times[floor(count($times) * 0.99)] : 0;

        $this->info("Total Time: {$totalTime}s");
        $this->info("Successes (HTTP 2xx): $successes");
        $this->info("Failures (HTTP 4xx/5xx): $failures");
        $this->info("P50 Response Time: " . round($p50, 3) . "s");
        $this->info("P95 Response Time: " . round($p95, 3) . "s");
        $this->info("P99 Response Time: " . round($p99, 3) . "s");

        $wallet = \Illuminate\Support\Facades\DB::table('wallets')->where('user_id', $user->id)->first();
        $this->info("Final Wallet Balance: {$wallet->balance}");

        $unlocksCount = \Illuminate\Support\Facades\DB::table('contact_unlocks')
            ->where('user_id', $user->id)
            ->where('requirement_id', $project->id)
            ->count();

        $this->info("Total Unlocks Inserted: {$unlocksCount}");

        // The endpoint is idempotent, so it returns success for duplicate unlocks.
        // But it should only deduct and insert EXACTLY ONE record.
        if ($unlocksCount > 1 || $wallet->balance < 0) {
            $this->error("RACE CONDITION DETECTED! Inserted {$unlocksCount} unlocks, or balance went negative!");
            return 1;
        }

        if ($p95 > 2.0) {
            $this->warn("Performance is degraded. P95 time > 2s.");
        } else {
            $this->info("Performance is acceptable.");
        }

        return 0;
    }
}
