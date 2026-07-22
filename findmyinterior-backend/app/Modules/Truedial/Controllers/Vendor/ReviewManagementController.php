<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\ReviewReply;
use Illuminate\Http\Request;

class ReviewManagementController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request)
    {
        $user = auth()->user();
        $listingIds = Listing::where('user_id', $user->id)->pluck('id');

        $reviews = Review::with(['user:id,name', 'media', 'replies'])
            ->whereIn('listing_id', $listingIds)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return $this->success($reviews);
    }

    public function reply(Request $request, $reviewId)
    {
        $request->validate(['body' => 'required|string']);
        
        $review = Review::findOrFail($reviewId);
        $user = auth()->user();

        // Check ownership
        if (!$review->listing || $review->listing->user_id !== $user->id) {
            return $this->error('You do not own this listing.', 403);
        }

        // Enforce one official reply
        if ($review->replies()->exists()) {
            return $this->error('You have already replied to this review.', 422);
        }

        $reply = ReviewReply::create([
            'review_id' => $review->id,
            'user_id' => $user->id,
            'body' => $request->body,
        ]);

        event(new \App\Events\AnalyticsEventEmitted('review_replied', 'review', $review->id, $user->id));

        return $this->success($reply, 'Reply posted successfully.');
    }

    public function report(Request $request, $reviewId)
    {
        $request->validate([
            'reason' => 'required|string|in:Spam,Fake review,Offensive,Wrong business,Other',
            'notes' => 'nullable|string'
        ]);

        $review = Review::findOrFail($reviewId);
        $user = auth()->user();

        if (!$review->listing || $review->listing->user_id !== $user->id) {
            return $this->error('You do not own this listing.', 403);
        }

        $existingReport = \App\Models\ReviewReport::where('review_id', $review->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReport) {
            return $this->error('You have already reported this review.', 422);
        }

        \App\Models\ReviewReport::create([
            'review_id' => $review->id,
            'user_id' => $user->id,
            'reason' => $request->reason,
            'notes' => $request->notes,
        ]);

        $review->status = 'reported';
        $review->save();

        event(new \App\Events\AnalyticsEventEmitted('review_reported', 'review', $review->id, $user->id));

        return $this->success(null, 'Review has been reported for moderation.');
    }
}
