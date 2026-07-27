<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdvertisementController extends Controller
{
    public function index(Request $request)
    {
        $ads = Advertisement::with('stats')->orderBy('created_at', 'desc')->paginate(20);
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
            'banner_url' => 'nullable|required_if:media_type,image,video|string|max:255',
            'media_type' => 'required|string|in:image,video,html',
            'custom_code' => 'nullable|required_if:media_type,html|string',
            'link' => 'nullable|string|max:255',
            'target_city' => 'nullable|string',
            'target_category_id' => 'nullable|exists:categories,id',
            'priority' => 'nullable|integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'boolean',
            'user_id' => 'nullable|exists:users,id',
            'budget' => 'nullable|numeric|min:0',
            'max_impressions' => 'nullable|integer|min:0',
            'max_clicks' => 'nullable|integer|min:0',
            'target_role' => 'nullable|string|max:50'
        ]);

        // Set defaults
        if (!isset($validated['priority'])) {
            $validated['priority'] = 0;
        }

        $validated['created_by'] = $request->user()->id;

        $ad = Advertisement::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement created successfully',
            'data' => $ad
        ]);
    }

    public function show($id)
    {
        $ad = Advertisement::with('stats')->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $ad
        ]);
    }

    public function update(Request $request, $id)
    {
        $ad = Advertisement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'location' => 'string|max:100',
            'banner_url' => 'string|max:255',
            'media_type' => 'string|in:image,video,html',
            'custom_code' => 'string|nullable',
            'link' => 'nullable|string|max:255',
            'target_city' => 'nullable|string',
            'target_category_id' => 'nullable|exists:categories,id',
            'priority' => 'integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'boolean',
            'user_id' => 'nullable|exists:users,id',
            'budget' => 'nullable|numeric|min:0',
            'max_impressions' => 'nullable|integer|min:0',
            'max_clicks' => 'nullable|integer|min:0',
            'target_role' => 'nullable|string|max:50'
        ]);

        $ad->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement updated successfully',
            'data' => $ad
        ]);
    }

    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);
        $ad->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement deleted successfully'
        ]);
    }
}
