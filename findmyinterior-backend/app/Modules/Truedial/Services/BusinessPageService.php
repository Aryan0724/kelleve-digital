<?php

namespace App\Modules\Truedial\Services;

use App\Models\Listing;
use App\Modules\Truedial\DTOs\BusinessProfileDTO;
use Illuminate\Support\Facades\Cache;

class BusinessPageService
{
    protected BusinessProfileAssembler $assembler;

    public function __construct(BusinessProfileAssembler $assembler)
    {
        $this->assembler = $assembler;
    }

    public function getBusinessProfile(string $slug): BusinessProfileDTO
    {
        $cacheKey = "business_profile_data_{$slug}";

        $data = Cache::remember($cacheKey, now()->addHours(24), function () use ($slug) {
            $business = Listing::with([
                'category',
                'media' => function($query) {
                    $query->orderByDesc('is_cover')->orderBy('sort_order');
                },
                'listingProducts.media',
                'listingServices.media',
            ])->where('slug', $slug)
              ->firstOrFail();

            return $this->assembler->assemble($business)->toArray();
        });

        return new BusinessProfileDTO($data);
    }

    public function invalidateCache(int $listingId): void
    {
        $business = Listing::find($listingId);
        if ($business && $business->slug) {
            Cache::forget("business_profile_{$business->slug}");
            Cache::forget("business_profile_data_{$business->slug}");
        }
    }
}
