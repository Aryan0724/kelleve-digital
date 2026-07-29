<?php

namespace App\Modules\Truedial\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\ReviewHelpfulVote;
use App\Modules\Truedial\Services\ReviewService;
use App\Http\Requests\Truedial\ReviewStoreRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    use \App\Traits\ApiResponse;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function store(ReviewStoreRequest $request, string $slug): JsonResponse
    {
        try {
            $listing = Listing::where('slug', $slug)->active()->firstOrFail();
            $user = auth()->user();

            if ($listing->user_id === $user->id) {
                return $this->error('You cannot review your own listing.', 403);
            }

            $existingReview = Review::where('listing_id', $listing->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingReview) {
                return $this->error('You have already reviewed this listing.', 422);
            }

            $data = array_merge($request->validated(), [
                'listing_id' => $listing->id,
                'user_id' => $user->id,
            ]);

            $review = DB::transaction(function () use ($data, $listing, $user) {
                $review = $this->reviewService->createReview($data, $user->id);
                
                \App\Modules\Truedial\Services\AnalyticsEventService::track(
                    $listing->tenant_id ?? app(\App\Core\Tenancy\TenantContext::class)->getTenantId(),
                    \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_REVIEW_SUBMITTED,
                    'listing',
                    $listing->id,
                    $user->id
                );
                
                return $review;
            });

            return $this->success($review, 'Review submitted successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function voteHelpful(Request $request, int $reviewId): JsonResponse
    {
        try {
            $review = app(\App\Modules\Truedial\Contracts\Repositories\ReviewRepositoryInterface::class)->findById($reviewId);
            if (!$review) {
                return $this->error('Review not found.', 404);
            }

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
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
