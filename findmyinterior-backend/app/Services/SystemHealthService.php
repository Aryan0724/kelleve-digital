<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class SystemHealthService
{
    /**
     * Get a comprehensive snapshot of system health.
     */
    public function getHealthSnapshot(): array
    {
        return [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'queue' => $this->checkQueue(),
            'storage' => $this->checkStorage(),
            'deployment' => $this->getDeploymentStatus(),
            'system' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => app()->environment(),
                'debug_mode' => config('app.debug'),
                'memory_usage' => $this->getMemoryUsage(),
                'cpu_load' => $this->getCpuLoad(),
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }

    private function getDeploymentStatus(): array
    {
        $statusFile = storage_path('app/public/deploy_status.json');
        if (file_exists($statusFile)) {
            return json_decode(file_get_contents($statusFile), true) ?? ['status' => 'unknown'];
        }
        return ['status' => 'unknown'];
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            
            // Check pending migrations
            $migrator = app('migrator');
            $files = $migrator->getMigrationFiles($migrator->paths());
            $ran = $migrator->repositoryExists() ? $migrator->getRepository()->getRan() : [];
            $pending = count(array_diff(array_keys($files), $ran));

            return [
                'status' => 'healthy',
                'connection' => 'connected',
                'pending_migrations' => $pending,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'critical',
                'error' => $e->getMessage()
            ];
        }
    }

    private function checkCache(): array
    {
        try {
            Cache::store('redis')->put('health_check', 'ok', 10);
            $val = Cache::store('redis')->get('health_check');
            return [
                'status' => $val === 'ok' ? 'healthy' : 'warning',
                'driver' => config('cache.default')
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'critical',
                'error' => $e->getMessage()
            ];
        }
    }

    private function checkQueue(): array
    {
        try {
            // Count failed jobs
            $failed = DB::table('failed_jobs')->count();
            return [
                'status' => $failed > 0 ? 'warning' : 'healthy',
                'failed_jobs' => $failed,
                'driver' => config('queue.default')
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'critical',
                'error' => $e->getMessage()
            ];
        }
    }

    private function checkStorage(): array
    {
        $storagePath = storage_path();
        $freeSpace = @disk_free_space($storagePath);
        $totalSpace = @disk_total_space($storagePath);
        
        if ($freeSpace === false || $totalSpace === false) {
            return ['status' => 'unknown'];
        }

        $freePercent = ($freeSpace / $totalSpace) * 100;
        
        return [
            'status' => $freePercent > 10 ? 'healthy' : 'critical',
            'free_space_gb' => round($freeSpace / 1024 / 1024 / 1024, 2),
            'total_space_gb' => round($totalSpace / 1024 / 1024 / 1024, 2),
            'free_percent' => round($freePercent, 2)
        ];
    }

    private function getMemoryUsage(): string
    {
        $mem = memory_get_usage(true);
        return round($mem / 1024 / 1024, 2) . ' MB';
    }

    private function getCpuLoad(): string
    {
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            if (is_array($load) && count($load) > 0) {
                return $load[0] . ' (1 min avg)';
            }
        }
        
        // Windows fallback
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            @exec('wmic cpu get loadpercentage', $output);
            if (isset($output[1])) {
                return trim($output[1]) . '%';
            }
        }

        return 'Unknown';
    }
}
