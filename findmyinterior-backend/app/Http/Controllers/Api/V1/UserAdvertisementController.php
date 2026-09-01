<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class UserAdvertisementController extends Controller
{
    public function index(Request $request)
    {
        $ads = Advertisement::with('stats')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $ads
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:100',
            'banner_url' => 'nullable|string|max:255',
            'banner_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,webm|max:10240',
            'media_type' => 'required|string|in:image,video,html',
            'custom_code' => 'nullable|required_if:media_type,html|string',
            'link' => 'nullable|string|max:255',
            'target_city' => 'nullable|string',
            'target_category_id' => 'nullable|exists:categories,id',
            'budget' => 'required|numeric|min:100',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date'
        ]);

        if ($request->hasFile('banner_file')) {
            $validated['banner_url'] = \App\Helpers\ImageHelper::toStoragePath($request->file('banner_file'), 'advertisements');
        }

        if (in_array($validated['media_type'], ['image', 'video']) && empty($validated['banner_url'])) {
            return response()->json(['message' => 'The banner file or banner URL is required for image/video media type.', 'errors' => ['banner_file' => ['File is required.']]], 422);
        }

        $validated['user_id'] = $request->user()->id;
        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = false; // Requires admin approval or payment confirmation
        $validated['priority'] = 1; // Default low priority for self-serve

        // In a real scenario, deduct budget from Wallet here.

        $ad = Advertisement::create(\Illuminate\Support\Arr::except($validated, ['banner_file']));

        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement submitted successfully. It will be active once approved.',
            'data' => $ad
        ], 201);
    }
}
