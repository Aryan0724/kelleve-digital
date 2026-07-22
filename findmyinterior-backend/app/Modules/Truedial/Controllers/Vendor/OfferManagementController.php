<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Offer;
use Illuminate\Http\Request;

class OfferManagementController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request)
    {
        $user = auth()->user();
        $listingIds = Listing::where('user_id', $user->id)->pluck('id');

        $offers = Offer::with(['media'])
            ->whereIn('listing_id', $listingIds)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        // Use computed status in response
        $offers->getCollection()->transform(function($offer) {
            $offer->status = $offer->computed_status;
            return $offer;
        });

        return $this->success($offers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:20',
            'status' => 'required|in:draft,active,paused,archived',
            'valid_until' => 'nullable|date',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable|numeric',
            'cta_label' => 'nullable|string',
            'cta_url' => 'nullable|string',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'exists:media,id'
        ]);

        $user = auth()->user();
        $listing = Listing::findOrFail($request->listing_id);

        if ($listing->user_id !== $user->id) {
            return $this->error('You do not own this listing.', 403);
        }

        $offer = Offer::create($request->except('media_ids'));

        if ($request->has('media_ids')) {
            \App\Models\Media::whereIn('id', $request->media_ids)
                ->where('user_id', $user->id)
                ->update([
                    'model_type' => Offer::class,
                    'model_id' => $offer->id
                ]);
        }

        return $this->success($offer->load('media'), 'Offer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:20',
            'status' => 'sometimes|required|in:draft,active,paused,archived',
            'valid_until' => 'nullable|date',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable|numeric',
            'cta_label' => 'nullable|string',
            'cta_url' => 'nullable|string',
        ]);

        $offer = Offer::findOrFail($id);
        $user = auth()->user();

        if (!$offer->listing || $offer->listing->user_id !== $user->id) {
            return $this->error('You do not own this listing.', 403);
        }

        $offer->update($request->all());

        return $this->success($offer->load('media'), 'Offer updated successfully.');
    }
}
