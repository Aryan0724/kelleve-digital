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
        $query = Advertisement::orderBy('created_at', 'desc');
        if (\Illuminate\Support\Facades\Schema::connection('fmi_mysql')->hasTable('advertisement_stats')) {
            $query->with('stats');
        }
        $ads = $query->paginate(20);
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
            'banner_url' => 'nullable|string|max:2048',
            'banner_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,webm|max:10240',
            'media_type' => 'required|string|in:image,video,html',
            'custom_code' => 'nullable|required_if:media_type,html|string',
            'link' => 'nullable|string|max:2048',
            'target_city' => 'nullable|string',
            'target_category_id' => 'nullable|exists:categories,id',
            'priority' => 'nullable|integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'nullable',
            'user_id' => 'nullable|exists:users,id',
            'budget' => 'nullable|numeric|min:0',
            'max_impressions' => 'nullable|integer|min:0',
            'max_clicks' => 'nullable|integer|min:0',
            'target_role' => 'nullable|string|max:50'
        ]);

        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
        }

        if ($request->hasFile('banner_file')) {
            $validated['banner_url'] = \App\Helpers\ImageHelper::toStoragePath($request->file('banner_file'), 'advertisements');
        }

        if (in_array($validated['media_type'], ['image', 'video']) && empty($validated['banner_url'])) {
            return response()->json(['message' => 'The banner file or banner URL is required for image/video media type.', 'errors' => ['banner_file' => ['File is required.']]], 422);
        }

        // Set defaults
        if (!isset($validated['priority'])) {
            $validated['priority'] = 0;
        }

        $validated['created_by'] = $request->user()->id;

        $ad = Advertisement::create(\Illuminate\Support\Arr::except($validated, ['banner_file']));

        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement created successfully',
            'data' => $ad
        ]);
    }

    public function show($id)
    {
        $query = Advertisement::query();
        if (\Illuminate\Support\Facades\Schema::connection('fmi_mysql')->hasTable('advertisement_stats')) {
            $query->with('stats');
        }
        $ad = $query->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $ad
        ]);
    }

    public function update(Request $request, $id)
    {
        $ad = Advertisement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:100',
            'banner_url' => 'nullable|string|max:2048',
            'banner_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,webm|max:10240',
            'media_type' => 'nullable|string|in:image,video,html',
            'custom_code' => 'nullable|string',
            'link' => 'nullable|string|max:2048',
            'target_city' => 'nullable|string',
            'target_category_id' => 'nullable|exists:categories,id',
            'priority' => 'nullable|integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'nullable',
            'user_id' => 'nullable|exists:users,id',
            'budget' => 'nullable|numeric|min:0',
            'max_impressions' => 'nullable|integer|min:0',
            'max_clicks' => 'nullable|integer|min:0',
            'target_role' => 'nullable|string|max:50'
        ]);

        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $ad->is_active;
        }

        if ($request->hasFile('banner_file')) {
            $validated['banner_url'] = \App\Helpers\ImageHelper::toStoragePath($request->file('banner_file'), 'advertisements');
        }

        $ad->update(\Illuminate\Support\Arr::except($validated, ['banner_file']));

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
