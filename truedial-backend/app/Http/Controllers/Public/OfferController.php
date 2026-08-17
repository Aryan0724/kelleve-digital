<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Listing;
use App\Traits\ApiResponse;
class OfferController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(Offer::active()->with('listing')->get()); }
    public function businessOffers($slug) {
        $listing = Listing::where('slug', $slug)->firstOrFail();
        return $this->success($listing->offers()->active()->get());
    }
}
