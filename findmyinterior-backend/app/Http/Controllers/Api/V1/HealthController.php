<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SystemHealthService;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    private SystemHealthService $healthService;

    public function __construct(SystemHealthService $healthService)
    {
        $this->healthService = $healthService;
    }

    /**
     * Liveness probe: Application process is running.
     * Simple, fast check that doesn't hit the database.
     */
    public function live(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
        ], 200);
    }

    /**
     * Readiness probe: DB + Redis + Storage are usable.
     * Deep check to ensure the application is ready to handle traffic.
     */
    public function ready(): JsonResponse
    {
        $snapshot = $this->healthService->getHealthSnapshot();
        
        $isCritical = false;
        
        if (isset($snapshot['database']['status']) && $snapshot['database']['status'] === 'critical') {
            $isCritical = true;
        }
        
        if (isset($snapshot['cache']['status']) && $snapshot['cache']['status'] === 'critical') {
            $isCritical = true;
        }
        
        if (isset($snapshot['storage']['status']) && $snapshot['storage']['status'] === 'critical') {
            $isCritical = true;
        }

        $statusCode = $isCritical ? 500 : 200;
        
        return response()->json([
            'status' => $isCritical ? 'critical' : 'healthy',
            'snapshot' => $snapshot
        ], $statusCode);
    }
}
