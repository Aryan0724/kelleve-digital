<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Core\Tenancy\TenantContext;

class MediaController extends Controller
{
    use \App\Traits\ApiResponse;

    protected MediaService $mediaService;
    protected TenantContext $tenantContext;

    public function __construct(MediaService $mediaService, TenantContext $tenantContext)
    {
        $this->mediaService = $mediaService;
        $this->tenantContext = $tenantContext;
    }

    /**
     * Upload one or multiple images
     */
    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10', // Max 10 files per request
            'files.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Max 10MB per file
            'model_type' => 'required|string',
            'model_id' => 'required|integer',
            'collection_name' => 'nullable|string',
        ]);

        $tenantId = $this->tenantContext->getTenantId();
        
        // Ensure the model exists and belongs to the user
        $modelClass = $request->input('model_type');
        
        // Basic security to ensure only allowed models can be attached to
        $allowedModels = [
            'listing' => \App\Models\Listing::class,
            'product' => \App\Models\ListingProduct::class,
            'service' => \App\Models\ListingService::class,
        ];
        
        if (!array_key_exists($modelClass, $allowedModels)) {
            return $this->error('Invalid model type', 400);
        }
        
        $model = $allowedModels[$modelClass]::where('tenant_id', $tenantId);
        
        $userId = auth()->id();
        if ($modelClass === 'listing') {
            $model = $model->where('user_id', $userId);
        } else {
            $model = $model->whereHas('listing', function($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        }
        
        $model = $model->find($request->input('model_id'));
        if (!$model) {
            return $this->error('Model not found or access denied', 404);
        }

        $uploadedMedia = [];
        $collectionName = $request->input('collection_name', 'gallery');

        foreach ($request->file('files') as $file) {
            try {
                $media = $this->mediaService->attach($model, $file, $collectionName, [
                    'sort_order' => $model->media()->max('sort_order') + 1,
                ]);
                $uploadedMedia[] = $media;
            } catch (\Exception $e) {
                Log::error('Media upload failed', ['error' => $e->getMessage()]);
                // We continue uploading other files if one fails, but we might want to return partial success
            }
        }

        if (empty($uploadedMedia)) {
            return $this->error('All uploads failed. Check logs.', 500);
        }

        return $this->success($uploadedMedia, 'Media uploaded successfully');
    }

    /**
     * Soft delete media
     */
    public function destroy($id)
    {
        $tenantId = $this->tenantContext->getTenantId();
        $media = Media::where('tenant_id', $tenantId)->findOrFail($id);
        
        $this->authorize('delete', $media);
        
        $media->delete();
        
        return $this->success(null, 'Media deleted successfully');
    }

    /**
     * Update order of media
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'integer|exists:media,id',
        ]);

        $tenantId = $this->tenantContext->getTenantId();
        
        DB::transaction(function () use ($request, $tenantId) {
            foreach ($request->input('ordered_ids') as $index => $id) {
                $media = Media::where('tenant_id', $tenantId)->find($id);
                if ($media) {
                    $this->authorize('update', $media);
                    $media->update(['sort_order' => $index]);
                }
            }
        });

        return $this->success(null, 'Order updated successfully');
    }

    /**
     * Set as cover image
     */
    public function setCover($id)
    {
        $tenantId = $this->tenantContext->getTenantId();
        $media = Media::where('tenant_id', $tenantId)->findOrFail($id);
        
        $this->authorize('update', $media);
        
        DB::transaction(function () use ($media, $tenantId) {
            // Unset previous covers for this model/collection
            Media::where('tenant_id', $tenantId)
                ->where('model_type', $media->model_type)
                ->where('model_id', $media->model_id)
                ->where('collection_name', $media->collection_name)
                ->update(['is_cover' => false]);
                
            $media->update(['is_cover' => true]);
        });
        
        return $this->success($media, 'Cover image set successfully');
    }
}
