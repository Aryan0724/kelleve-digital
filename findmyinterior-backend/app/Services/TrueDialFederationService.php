<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrueDialFederationService
{
    /**
     * Get syndicated listings from the shared core database
     *
     * @param array $filters
     * @return \Illuminate\Support\Collection|array
     */
    public function getSyndicatedListings(array $filters = [])
    {
        try {
            $query = DB::table('syndicated_listings')
                ->where('is_active', true);

            if (!empty($filters['category'])) {
                $query->where('category', $filters['category']);
            }

            if (!empty($filters['city'])) {
                $query->where('city', $filters['city']);
            }

            if (!empty($filters['search'])) {
                $query->where('title', 'like', '%' . $filters['search'] . '%');
            }

            return $query->orderByDesc('rating')
                ->orderByDesc('review_count')
                ->paginate($filters['per_page'] ?? 15);
                
        } catch (\Exception $e) {
            Log::error('Failed to read syndicated listings', [
                'error' => $e->getMessage()
            ]);
            return ['cross_platform_unavailable' => true, 'data' => []];
        }
    }

    /**
     * Submit a cross-platform bid
     *
     * @param array $bidData
     * @return bool
     */
    public function submitCrossPlatformBid(array $bidData)
    {
        try {
            DB::table('cross_platform_bids')->insert([
                'source_platform' => 'truedial',
                'target_platform' => 'findmyinterior',
                'bidder_user_id' => $bidData['bidder_user_id'],
                'target_listing_id' => $bidData['target_listing_id'],
                'bid_amount' => $bidData['amount'],
                'timeline_days' => $bidData['timeline_days'],
                'message' => $bidData['message'],
                'status' => 'submitted',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to submit cross-platform bid', [
                'error' => $e->getMessage(),
                'bidData' => $bidData
            ]);
            return false;
        }
    }
}
