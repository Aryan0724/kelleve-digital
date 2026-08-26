<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use App\Models\AdvertisementStat;
use App\Traits\ApiResponse;

class AdvertisementController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $location = $request->get('location', 'in_list');
        $city = $request->get('city');

        $query = Advertisement::where('is_active', true)
            ->where('location', $location);

        if ($city) {
            $query->where(function($q) use ($city) {
                $q->whereNull('target_city')->orWhere('target_city', $city);
            });
        }

        $ad = $query->orderByDesc('priority')->first();

        return $this->success($ad);
    }

    public function trackImpression(Request $request, $id)
    {
        AdvertisementStat::create([
            'advertisement_id' => $id,
            'type' => 'impression',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return $this->success(null, 'Impression recorded');
    }

    public function trackClick(Request $request, $id)
    {
        AdvertisementStat::create([
            'advertisement_id' => $id,
            'type' => 'click',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return $this->success(null, 'Click recorded');
    }
}
