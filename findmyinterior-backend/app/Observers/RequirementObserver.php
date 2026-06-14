<?php

namespace App\Observers;

use App\Models\Requirement;
use App\Models\Bid;
use App\Services\VendorMetricService;
use App\Services\RecommendationEngineService;
use App\Jobs\GenerateRequirementRecommendations;

class RequirementObserver
{
    protected VendorMetricService $metricService;

    public function __construct(VendorMetricService $metricService)
    {
        $this->metricService = $metricService;
    }

    /**
     * Handle the Requirement "created" event.
     */
    public function created(Requirement $requirement): void
    {
        GenerateRequirementRecommendations::dispatch($requirement);
    }

    public function updated(Requirement $requirement): void
    {
        if ($requirement->wasChanged('status')) {
            // Find the awarded vendor if applicable
            $awardedBid = Bid::where('requirement_id', $requirement->id)->where('status', 'awarded')->first();
            $awardedVendorId = $awardedBid ? $awardedBid->professional_id : null;

            if ($requirement->status === 'awarded' && $awardedVendorId) {
                $this->metricService->recordProjectAwarded($awardedVendorId);
            }

            if ($requirement->status === 'completed' && $awardedVendorId) {
                $this->metricService->recordProjectCompleted($awardedVendorId);
            }
        }
    }
}
