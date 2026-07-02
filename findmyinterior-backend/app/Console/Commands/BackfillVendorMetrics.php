<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\VendorMetric;
use App\Models\Bid;
use App\Models\Requirement;
use App\Models\ContactUnlock;
use App\Models\Review;

class BackfillVendorMetrics extends Command
{
    protected $signature = 'vendor:backfill-metrics';
    protected $description = 'Backfills vendor metrics from historical data';

    public function handle()
    {
        $this->info('Starting vendor metrics backfill...');
        $vendors = User::whereHas('roles', function ($q) {
            $q->whereIn('slug', ['business', 'builder', 'supplier', 'worker']);
        })->get();
        
        foreach ($vendors as $vendor) {
            $vid = $vendor->id;
            $metrics = VendorMetric::firstOrCreate(['vendor_id' => $vid]);
            
            $metrics->total_bids = Bid::where('professional_id', $vid)->count();
            $metrics->successful_bids = Bid::where('professional_id', $vid)->whereIn('status', ['accepted', 'awarded'])->count();
            $metrics->award_count = Requirement::where('awarded_vendor_id', $vid)->count();
            $metrics->projects_completed = Requirement::where('awarded_vendor_id', $vid)->where('status', 'completed')->count();
            $metrics->unlock_count = ContactUnlock::where('user_id', $vid)->count();
            
            $reviews = Review::where('reviewed_user_id', $vid);
            $metrics->review_count = $reviews->count();
            $metrics->review_sum = $reviews->sum('rating');
            
            $metrics->save();
        }
        $this->info('Vendor metrics backfilled successfully!');
    }
}
