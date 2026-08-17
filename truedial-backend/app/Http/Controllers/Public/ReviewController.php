<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Traits\ApiResponse;
class ReviewController extends Controller {
    use ApiResponse;
    public function index($slug) {
        $listing = Listing::where('slug', $slug)->firstOrFail();
        return $this->success($listing->reviews()->approved()->with('user')->get());
    }
}
