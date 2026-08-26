<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $listing = Listing::where('user_id', $request->user()->id)->first();
        if (!$listing) {
            return $this->success([]);
        }

        $media = Media::where('model_type', 'listing')
            ->where('model_id', $listing->id)
            ->orderBy('sort_order')
            ->get();

        return $this->success($media);
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'model_type' => 'nullable|string',
            'model_id' => 'nullable|integer',
        ]);

        $listing = Listing::where('user_id', $request->user()->id)->first();
        $modelId = $request->input('model_id') ?: ($listing ? $listing->id : 0);
        $modelType = $request->input('model_type') ?: 'listing';

        $files = $request->file('files') ?: ($request->file('file') ? [$request->file('file')] : []);

        if (empty($files)) {
            return $this->error('No files provided', 400);
        }

        $uploaded = [];
        foreach ($files as $file) {
            $fileName = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('media', $fileName, 'public');

            $media = Media::create([
                'model_type' => $modelType,
                'model_id' => $modelId,
                'collection_name' => 'gallery',
                'file_name' => $fileName,
                'mime_type' => $file->getClientMimeType(),
                'disk' => 'public',
                'size' => $file->getSize(),
                'sort_order' => 0,
            ]);

            $media->url = asset('storage/' . $path);
            $uploaded[] = $media;
        }

        return $this->success($uploaded, 'Media uploaded successfully', 201);
    }

    public function destroy(Request $request, $id)
    {
        $media = Media::findOrFail($id);
        
        if (Storage::disk($media->disk)->exists('media/' . $media->file_name)) {
            Storage::disk($media->disk)->delete('media/' . $media->file_name);
        }

        $media->delete();
        return $this->success(null, 'Media deleted successfully');
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
        ]);

        foreach ($request->ordered_ids as $index => $id) {
            Media::where('id', $id)->update(['sort_order' => $index]);
        }

        return $this->success(null, 'Order updated successfully');
    }

    public function setCover(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        Media::where('model_type', $media->model_type)
            ->where('model_id', $media->model_id)
            ->update(['is_cover' => false]);

        $media->update(['is_cover' => true]);

        // Also update cover_image on listing if applicable
        if ($media->model_type === 'listing') {
            Listing::where('id', $media->model_id)->update([
                'cover_image' => asset('storage/media/' . $media->file_name)
            ]);
        }

        return $this->success($media, 'Cover set successfully');
    }
}
