<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    use \App\Traits\ApiResponse;

    public function overview(Request $request)
    {
        $user = auth()->user();
        $listingId = $request->get('listing_id');

        // Verify ownership
        $query = Listing::where('user_id', $user->id);
        if ($listingId) {
            $query->where('id', $listingId);
        }
        $listingIds = $query->pluck('id')->toArray();

        if (empty($listingIds)) {
            return $this->success([
                'current' => $this->emptyMetrics(),
                'previous' => $this->emptyMetrics(),
                'trends' => []
            ]);
        }

        $period = $request->get('period', '30d'); // 7d, 30d, 90d
        $days = (int) str_replace('d', '', $period);
        if (!in_array($days, [7, 30, 90])) $days = 30;

        $endDate = Carbon::today();
        $startDate = Carbon::today()->subDays($days - 1);
        
        $prevEndDate = $startDate->copy()->subDay();
        $prevStartDate = $prevEndDate->copy()->subDays($days - 1);

        // Fetch current period
        $current = $this->aggregatePeriod($listingIds, $startDate, $endDate);
        
        // Fetch previous period for comparison (WoW / MoM)
        $previous = $this->aggregatePeriod($listingIds, $prevStartDate, $prevEndDate);

        // Calculate trends
        $trends = [];
        foreach ($current as $key => $value) {
            $prevValue = $previous[$key] ?? 0;
            if ($prevValue > 0) {
                $percentage = (($value - $prevValue) / $prevValue) * 100;
                $trends[$key] = round($percentage, 1);
            } else {
                $trends[$key] = $value > 0 ? 100 : 0;
            }
        }

        return $this->success([
            'current' => $current,
            'previous' => $previous,
            'trends' => $trends
        ]);
    }

    public function chart(Request $request)
    {
        $user = auth()->user();
        $listingId = $request->get('listing_id');

        // Verify ownership
        $query = Listing::where('user_id', $user->id);
        if ($listingId) {
            $query->where('id', $listingId);
        }
        $listingIds = $query->pluck('id')->toArray();

        if (empty($listingIds)) {
            return $this->success([]);
        }

        $period = $request->get('period', '30d');
        $days = (int) str_replace('d', '', $period);
        if (!in_array($days, [7, 30, 90])) $days = 30;

        $startDate = Carbon::today()->subDays($days - 1);

        $dailyData = DB::table('analytics_daily')
            ->whereIn('listing_id', $listingIds)
            ->where('date', '>=', $startDate->toDateString())
            ->select(
                'date',
                DB::raw('SUM(views) as views'),
                DB::raw('SUM(search_impressions) as search_impressions'),
                DB::raw('SUM(search_clicks) as search_clicks'),
                DB::raw('SUM(phone_clicks + whatsapp_clicks + website_clicks + direction_clicks) as total_interactions')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return $this->success($dailyData);
    }

    private function aggregatePeriod(array $listingIds, Carbon $startDate, Carbon $endDate)
    {
        $data = DB::table('analytics_daily')
            ->whereIn('listing_id', $listingIds)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select(
                DB::raw('SUM(views) as views'),
                DB::raw('SUM(search_impressions) as search_impressions'),
                DB::raw('SUM(search_clicks) as search_clicks'),
                DB::raw('SUM(gallery_views) as gallery_views'),
                DB::raw('SUM(product_views) as product_views'),
                DB::raw('SUM(service_views) as service_views'),
                DB::raw('SUM(offer_views) as offer_views'),
                DB::raw('SUM(offer_clicks) as offer_clicks'),
                DB::raw('SUM(offer_copies) as offer_copies'),
                DB::raw('SUM(website_clicks) as website_clicks'),
                DB::raw('SUM(phone_clicks) as phone_clicks'),
                DB::raw('SUM(whatsapp_clicks) as whatsapp_clicks'),
                DB::raw('SUM(direction_clicks) as direction_clicks'),
                DB::raw('SUM(review_count) as review_count'),
                DB::raw('SUM(review_reply_count) as review_reply_count')
            )
            ->first();

        return $data ? (array) $data : $this->emptyMetrics();
    }

    private function emptyMetrics()
    {
        return [
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
        ];
    }
}
