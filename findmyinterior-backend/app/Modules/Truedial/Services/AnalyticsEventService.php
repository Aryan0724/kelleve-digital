<?php

namespace App\Modules\Truedial\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AnalyticsEventService
{
    /**
     * Track an analytics event.
     * Ensures "exact once" tracking per session per event type per entity.
     */
    public static function track(int $tenantId, string $eventType, string $entityType, int $entityId, ?int $userId = null, ?string $sessionId = null, array $metadata = []): void
    {
        $sessionId = $sessionId ?? session()->getId() ?? request()->ip();

        try {
            DB::table('analytics_events')->insertOrIgnore([
                'tenant_id' => $tenantId,
                'event_type' => $eventType,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'user_id' => $userId,
                'session_id' => $sessionId,
                'metadata' => json_encode($metadata),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Analytics tracking failed', [
                'error' => $e->getMessage(),
                'event_type' => $eventType,
                'entity_id' => $entityId,
            ]);
        }
    }
}
