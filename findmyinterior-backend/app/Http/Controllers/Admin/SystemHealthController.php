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

    /**
     * Get recent application logs.
     */
    public function logs(): JsonResponse
    {
        $logFile = storage_path('logs/laravel.log');
        $lines = [];
        $linesCount = 200; // Limit to last 200 lines

        if (!file_exists($logFile)) {
            return response()->json([
                'success' => true,
                'logs' => ['Log file not found.']
            ]);
        }

        // Efficiently read the last N lines of a file
        $file = new \SplFileObject($logFile, 'r');
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key();
        
        $startLine = max(0, $totalLines - $linesCount);
        
        $file->seek($startLine);
        
        while (!$file->eof()) {
            $line = $file->current();
            if (trim($line) !== '') {
                $lines[] = trim($line);
            }
            $file->next();
        }

        return response()->json([
            'success' => true,
            'logs' => $lines
        ]);
    }

    /**
     * Clear application cache.
     */
    public function clearCache(): JsonResponse
    {
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        return response()->json(['success' => true, 'message' => 'OPcache, route, config, and application cache reset successfully.']);
    }
}
