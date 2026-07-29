<?php

namespace App\Modules\Truedial\Repositories;

use App\Models\Review;
use App\Modules\Truedial\Contracts\Repositories\ReviewRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function getByListingId(int $listingId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::forCurrentTenant()
            ->where('listing_id', $listingId)
            ->with(['reviewer', 'replies', 'replies.user'])
            ->latest()
            ->paginate($perPage);
    }

    public function getApprovedListingReviews(int $listingId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::forCurrentTenant()
            ->where('listing_id', $listingId)
            ->approved()
            ->with(['user:id,name', 'media', 'replies.user:id,name'])
            ->withCount('helpfulVotes')
            ->latest()
            ->paginate($perPage);
    }

    public function getByUserId(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::forCurrentTenant()
            ->where('reviewer_id', $userId)
            ->with(['listing'])
            ->latest()
            ->paginate($perPage);
    }

    public function getForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::forCurrentTenant()
            ->whereHas('listing', function ($query) use ($vendorId) {
                $query->where('user_id', $vendorId);
            })
            ->with(['reviewer', 'listing', 'replies'])
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?Review
    {
        return Review::forCurrentTenant()->find($id);
    }

    public function create(array $data): Review
    {
        return Review::create($data);
    }

    public function update(Review $review, array $data): bool
    {
        return $review->update($data);
    }

    public function delete(Review $review): bool
    {
        return $review->delete();
    }
}
