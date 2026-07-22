<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\ListingService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    /**
     * Synchronizes a listing's services with the provided array of service data.
     * Replaces existing services that are not in the new array.
     */
    public function syncServices(Listing $listing, array $servicesData)
    {
        return DB::transaction(function () use ($listing, $servicesData) {
            $existingServiceIds = $listing->listingServices()->pluck('id')->toArray();
            $updatedOrCreatedIds = [];
            $sortOrder = 0;

            foreach ($servicesData as $serviceData) {
                // Determine uniqueness by ID if provided, otherwise by name
                $id = $serviceData['id'] ?? null;
                $name = $serviceData['name'];

                $service = null;
                if ($id) {
                    $service = $listing->listingServices()->find($id);
                }

                if (!$service) {
                    $service = new ListingService();
                    $service->listing_id = $listing->id;
                    $service->tenant_id = $listing->tenant_id;
                    $service->slug = Str::slug($name) . '-' . uniqid();
                }

                $service->name = $name;
                $service->description = $serviceData['description'] ?? null;
                $service->price_starting_at = isset($serviceData['price']) ? (float)$serviceData['price'] : null;
                $service->sort_order = $sortOrder++;
                $service->status = 'active';

                $service->save();
                $updatedOrCreatedIds[] = $service->id;

                // Handle Media if provided (Base64)
                if (!empty($serviceData['image']) && preg_match('/^data:image/', $serviceData['image'])) {
                    $service->primaryMedia()->delete();
                    app(MediaService::class)->attach($service, $serviceData['image'], 'cover');
                }
            }

            // Delete services that were removed in the UI
            $idsToDelete = array_diff($existingServiceIds, $updatedOrCreatedIds);
            if (!empty($idsToDelete)) {
                $listing->listingServices()->whereIn('id', $idsToDelete)->delete();
            }

            return $listing->listingServices()->withMedia()->get();
        });
    }
}
