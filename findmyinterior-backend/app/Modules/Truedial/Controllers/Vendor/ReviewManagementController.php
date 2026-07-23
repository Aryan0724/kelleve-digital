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

        $reviews = Review::with(['user:id,name', 'listing:id,title', 'media', 'replies'])
            ->whereIn('listing_id', $listingIds)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return $this->success($reviews);
    }

    public function reply(Request $request, $reviewId)
    {
        $request->validate(['body' => 'required|string']);
        
        $review = Review::findOrFail($reviewId);
        
        $this->authorize('reply', $review);

        // Enforce one official reply
        if ($review->replies()->exists()) {
            return $this->error('You have already replied to this review.', 422);
        }

        $reply = ReviewReply::create([
            'review_id' => $review->id,
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        \App\Modules\Truedial\Services\AnalyticsEventService::track(
            $review->listing->tenant_id ?? 1, // Fallback to 1 if relation not loaded
            \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_REVIEW_REPLIED,
            'review',
            $review->id,
            auth()->id()
        );

        return $this->success($reply, 'Reply posted successfully.');
    }

    public function report(Request $request, $reviewId)
    {
        $request->validate([
            'reason' => 'required|string|in:Spam,Fake review,Offensive,Wrong business,Other',
            'notes' => 'nullable|string'
        ]);

        $review = Review::findOrFail($reviewId);
        
        $this->authorize('report', $review);

        $existingReport = \App\Models\ReviewReport::where('review_id', $review->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingReport) {
            return $this->error('You have already reported this review.', 422);
        }

        \App\Models\ReviewReport::create([
            'review_id' => $review->id,
            'user_id' => auth()->id(),
            'reason' => $request->reason,
            'notes' => $request->notes,
        ]);

        $review->status = 'reported';
        $review->save();

        // review_reported is not standard in the dashboard KPIs, but let's just comment it out for now as the user didn't request it in the enum
        // event(new \App\Events\AnalyticsEventEmitted('review_reported', 'review', $review->id, auth()->id()));

        return $this->success(null, 'Review has been reported for moderation.');
    }
}
