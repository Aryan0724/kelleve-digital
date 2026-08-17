<?php
namespace App\Http\Controllers\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Review;
use App\Traits\ApiResponse;
class ReviewController extends Controller {
    use ApiResponse;
    public function store(Request $request, $slug) {
        $listing = Listing::where('slug', $slug)->firstOrFail();
        $review = $listing->reviews()->create($request->all() + ['user_id' => $request->user()->id, 'status' => 'approved']);
        return $this->success($review, 'Review added');
    }
    public function voteHelpful($id) {
        return $this->success(null, 'Voted helpful');
    }
}
