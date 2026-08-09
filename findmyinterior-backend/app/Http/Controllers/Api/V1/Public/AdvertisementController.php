<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\AdvertisementStat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdvertisementController extends Controller
{
    public function index(Request $request)
    {
        $location = $request->query('location');
        if (!$location) {
            return response()->json(['status' => 'error', 'message' => 'Location is required'], 400);
        }

        $now = Carbon::now();

        $query = Advertisement::where('location', $location)
            ->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            });

        if ($request->filled('target_city')) {
            $query->where(function ($q) use ($request) {
                $q->whereNull('target_city')->orWhere('target_city', $request->query('target_city'));
            });
        }

        if ($request->filled('target_category_id')) {
            $query->where(function ($q) use ($request) {
                $q->whereNull('target_category_id')->orWhere('target_category_id', $request->query('target_category_id'));
            });
        }

        if ($request->filled('target_role')) {
            $query->where(function ($q) use ($request) {
                $role = $request->query('target_role');
                $q->whereNull('target_role')
                  ->orWhere('target_role', $role)
                  ->orWhere('target_role', 'like', '%"' . $role . '"%');
            });
        }

        $ads = $query->orderBy('priority', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $ads
        ]);
    }

    public function trackImpression(Request $request, $id)
    {
        $date = Carbon::now()->toDateString();
        
        AdvertisementStat::firstOrCreate(
            ['advertisement_id' => $id, 'date' => $date]
        )->increment('impressions');

        $this->checkAndPauseAd($id);

        return response()->json(['status' => 'success']);
    }

    public function trackClick(Request $request, $id)
    {
        $date = Carbon::now()->toDateString();
        
        AdvertisementStat::firstOrCreate(
            ['advertisement_id' => $id, 'date' => $date]
        )->increment('clicks');

        $this->checkAndPauseAd($id);

        return response()->json(['status' => 'success']);
    }

    private function checkAndPauseAd($id)
    {
        $ad = Advertisement::find($id);
        if (!$ad || !$ad->is_active) return;

        $pause = false;
        
        if ($ad->max_impressions > 0) {
            $totalImpressions = AdvertisementStat::where('advertisement_id', $id)->sum('impressions');
            if ($totalImpressions >= $ad->max_impressions) {
                $pause = true;
            }
        }

        if ($ad->max_clicks > 0) {
            $totalClicks = AdvertisementStat::where('advertisement_id', $id)->sum('clicks');
            if ($totalClicks >= $ad->max_clicks) {
                $pause = true;
            }
        }

        if ($pause) {
            $ad->update(['is_active' => false]);
        }
    }
}
