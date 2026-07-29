<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Truedial\Services\ReviewService;
use App\Http\Requests\Truedial\ReviewReplyRequest;
use App\Http\Requests\Truedial\ReviewReportRequest;
use Illuminate\Http\JsonResponse;

class ReviewManagementController extends Controller
{
    use \App\Traits\ApiResponse;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        
        $reviews = $this->reviewService->getVendorReviews(auth()->id(), $perPage);

        return $this->success($reviews);
    }

    public function reply(ReviewReplyRequest $request, int $reviewId): JsonResponse
    {
        try {
            // Check if review exists (service handles not found, but we need it for policy)
            // But we shouldn't bypass service. The policy requires the model.
            // Let's get the review from repo via service or just let service handle it.
            // Wait, we need the review for policy `authorize('reply', $review)`. 
            // Better to load it here for authorization, but then Service does the logic.
            // OR we can let Service handle everything and throw AuthorizationException.
            
            // For now, load review manually just for policy, to keep authorization in Controller.
            $review = app(\App\Modules\Truedial\Contracts\Repositories\ReviewRepositoryInterface::class)->findById($reviewId);
            if (!$review) {
                return $this->error('Review not found.', 404);
            }
            
            $this->authorize('reply', $review);

            if ($review->replies()->exists()) {
                return $this->error('You have already replied to this review.', 422);
            }

            $reply = $this->reviewService->replyToReview($reviewId, $request->validated(), auth()->id());

            // Track analytics
            \App\Modules\Truedial\Services\AnalyticsEventService::track(
                $review->listing->tenant_id ?? app(\App\Core\Tenancy\TenantContext::class)->getTenantId(),
                \App\Modules\Truedial\Services\AnalyticsEventService::EVENT_REVIEW_REPLIED,
                'review',
                $review->id,
                auth()->id()
            );

            return $this->success($reply, 'Reply posted successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function report(ReviewReportRequest $request, int $reviewId): JsonResponse
    {
        try {
            $review = app(\App\Modules\Truedial\Contracts\Repositories\ReviewRepositoryInterface::class)->findById($reviewId);
            if (!$review) {
                return $this->error('Review not found.', 404);
            }
            
            $this->authorize('report', $review);

            $existingReport = \App\Models\ReviewReport::where('review_id', $reviewId)
                ->where('user_id', auth()->id())
                ->first();

            if ($existingReport) {
                return $this->error('You have already reported this review.', 422);
            }

            \App\Models\ReviewReport::create([
                'review_id' => $reviewId,
                'user_id' => auth()->id(),
                'reason' => $request->reason,
                'notes' => $request->notes,
            ]);

            $this->reviewService->reportReview($reviewId, $request->validated(), auth()->id());

            return $this->success(null, 'Review has been reported for moderation.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
