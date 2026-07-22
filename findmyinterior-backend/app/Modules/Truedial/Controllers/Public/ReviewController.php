<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request, $slug)
    {
        $listing = Listing::where('slug', $slug)->active()->firstOrFail();

        $perPage = $request->get('per_page', 10);

        $reviews = Review::with(['user:id,name', 'media', 'replies.user:id,name'])
            ->withCount('helpfulVotes') // we'll need to define helpfulVotes in Review.php
            ->where('listing_id', $listing->id)
            ->approved()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->success($reviews);
    }
}
