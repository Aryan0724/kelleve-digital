<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Listing;

class ListingUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Listing $listing;

    public function __construct(Listing $listing)
    {
        $this->listing = $listing;
    }
}
