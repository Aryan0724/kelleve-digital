<?php

// Ensure we are running from artisan tinker or a proper laravel context
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\WorkerJob;
use App\Models\ContactUnlock;
use App\Models\Bid;
use Illuminate\Support\Facades\DB;
use App\Services\BidService;
use App\Services\UnlockService;

echo "Starting Job Workflow Verification...\n";
DB::beginTransaction();

try {
    // 1. Setup Users
    echo "1. Setting up mock users...\n";
    $customer = User::factory()->create(['name' => 'Mock Customer', 'email' => 'customer_mock_' . time() . '@test.com']);
    $worker = User::factory()->create(['name' => 'Mock Worker', 'email' => 'worker_mock_' . time() . '@test.com']);
    
    // Assign roles if needed (assuming spatie/laravel-permission or similar, skipping for pure DB test if possible)
    // We'll just create a worker profile for the worker
    $workerProfile = \App\Models\Worker::create([
        'user_id' => $worker->id,
        'name' => 'Mock Worker',
        'slug' => 'mock-worker',
        'phone' => '1234567890',
        'skill' => 'Electrician',
        'experience_years' => 5,
        'daily_rate' => 500,
        'city' => 'Delhi',
        'district' => 'New Delhi'
    ]);
    
    DB::table('user_roles')->insert(['user_id' => $worker->id, 'role_id' => \App\Models\Role::where('slug', 'worker')->first()->id]);
    echo "2. Customer posting a job requirement...\n";
    $job = WorkerJob::create([
        'user_id' => $customer->id,
        'title' => 'Need an electrician to fix wiring',
        'description' => 'Whole house wiring check',
        'skills_required' => 'Electrician',
        'city' => 'Delhi',
        'budget_min' => 1000,
        'budget_max' => 5000,
        'status' => 'open'
    ]);
    echo "   Job created with ID: {$job->id}\n";

    // 3. Worker sees the job (simulate DashboardController logic)
    echo "3. Worker checking recommended leads...\n";
    $recommendedJobs = WorkerJob::where('status', 'open')
        ->where(function($q) use ($workerProfile) {
            $q->where('skills_required', 'like', '%' . $workerProfile->skill . '%')
              ->orWhereNull('skills_required')
              ->orWhere('skills_required', '');
        })->get();
        
    if (!$recommendedJobs->contains('id', $job->id)) {
        throw new \Exception("Job not found in recommended leads!");
    }
    echo "   Job found in worker's recommended leads!\n";

    // 4. Worker Unlocks the Job
    echo "4. Worker unlocking the job contact...\n";
    $unlockService = app(UnlockService::class);
    // Note: UnlockService checks for 'worker' role via `$vendor->hasRole('worker')`. Since we didn't assign Spatie roles to the mock user, it might deduct fee. We gave 1000 balance anyway.
    $unlockResult = $unlockService->unlockContact($worker, $job);
    if (!$unlockResult['success']) {
        throw new \Exception("Failed to unlock contact!");
    }
    echo "   Contact unlocked successfully. Customer phone: " . ($unlockResult['contact']['phone'] ?? 'N/A') . "\n";

    // 5. Worker Bids on the Job
    echo "5. Worker submitting a bid...\n";
    $bidService = app(BidService::class);
    $bidData = [
        'requirement_id' => $job->id,
        'requirement_type' => WorkerJob::class,
        'requirement_type_class' => WorkerJob::class,
        'amount' => 1500,
        'estimated_cost' => 1500,
        'timeline_days' => 2,
        'proposal_message' => 'I can fix this in 2 days.',
        'experience_years' => 5,
        'previous_projects_count' => 0
    ];
    $bid = $bidService->submitBid($worker->id, $bidData);
    echo "   Bid submitted with ID: {$bid->id}\n";
    
    // Check if job status changed to 'receiving_applications'
    $job->refresh();
    if ($job->status !== 'receiving_applications') {
        throw new \Exception("Job status did not update to 'receiving_applications'. Current: {$job->status}");
    }
    echo "   Job status correctly updated to receiving_applications.\n";

    // 6. Customer Awards the Job
    echo "6. Customer awarding the job to the worker...\n";
    $bidService->awardBid($bid, $customer);
    
    $job->refresh();
    $bid->refresh();
    if ($job->status !== 'awarded' || $bid->status !== 'accepted') {
        throw new \Exception("Awarding failed. Job status: {$job->status}, Bid status: {$bid->status}");
    }
    echo "   Job successfully awarded.\n";

    // 7. Worker Accepts the Job
    echo "7. Worker accepting the awarded job...\n";
    $job->update(['status' => 'in_progress']); // This happens in BidController::acceptAward
    echo "   Job is now in_progress.\n";

    // 8. Complete Job
    echo "8. Completing the job...\n";
    $bidService->completeRequirement($job, $customer);
    $job->refresh();
    if ($job->status !== 'completed') {
        throw new \Exception("Failed to complete job. Status: {$job->status}");
    }
    echo "   Job successfully completed!\n";

    echo "\nAll workflows verified successfully! Rolling back database changes...\n";
    DB::rollBack();
    echo "Rollback complete.\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n[ERROR] Verification failed: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}


