<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SyndicationService
{
    /**
     * Sync a local listing to the shared database
     *
     * @param Listing $listing
     * @return bool
     */
    public function syncListingToSharedDB(Listing $listing)
    {
        try {
            $thumbnailUrl = $listing->galleries()->where('is_cover', true)->value('image_url') 
                ?? $listing->galleries()->value('image_url');
                
            $profileUrl = config('app.url') . '/businesses/' . $listing->slug;

            DB::table('syndicated_listings')->updateOrInsert(
                [
                    'source_platform' => 'findmyinterior',
                    'source_id' => $listing->id
                ],
                [
                    'source_slug' => $listing->slug,
                    'category' => $listing->category?->name ?? 'Professional',
                    'title' => $listing->business_name,
                    'city' => $listing->city?->name,
                    'state' => $listing->city?->district?->state?->name ?? 'Bihar',
                    'is_verified' => (bool) $listing->is_verified,
                    'rating' => $listing->rating,
                    'review_count' => $listing->review_count ?? 0,
                    'thumbnail_url' => $thumbnailUrl,
                    'profile_url' => $profileUrl,
                    'last_synced_at' => Carbon::now(),
                    'is_active' => $listing->status === 'active' || $listing->status === 'published',
                    'updated_at' => Carbon::now()
                ]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to sync listing to shared DB', [
                'listing_id' => $listing->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Deactivate a listing in the shared database
     *
     * @param int $listingId
     * @return bool
     */
    public function deactivateListing(int $listingId)
    {
        try {
            DB::table('syndicated_listings')
                ->where('source_platform', 'findmyinterior')
                ->where('source_id', $listingId)
                ->update(['is_active' => false, 'updated_at' => Carbon::now()]);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to deactivate listing in shared DB', [
                'listing_id' => $listingId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
