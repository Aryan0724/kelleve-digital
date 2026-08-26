<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SavedVendor;
use App\Models\Listing;
use App\Traits\ApiResponse;

class SavedVendorController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $vendorIds = SavedVendor::where('user_id', $request->user()->id)->pluck('vendor_id');
        $businesses = Listing::whereIn('id', $vendorIds)->with(['category', 'gallery'])->get();

        return $this->success($businesses);
    }

    public function toggle(Request $request, $id)
    {
        $existing = SavedVendor::where('user_id', $request->user()->id)
            ->where('vendor_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->success(['saved' => false], 'Business removed from saved list');
        } else {
            SavedVendor::create([
                'user_id' => $request->user()->id,
                'vendor_id' => $id
            ]);
            return $this->success(['saved' => true], 'Business saved successfully');
        }
    }
}
