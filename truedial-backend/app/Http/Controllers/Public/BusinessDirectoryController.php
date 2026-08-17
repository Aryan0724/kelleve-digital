<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Traits\ApiResponse;
class BusinessDirectoryController extends Controller {
    use ApiResponse;
    public function index(Request $request) {
        $query = Listing::with(['category'])->active();
        if ($request->has('search')) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->has('city')) $query->where('city', $request->city);
        if ($request->has('category_id')) $query->where('category_id', $request->category_id);
        return $this->paginated($query->paginate(15));
    }
    public function show($slug) {
        $business = Listing::with(['category', 'gallery', 'reviews.user', 'offers', 'listingProducts', 'listingServices', 'media'])->where('slug', $slug)->firstOrFail();
        $business->increment('views_count');
        return $this->success($business);
    }
}
