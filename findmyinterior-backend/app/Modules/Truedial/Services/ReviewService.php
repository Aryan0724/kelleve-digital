<?php

namespace App\Modules\Truedial\Services;

use App\Models\Review;
use App\Models\ReviewReply;
use App\Modules\Truedial\Contracts\Repositories\ReviewRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository
    ) {}

    public function getVendorReviews(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reviewRepository->getForVendor($vendorId, $perPage);
    }

    public function getListingReviews(int $listingId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reviewRepository->getByListingId($listingId, $perPage);
    }

    public function getApprovedListingReviews(int $listingId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reviewRepository->getApprovedListingReviews($listingId, $perPage);
    }

    public function getUserReviews(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reviewRepository->getByUserId($userId, $perPage);
    }

    public function createReview(array $data, int $userId): Review
    {
        // Auto-approve reviews by default in Truedial? Based on schema, default might be 'pending'.
        // Let's set it to 'approved' for now if not specified.
        $data['reviewer_id'] = $userId;
        $data['status'] = $data['status'] ?? 'approved';
        
        if (isset($data['listing_id'])) {
            $data['reviewable_type'] = \App\Models\Listing::class;
            $data['reviewable_id'] = $data['listing_id'];
        }
        
        $review = $this->reviewRepository->create($data);
        
        // Dispatch event if needed
        // Event::dispatch(new \App\Events\ReviewCreated($review));

        return $review;
    }

    public function replyToReview(int $reviewId, array $data, int $userId): ReviewReply
    {
        $review = $this->reviewRepository->findById($reviewId);

        if (!$review) {
            throw new \Exception("Review not found.");
        }

        // Logic for reply
        $reply = new ReviewReply([
            'tenant_id' => app(\App\Core\Tenancy\TenantContext::class)->getTenantId(),
            'review_id' => $review->id,
            'user_id' => $userId,
            'body' => $data['body'],
            'status' => 'approved', // Or pending
        ]);

        $reply->save();

        return $reply;
    }

    public function reportReview(int $reviewId, array $data, int $userId): bool
    {
        $review = $this->reviewRepository->findById($reviewId);
        
        if (!$review) {
            throw new \Exception("Review not found.");
        }

        // Logic to report a review. 
        // Let's assume we flag it or create a report record. For now, we update status to flagged.
        return $this->reviewRepository->update($review, ['status' => 'flagged']);
    }
}
