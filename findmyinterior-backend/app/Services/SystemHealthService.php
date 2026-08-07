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
            'system' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => app()->environment(),
                'debug_mode' => config('app.debug'),
                'memory_usage' => $this->getMemoryUsage(),
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            
            // Check pending migrations
            $migrator = app('migrator');
            $migrator->repositoryExists() ? $migrator->getRepository()->getRan() : [];
            $pending = count($migrator->pending());

            return [
                'status' => 'healthy',
                'connection' => 'connected',
                'pending_migrations' => $pending,
            ];
        } catch (\Exception $e) {
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
}
