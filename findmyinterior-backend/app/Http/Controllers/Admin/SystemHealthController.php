<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SystemHealthService;
use Illuminate\Http\JsonResponse;

class SystemHealthController extends Controller
{
    protected $healthService;

    public function __construct(SystemHealthService $healthService)
    {
        $this->healthService = $healthService;
    }

    /**
     * Get the current system health metrics.
     */
    public function index(): JsonResponse
    {
        $health = $this->healthService->getHealthSnapshot();
        
        $hasCritical = false;
        $hasWarning = false;

        foreach (['database', 'cache', 'queue', 'storage'] as $component) {
            if ($health[$component]['status'] === 'critical') $hasCritical = true;
            if ($health[$component]['status'] === 'warning') $hasWarning = true;
        }

        $overallStatus = 'healthy';
        if ($hasWarning) $overallStatus = 'warning';
        if ($hasCritical) $overallStatus = 'critical';

        return response()->json([
            'success' => true,
            'status' => $overallStatus,
            'data' => $health
        ]);
    }
}
