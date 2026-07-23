<?php

namespace App\Modules\Truedial\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AnalyticsEventService
{
    // Valid Event Types
    public const EVENT_BUSINESS_VIEW = 'BUSINESS_VIEW';
    public const EVENT_SEARCH_IMPRESSION = 'SEARCH_IMPRESSION';
    public const EVENT_SEARCH_CLICK = 'SEARCH_CLICK';
    public const EVENT_PHONE_CLICK = 'PHONE_CLICK';
    public const EVENT_WHATSAPP_CLICK = 'WHATSAPP_CLICK';
    public const EVENT_WEBSITE_CLICK = 'WEBSITE_CLICK';
    public const EVENT_DIRECTION_CLICK = 'DIRECTION_CLICK';
    public const EVENT_OFFER_VIEW = 'OFFER_VIEW';
    public const EVENT_OFFER_CLICK = 'OFFER_CLICK';
    public const EVENT_PROMO_COPY = 'PROMO_COPY';
    public const EVENT_REVIEW_SUBMITTED = 'REVIEW_SUBMITTED';
    public const EVENT_REVIEW_REPLIED = 'REVIEW_REPLIED';
    public const EVENT_PRODUCT_VIEW = 'PRODUCT_VIEW';
    public const EVENT_SERVICE_VIEW = 'SERVICE_VIEW';
    public const EVENT_GALLERY_VIEW = 'GALLERY_VIEW';

    public static function getValidEvents(): array
    {
        return [
            self::EVENT_BUSINESS_VIEW,
            self::EVENT_SEARCH_IMPRESSION,
            self::EVENT_SEARCH_CLICK,
            self::EVENT_PHONE_CLICK,
            self::EVENT_WHATSAPP_CLICK,
            self::EVENT_WEBSITE_CLICK,
            self::EVENT_DIRECTION_CLICK,
            self::EVENT_OFFER_VIEW,
            self::EVENT_OFFER_CLICK,
            self::EVENT_PROMO_COPY,
            self::EVENT_REVIEW_SUBMITTED,
            self::EVENT_REVIEW_REPLIED,
            self::EVENT_PRODUCT_VIEW,
            self::EVENT_SERVICE_VIEW,
            self::EVENT_GALLERY_VIEW,
        ];
    }

    /**
     * Track an analytics event.
     * Ensures "exact once" tracking per session per event type per entity.
     */
    public static function track(int $tenantId, string $eventType, string $entityType, int $entityId, ?int $userId = null, ?string $sessionId = null, array $metadata = []): void
    {
        if (!in_array($eventType, self::getValidEvents())) {
            throw ValidationException::withMessages(['event_type' => 'Invalid analytics event type.']);
        }

        $sessionId = $sessionId ?? session()->getId() ?? request()->ip();
        
        $finalMetadata = $metadata;
        unset(
            $finalMetadata['device'], 
            $finalMetadata['referrer'], 
            $finalMetadata['city'], 
            $finalMetadata['campaign_id'], 
            $finalMetadata['source'], 
            $finalMetadata['medium'], 
            $finalMetadata['utm_parameters']
        );

        try {
            DB::table('analytics_events')->insertOrIgnore([
                'tenant_id' => $tenantId,
                'event_type' => $eventType,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'user_id' => $userId,
                'session_id' => $sessionId,
                'device' => $metadata['device'] ?? null,
                'referrer' => $metadata['referrer'] ?? null,
                'city' => $metadata['city'] ?? null,
                'campaign_id' => $metadata['campaign_id'] ?? null,
                'source' => $metadata['source'] ?? null,
                'medium' => $metadata['medium'] ?? null,
                'utm_parameters' => isset($metadata['utm_parameters']) ? json_encode($metadata['utm_parameters']) : null,
                'metadata' => empty($finalMetadata) ? null : json_encode($finalMetadata),
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
