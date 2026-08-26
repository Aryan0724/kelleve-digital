<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\ReviewReply;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class ReviewManagementController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $listingIds = Listing::where('user_id', $request->user()->id)->pluck('id');

        $reviews = Review::with(['user:id,name,avatar', 'listing:id,title', 'media'])
            ->whereIn('listing_id', $listingIds)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return $this->success($reviews);
    }

    public function reply(Request $request, $reviewId)
    {
        $request->validate(['body' => 'required|string']);

        $listingIds = Listing::where('user_id', $request->user()->id)->pluck('id');
        $review = Review::whereIn('listing_id', $listingIds)->findOrFail($reviewId);

        $reply = ReviewReply::updateOrCreate(
            ['review_id' => $review->id],
            [
                'user_id' => $request->user()->id,
                'body' => $request->body,
            ]
        );

        $review->update([
            'vendor_reply' => $request->body,
            'vendor_replied_at' => now(),
        ]);

        return $this->success($reply, 'Reply posted successfully');
    }
}
