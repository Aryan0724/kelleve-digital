<?php

namespace App\Console\Commands;

use App\Models\UserSubscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DowngradeExpiredSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:downgrade';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Downgrades active subscriptions that have expired to cancelled and sets the user back to free plan.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredSubscriptions = UserSubscription::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        $count = 0;
        foreach ($expiredSubscriptions as $subscription) {
            $subscription->update(['status' => 'cancelled']);
            
            // Sync is_premium flag to false
            $user = $subscription->user;
            if ($user->hasRole('builder') && $user->builder) {
                $user->builder->update(['is_premium' => false]);
            } elseif ($user->hasRole('supplier') && $user->supplier) {
                $user->supplier->update(['is_premium' => false]);
            } elseif ($user->hasRole('worker') && $user->worker) {
                $user->worker->update(['is_premium' => false]);
            } elseif ($user->hasRole('business') && $user->listing) {
                $user->listing->update(['is_premium' => false]);
            }
            
            $count++;
        }

        if ($count > 0) {
            Log::info("Downgraded {$count} expired subscriptions.");
        }
        
        $this->info("Successfully downgraded {$count} subscriptions.");
    }
}
