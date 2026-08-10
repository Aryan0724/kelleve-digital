<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:expire-requirements')]
#[Description('Expires requirements, projects, rfqs, and worker jobs that have passed their expires_at date.')]
class ExpireRequirementsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();
        $count = 0;

        $models = [
            \App\Models\Requirement::class,
            \App\Models\Project::class,
            \App\Models\Rfq::class,
            \App\Models\WorkerJob::class,
        ];

        foreach ($models as $modelClass) {
            if (class_exists($modelClass)) {
                $expiredCount = $modelClass::where('status', 'open')
                    ->whereNotNull('expires_at')
                    ->where('expires_at', '<', $now)
                    ->update(['status' => 'expired']);
                $count += $expiredCount;
            }
        }

        $this->info("Successfully expired {$count} items.");
    }
}
