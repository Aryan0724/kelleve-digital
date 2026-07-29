<?php

namespace App\Modules\Truedial\Contracts\Repositories;

use App\Models\Review;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReviewRepositoryInterface
{
    /**
     * Get reviews for a specific business/listing.
     */
    public function getByListingId(int $listingId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get approved reviews for a specific listing (Public).
     */
    public function getApprovedListingReviews(int $listingId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get reviews created by a specific user.
     */
    public function getByUserId(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get reviews for all businesses owned by a vendor.
     */
    public function getForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Find a review by ID.
     */
    public function findById(int $id): ?Review;

    /**
     * Create a new review.
     */
    public function create(array $data): Review;

    /**
     * Update an existing review.
     */
    public function update(Review $review, array $data): bool;

    /**
     * Delete a review.
     */
    public function delete(Review $review): bool;
}
