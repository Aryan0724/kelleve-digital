<?php

namespace App\Modules\Truedial\Contracts\Repositories;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Collection;

interface BusinessRepositoryInterface
{
    /**
     * Find a business by ID.
     */
    public function findById(int $id): ?Listing;

    /**
     * Find a business by ID or fail.
     */
    public function findOrFail(int $id): Listing;

    /**
     * Find a business by user ID (for current tenant).
     */
    public function findByUserId(int $userId): ?Listing;

    /**
     * Create a new business listing.
     */
    public function create(array $data): Listing;

    /**
     * Update an existing business listing.
     */
    public function update(Listing $business, array $data): bool;

    /**
     * Soft delete a business listing.
     */
    public function delete(Listing $business): bool;
}
