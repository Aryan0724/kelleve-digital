<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Listing;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request)
    {
        $offers = Offer::active()
            ->with(['media', 'listing:id,title,slug,address'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 12));

        return $this->success($offers);
    }

    public function businessOffers($slug)
    {
        $listing = Listing::where('slug', $slug)->firstOrFail();

        $offers = Offer::active()
            ->with(['media'])
            ->where('listing_id', $listing->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success($offers);
    }
}
