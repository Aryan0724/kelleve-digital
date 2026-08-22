<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\WorkerJob;
use App\Models\Rfq;
use App\Models\Project;
use App\Models\JobApplication;
use App\Services\BidService;
use App\Services\WalletService;

echo "Starting Golden Flows against: " . env('DB_DATABASE') . "\n\n";

$failures = 0;
function assertTest($name, $condition, $failureMessage = '') {
    global $failures;
    if ($condition) {
        echo "✅ PASS: $name\n";
    } else {
        echo "❌ FAIL: $name - $failureMessage\n";
        $failures++;
    }
}

// GF-1: User & Auth
echo "\n--- GF-1 User & Authentication ---\n";
$user768 = User::find(768);
assertTest("GF-1.1: User 768 exists", $user768 !== null);
$mockUser = User::where('is_mock', true)->first();
assertTest("GF-1.3: Mock user exists", $mockUser !== null);
$user768->city = 'Mumbai ' . rand(1, 100);
$user768->save();
assertTest("GF-1.4: Updated User 768 city", User::find(768)->city === $user768->city);

// Admin real user count
$realUserCount = User::where('is_mock', false)->count();
assertTest("GF-1.5: Real user count is 241", $realUserCount === 241, "Got $realUserCount");

// GF-2: Domain Separation
echo "\n--- GF-2 Domain Separation ---\n";
$workerJobs = WorkerJob::count();
assertTest("GF-2.1: WorkerJobs count is 2", $workerJobs === 2, "Got $workerJobs");
$rfqs = Rfq::count();
assertTest("GF-2.2: RFQs count is 2", $rfqs === 2, "Got $rfqs");
$projects = Project::whereNull('deleted_at')->count();
assertTest("GF-2.3: Ordinary projects count is 0", $projects === 0, "Got $projects");

// orphaned / quarantined via main API
$p5 = Project::find(5);
assertTest("GF-2.4: Orphaned project #5 is not in main table", $p5 === null);
$p12 = Project::find(12);
assertTest("GF-2.5: Quarantined project #12 is not in main table", $p12 === null);


// GF-3: Application Lifecycle
echo "\n--- GF-3 Application Lifecycle ---\n";
$wj1 = WorkerJob::find(1);
$historicalApps = JobApplication::where('requirement_id', 1)->count();
assertTest("GF-3.1: Job #1 has 1 historical application", $historicalApps === 1, "Got $historicalApps");

// New Application
$bidService = app(BidService::class);
try {
    $newApp = $bidService->submitBid(1540, [
        'requirement_id' => 1,
        'requirement_type_class' => WorkerJob::class,
        'estimated_cost' => 500,
        'proposal_message' => 'New test application',
    ]);
    assertTest("GF-3.3: Submitted new JobApplication", $newApp instanceof JobApplication);
    
    $totalApps = JobApplication::where('requirement_id', 1)->count();
    assertTest("GF-3.4: Coexistence (2 total apps)", $totalApps === 2, "Got $totalApps");
} catch (\Exception $e) {
    assertTest("GF-3.3: Submit application failed: " . $e->getMessage(), false);
}


// GF-4: Award Lifecycle
echo "\n--- GF-4 Award Lifecycle ---\n";
try {
    $historicalApp = JobApplication::where('requirement_id', 1)->oldest()->first();
    $customer = User::find($wj1->user_id);
    $awarded = $bidService->awardBid($historicalApp, $customer);
    assertTest("GF-4.1: Awarded WorkerJob #1", $awarded === true);
    
    $wj1->refresh();
    assertTest("GF-4.2/4.3: winning_application_id set correctly", $wj1->winning_application_id === $historicalApp->id, "Was " . $wj1->winning_application_id);
    assertTest("GF-4.3: Status is awarded", $wj1->status === 'awarded');
} catch (\Exception $e) {
    assertTest("GF-4: Award failed: " . $e->getMessage(), false);
}


// GF-5: Wallet Lifecycle
echo "\n--- GF-5 Wallet Lifecycle ---\n";
$walletService = app(WalletService::class);
$balance = $walletService->getBalance($user768);
assertTest("GF-5.1: User 768 balance is ₹40,883", $balance == 40883, "Got $balance");

$txnCount = DB::table('wallet_transactions')->where('wallet_id', function($q) use ($user768) {
    $q->select('id')->from('wallets')->where('user_id', 768);
})->count();
assertTest("GF-5.2: User 768 has 9 transactions", $txnCount === 9, "Got $txnCount");

// debit
try {
    $walletService->deduct($user768, 50, "Test debit");
    $newBalance = $walletService->getBalance($user768);
    assertTest("GF-5.3: Debit successful", $newBalance == 40833, "Got $newBalance");
} catch (\Exception $e) {
    assertTest("GF-5.3: Debit failed", false, $e->getMessage());
}

// mock user wallet
try {
    $walletService->deduct($mockUser, 50, "Test mock debit");
    assertTest("GF-5.4: Mock user debit blocked", false, "Allowed synthetic spend!");
} catch (\Exception $e) {
    assertTest("GF-5.4: Mock user debit blocked", str_contains($e->getMessage(), 'synthetic'));
}

// User 1 (UNVERIFIED_LEGACY_BALANCE)
$user1 = User::find(1);
try {
    $walletService->deduct($user1, 50, "Test unverified debit");
    assertTest("GF-5.5: User 1 debit blocked", false, "Allowed unverified spend!");
} catch (\Exception $e) {
    assertTest("GF-5.5: User 1 debit blocked", str_contains($e->getMessage(), 'verification'));
}


// GF-7: Quarantine Firewall
echo "\n--- GF-7 Quarantine Firewall ---\n";
$quarantineProjects = DB::table('quarantine_projects')->count();
$quarantineBids = DB::table('quarantine_bids')->count();
$quarantineUnlocks = DB::table('quarantine_unlocks')->count();

assertTest("GF-7.4: Quarantine projects count is 9", $quarantineProjects === 9, "Got $quarantineProjects");
assertTest("GF-7.5: Quarantine bids count is 2", $quarantineBids === 2, "Got $quarantineBids");
assertTest("GF-7.6: Quarantine unlocks count is 5", $quarantineUnlocks === 5, "Got $quarantineUnlocks");

echo "\nCompleted. Failures: $failures\n";
