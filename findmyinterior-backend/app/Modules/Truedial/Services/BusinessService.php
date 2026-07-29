<?php

namespace App\Modules\Truedial\Services;

use App\Models\Listing;
use App\Modules\Truedial\Contracts\Repositories\BusinessRepositoryInterface;
use App\Events\ListingUpdated;
use Illuminate\Support\Facades\Auth;
use App\Core\Tenancy\TenantContext;

class BusinessService
{
    protected BusinessRepositoryInterface $businessRepository;
    protected TenantContext $tenantContext;

    public function __construct(BusinessRepositoryInterface $businessRepository, TenantContext $tenantContext)
    {
        $this->businessRepository = $businessRepository;
        $this->tenantContext = $tenantContext;
    }

    /**
     * Get the current user's business profile.
     */
    public function getMyBusiness(): ?Listing
    {
        return $this->businessRepository->findByUserId(Auth::id());
    }

    /**
     * Get business by ID or fail.
     */
    public function getBusinessById(int $id): Listing
    {
        return $this->businessRepository->findOrFail($id);
    }

    /**
     * Create a new business profile.
     */
    public function createBusiness(array $data): Listing
    {
        $tenantId = $this->tenantContext->getTenantId();
        
        $data['tenant_id'] = $tenantId;
        $data['user_id'] = Auth::id();
        $data['slug'] = \Illuminate\Support\Str::slug($data['title']) . '-' . time();
        $data['status'] = 'pending'; // Requires admin approval

        $business = $this->businessRepository->create($data);

        return $business;
    }

    /**
     * Update an existing business profile.
     */
    public function updateBusiness(Listing $business, array $data): Listing
    {
        if (isset($data['title']) && $data['title'] !== $business->title) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['title']) . '-' . time();
        }

        $this->businessRepository->update($business, $data);

        // Fire Event
        event(new ListingUpdated($business));

        return $business->fresh();
    }
}
