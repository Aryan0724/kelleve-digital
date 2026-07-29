<?php

namespace App\Modules\Truedial\Repositories;

use App\Models\Listing;
use App\Modules\Truedial\Contracts\Repositories\BusinessRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BusinessRepository implements BusinessRepositoryInterface
{
    /**
     * Find a business by ID scoped to current tenant.
     */
    public function findById(int $id): ?Listing
    {
        return Listing::forCurrentTenant()->find($id);
    }

    /**
     * Find a business by ID or fail.
     */
    public function findOrFail(int $id): Listing
    {
        return Listing::forCurrentTenant()->findOrFail($id);
    }

    /**
     * Find a business by user ID scoped to current tenant.
     */
    public function findByUserId(int $userId): ?Listing
    {
        return Listing::forCurrentTenant()
            ->where('user_id', $userId)
            ->with(['category', 'city', 'gallery', 'listingProducts.media', 'listingServices.media'])
            ->first();
    }

    /**
     * Create a new business listing.
     */
    public function create(array $data): Listing
    {
        return Listing::create($data);
    }

    /**
     * Update an existing business listing.
     */
    public function update(Listing $business, array $data): bool
    {
        return $business->update($data);
    }

    /**
     * Soft delete a business listing.
     */
    public function delete(Listing $business): bool
    {
        return $business->delete();
    }
}
