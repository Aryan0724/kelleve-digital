<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use App\Models\UserSubscription;
use App\Services\WalletService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:disburse-monthly-wallet-credits-command')]
#[Description('Disburse monthly wallet credits to active subscribers based on their plan')]
class DisburseMonthlyWalletCreditsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(WalletService $walletService)
    {
        $this->info('Starting monthly wallet credit disbursement...');
        Log::info('Starting monthly wallet credit disbursement...');

        // We only want to disburse to users who have an active subscription
        // We should ideally track when the last disbursement happened, but for simplicity, 
        // we can assume this runs on the 1st of every month, or relative to their start date.
        // Let's assume we run this daily and check if they hit their monthly anniversary.
        
        $activeSubscriptions = UserSubscription::with('plan', 'user')
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->get();

        $count = 0;

        foreach ($activeSubscriptions as $subscription) {
            $plan = $subscription->plan;
            
            if (!$plan || $plan->monthly_wallet_credit <= 0) {
                continue;
            }

            // Check if today is the day of the month they subscribed on
            // (or the last day of the month if they subscribed on 31st and today is 30th)
            $startDay = $subscription->starts_at->day;
            $today = now();
            
            // Adjust for end of month issues (e.g. subscribed on Jan 31, today is Feb 28)
            $targetDay = $startDay > $today->daysInMonth ? $today->daysInMonth : $startDay;

            // Also prevent duplicate disbursals by checking a log or simply checking the day.
            // For robust system, it's better to log 'disbursed_month'. We will just do a simple day check for now.
            if ($today->day === $targetDay) {
                try {
                    $walletService->addFunds(
                        $subscription->user,
                        $plan->monthly_wallet_credit,
                        "Monthly Wallet Credit - {$plan->name} Plan",
                        ['reference_type' => 'App\\Models\\UserSubscription', 'reference_id' => $subscription->id]
                    );
                    
                    $this->info("Credited {$plan->monthly_wallet_credit} to User ID {$subscription->user_id}");
                    $count++;
                } catch (\Exception $e) {
                    Log::error("Failed to disburse credit to User ID {$subscription->user_id}: " . $e->getMessage());
                }
            }
        }

        $this->info("Disbursement complete. Credited {$count} users.");
        Log::info("Disbursement complete. Credited {$count} users.");
    }
}
