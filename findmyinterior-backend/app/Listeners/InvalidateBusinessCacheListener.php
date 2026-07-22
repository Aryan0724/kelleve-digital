<?php

namespace App\Listeners;

use App\Events\ListingUpdated;
use App\Modules\Truedial\Services\BusinessPageService;

class InvalidateBusinessCacheListener
{
    public function handle(ListingUpdated $event): void
    {
        $service = app(BusinessPageService::class);
        $service->invalidateCache($event->listing->id);
    }
}
