<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SystemHealthService;
use Illuminate\Support\Facades\Log;

class HealthCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:health-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perform a background system health check and alert on critical issues';

    /**
     * Execute the console command.
     */
    public function handle(SystemHealthService $healthService)
    {
        $this->info('Starting system health check...');
        $health = $healthService->getHealthSnapshot();
        
        $hasCritical = false;
        foreach (['database', 'cache', 'queue', 'storage'] as $component) {
            if ($health[$component]['status'] === 'critical') {
                $hasCritical = true;
                Log::critical("System Health Critical in {$component}", [
                    'details' => $health[$component]
                ]);
                $this->error("Critical issue found in {$component}!");
            }
        }

        if (!$hasCritical) {
            $this->info('All systems healthy.');
        }
    }
}
