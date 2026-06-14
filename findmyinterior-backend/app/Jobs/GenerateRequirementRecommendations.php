<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Requirement;
use App\Services\RecommendationEngineService;

class GenerateRequirementRecommendations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $requirement;

    /**
     * Create a new job instance.
     */
    public function __construct(Requirement $requirement)
    {
        $this->requirement = $requirement;
    }

    /**
     * Execute the job.
     */
    public function handle(RecommendationEngineService $recommendationService): void
    {
        $recommendationService->generateFor($this->requirement);
    }
}
