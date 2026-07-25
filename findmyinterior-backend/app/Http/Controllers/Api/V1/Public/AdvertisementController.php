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
        } else {
            $query->whereNull('target_city');
        }

        if ($request->filled('target_category_id')) {
            $query->where(function ($q) use ($request) {
                $q->whereNull('target_category_id')->orWhere('target_category_id', $request->query('target_category_id'));
            });
        } else {
            $query->whereNull('target_category_id');
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

        return response()->json(['status' => 'success']);
    }

    public function trackClick(Request $request, $id)
    {
        $date = Carbon::now()->toDateString();
        
        AdvertisementStat::firstOrCreate(
            ['advertisement_id' => $id, 'date' => $date]
        )->increment('clicks');

        return response()->json(['status' => 'success']);
    }
}
