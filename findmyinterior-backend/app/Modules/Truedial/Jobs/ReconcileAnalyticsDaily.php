<?php

namespace App\Modules\Truedial\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Modules\Truedial\Services\AnalyticsEventService;

class ReconcileAnalyticsDaily implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $targetDate = Carbon::yesterday();
        $start = $targetDate->copy()->startOfDay();
        $end = $targetDate->copy()->endOfDay();
        $dateStr = $targetDate->toDateString();

        // Query ALL events for the previous day
        $events = DB::table('analytics_events')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        if ($events->isEmpty()) {
            return;
        }

        $listingAggregates = [];

        foreach ($events as $event) {
            $listingId = null;

            if ($event->entity_type === 'listing') {
                $listingId = $event->entity_id;
            } elseif ($event->entity_type === 'offer') {
                $meta = json_decode($event->metadata, true);
                if (isset($meta['listing_id'])) {
                    $listingId = $meta['listing_id'];
                } else {
                    // Fetch listing_id from the offer
                    $offer = DB::table('offers')->find($event->entity_id);
                    if ($offer) $listingId = $offer->listing_id;
                }
            } elseif ($event->entity_type === 'review') {
                $meta = json_decode($event->metadata, true);
                if (isset($meta['listing_id'])) {
                    $listingId = $meta['listing_id'];
                } else {
                    $review = DB::table('reviews')->find($event->entity_id);
                    if ($review) $listingId = $review->listing_id;
                }
            }

            if ($listingId) {
                if (!isset($listingAggregates[$listingId])) {
                    $listingAggregates[$listingId] = $this->initListingArray($listingId, $dateStr);
                }
                
                $col = $this->mapEventTypeToColumn($event->event_type);
                if ($col) {
                    $listingAggregates[$listingId][$col]++;
                }
            }
        }

        $upsertData = array_values($listingAggregates);

        if (!empty($upsertData)) {
            // Upsert will OVERWRITE the hourly aggregations with the true computed value from raw events.
            DB::table('analytics_daily')->upsert(
                $upsertData,
                ['listing_id', 'date'],
                [
                    'views', 'search_impressions', 'search_clicks', 'gallery_views', 
                    'product_views', 'service_views', 'offer_views', 'offer_clicks', 
                    'offer_copies', 'website_clicks', 'phone_clicks', 'whatsapp_clicks', 
                    'direction_clicks', 'review_count', 'review_reply_count', 'updated_at'
                ]
            );
        }
    }
    
    private function initListingArray($listingId, $date)
    {
        return [
            'listing_id' => $listingId,
            'date' => $date,
            'views' => 0,
            'search_impressions' => 0,
            'search_clicks' => 0,
            'gallery_views' => 0,
            'product_views' => 0,
            'service_views' => 0,
            'offer_views' => 0,
            'offer_clicks' => 0,
            'offer_copies' => 0,
            'website_clicks' => 0,
            'phone_clicks' => 0,
            'whatsapp_clicks' => 0,
            'direction_clicks' => 0,
            'review_count' => 0,
            'review_reply_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function mapEventTypeToColumn(string $eventType): ?string
    {
        $map = [
            AnalyticsEventService::EVENT_BUSINESS_VIEW => 'views',
            AnalyticsEventService::EVENT_SEARCH_IMPRESSION => 'search_impressions',
            AnalyticsEventService::EVENT_SEARCH_CLICK => 'search_clicks',
            AnalyticsEventService::EVENT_PHONE_CLICK => 'phone_clicks',
            AnalyticsEventService::EVENT_WHATSAPP_CLICK => 'whatsapp_clicks',
            AnalyticsEventService::EVENT_WEBSITE_CLICK => 'website_clicks',
            AnalyticsEventService::EVENT_DIRECTION_CLICK => 'direction_clicks',
            AnalyticsEventService::EVENT_OFFER_VIEW => 'offer_views',
            AnalyticsEventService::EVENT_OFFER_CLICK => 'offer_clicks',
            AnalyticsEventService::EVENT_PROMO_COPY => 'offer_copies',
            AnalyticsEventService::EVENT_REVIEW_SUBMITTED => 'review_count',
            AnalyticsEventService::EVENT_REVIEW_REPLIED => 'review_reply_count',
            AnalyticsEventService::EVENT_PRODUCT_VIEW => 'product_views',
            AnalyticsEventService::EVENT_SERVICE_VIEW => 'service_views',
            AnalyticsEventService::EVENT_GALLERY_VIEW => 'gallery_views',
        ];

        return $map[$eventType] ?? null;
    }
}
