<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;
use App\Models\Listing;
use App\Traits\ApiResponse;

class OfferManagementController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $listing = Listing::where('user_id', $request->user()->id)->first();
        if (!$listing) {
            return $this->success([]);
        }

        $offers = Offer::where('listing_id', $listing->id)->get();
        return $this->success($offers);
    }

    public function store(Request $request)
    {
        $listing = Listing::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable|numeric',
            'valid_until' => 'nullable|date',
            'status' => 'nullable|in:draft,active,paused,archived',
            'cta_label' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:255',
        ]);

        $validated['listing_id'] = $listing->id;
        $validated['status'] = $validated['status'] ?? 'active';

        $offer = Offer::create($validated);

        return $this->success($offer, 'Offer created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::where('user_id', $request->user()->id)->firstOrFail();
        $offer = Offer::where('listing_id', $listing->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable|numeric',
            'valid_until' => 'nullable|date',
            'status' => 'nullable|in:draft,active,paused,archived',
            'cta_label' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:255',
        ]);

        $offer->update($validated);

        return $this->success($offer, 'Offer updated successfully');
    }

    public function destroy(Request $request, $id)
    {
        $listing = Listing::where('user_id', $request->user()->id)->firstOrFail();
        $offer = Offer::where('listing_id', $listing->id)->findOrFail($id);
        $offer->delete();

        return $this->success(null, 'Offer deleted successfully');
    }
}
