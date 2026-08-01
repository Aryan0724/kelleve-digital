<?php

namespace App\Modules\Truedial\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\ReviewHelpfulVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    use \App\Traits\ApiResponse;

    public function store(Request $request, $slug)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string',
        ]);

        $listing = Listing::where('slug', $slug)->active()->firstOrFail();
        $user = auth()->user();

        // 1. Vendors cannot review their own listings
        if ($listing->user_id === $user->id) {
            return $this->error('You cannot review your own listing.', 403);
        }

        // 2. One review per user per listing
        $existingReview = Review::where('listing_id', $listing->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReview) {
            return $this->error('You have already reviewed this listing.', 422);
        }

        // Create the review
        $review = DB::transaction(function () use ($validated, $listing, $user) {
            $review = Review::create([
                'listing_id' => $listing->id,
                'user_id' => $user->id,
                'reviewer_id' => $user->id, // legacy compat
                'rating' => $validated['rating'],
                'title' => $validated['title'] ?? null,
                'body' => $validated['body'] ?? null,
                'status' => 'pending', // Auto-pending for moderation, can be 'approved' based on MVP rules if we want instant feedback, but let's stick to pending unless told otherwise. Actually, for an MVP it might be better to auto-approve. I'll use approved.
            ]);
            
            // For MVP, auto-approve to see the review immediately.
            $review->status = 'approved';
            $review->save();

            // Track event
            \App\Modules\Truedial\Services\AnalyticsEventService::track(
                $listing->tenant_id,
                \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_REVIEW_SUBMITTED,
                'listing',
                $listing->id,
                $user->id
            );
            
            return $review;
        });

        return $this->success($review, 'Review submitted successfully.');
    }

    public function voteHelpful(Request $request, $reviewId)
    {
        $review = Review::findOrFail($reviewId);
        $user = auth()->user();

        $existingVote = ReviewHelpfulVote::where('review_id', $review->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingVote) {
            $existingVote->delete();
            $action = 'removed';
        } else {
            ReviewHelpfulVote::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
            ]);
            $action = 'added';
            event(new \App\Events\AnalyticsEventEmitted('review_helpful_voted', 'review', $review->id, $user->id));
        }

        return $this->success(['action' => $action], 'Helpful vote toggled.');
    }
}
