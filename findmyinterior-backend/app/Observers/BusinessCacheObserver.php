<?php

namespace App\Observers;

use App\Models\Listing;
use App\Models\ListingProduct;
use App\Models\ListingService;
use App\Models\Media;
use App\Modules\Truedial\Services\BusinessPageService;

class BusinessCacheObserver
{
    protected function invalidateCache($model)
    {
        $listingId = null;

        if ($model instanceof Listing) {
            $listingId = $model->id;
        } elseif ($model instanceof ListingProduct || $model instanceof ListingService) {
            $listingId = $model->listing_id;
        } elseif ($model instanceof Media) {
            if ($model->model_type === Listing::class) {
                $listingId = $model->model_id;
            } elseif ($model->model_type === ListingProduct::class) {
                $listingId = ListingProduct::find($model->model_id)?->listing_id;
            } elseif ($model->model_type === ListingService::class) {
                $listingId = ListingService::find($model->model_id)?->listing_id;
            }
        }

        if ($listingId) {
            app(BusinessPageService::class)->invalidateCache($listingId);
        }
    }

    public function saved($model)
    {
        $this->invalidateCache($model);
    }

    public function deleted($model)
    {
        $this->invalidateCache($model);
    }
}
