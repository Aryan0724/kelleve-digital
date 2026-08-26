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
        $listingIds = Listing::where('user_id', $user->id)
            ->when(app(\App\Core\Tenancy\TenantContext::class)->getTenantId(), fn($q, $tid) => $q->where('tenant_id', $tid))
            ->pluck('id');

        $offers = Offer::with(['media', 'listing'])
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
        $user = auth()->user();

        $listing = null;
        if ($request->filled('listing_id')) {
            $listing = Listing::find($request->listing_id);
        }
        if (!$listing) {
            $listing = Listing::where('user_id', $user->id)->first();
        }
        if (!$listing) {
            $listing = Listing::create([
                'user_id' => $user->id,
                'title' => $user->name . "'s Business",
                'slug' => \Illuminate\Support\Str::slug($user->name . '-' . rand(100, 999)),
                'status' => 'active',
                'city' => 'Delhi NCR',
            ]);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,active,paused,archived',
            'valid_until' => 'nullable|date',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable',
            'eligible_card_type' => 'nullable|string',
            'cta_label' => 'nullable|string',
            'cta_url' => 'nullable|string',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'exists:media,id'
        ]);

        $data = $request->except('media_ids');
        $data['listing_id'] = $listing->id;
        $data['status'] = $data['status'] ?? 'active';

        $offer = Offer::create($data);

        if ($request->has('media_ids')) {
            $mediaItems = \App\Models\Media::whereIn('id', $request->media_ids)->get();
            foreach ($mediaItems as $media) {
                $this->authorize('update', $media);
                $media->update([
                    'model_type' => $offer->getMorphClass(),
                    'model_id' => $offer->id
                ]);
            }
        }

        return $this->success($offer->load('media'), 'Offer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
            'status' => 'sometimes|nullable|in:draft,active,paused,archived',
            'valid_until' => 'nullable|date',
            'discount_type' => 'nullable|string',
            'discount_value' => 'nullable',
            'eligible_card_type' => 'nullable|string',
            'cta_label' => 'nullable|string',
            'cta_url' => 'nullable|string',
        ]);

        $offer = Offer::findOrFail($id);

        $offer->update($request->all());

        return $this->success($offer->load('media'), 'Offer updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        return $this->success(null, 'Offer deleted successfully.');
    }
}
