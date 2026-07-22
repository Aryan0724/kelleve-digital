<?php

namespace App\Services;

use App\Jobs\ProcessMediaVariants;
use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Attach a base64 image or UploadedFile to a model.
     * Note: Currently using local disk, to be migrated to S3.
     */
    public function attach(Model $model, string|UploadedFile $file, string $collectionName = 'gallery', array $attributes = []): Media
    {
        $disk = 'public';
        $path = $this->storeFile($file, $disk);
        
        $media = new Media([
            'tenant_id' => $model->tenant_id ?? null,
            'collection_name' => $collectionName,
            'file_name' => basename($path),
            'mime_type' => $this->getMimeType($file),
            'disk' => $disk,
            'size' => $this->getFileSize($file, $disk, $path),
            'width' => $attributes['width'] ?? null,
            'height' => $attributes['height'] ?? null,
            'alt_text' => $attributes['alt_text'] ?? null,
            'blur_hash' => $attributes['blur_hash'] ?? null,
            'dominant_color' => $attributes['dominant_color'] ?? null,
            'sort_order' => $attributes['sort_order'] ?? 0,
        ]);

        $media = $model->media()->save($media);
        
        // Dispatch job to generate variants
        ProcessMediaVariants::dispatch($media);
        
        return $media;
    }

    protected function storeFile($file, string $disk): string
    {
        if ($file instanceof UploadedFile) {
            return $file->store('media', $disk);
        }

        // Handle Base64
        if (preg_match('/^data:image\/(\w+);base64,/', $file, $type)) {
            $file = substr($file, strpos($file, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                throw new \Exception('Invalid image type');
            }

            $file = base64_decode($file);
            if ($file === false) {
                throw new \Exception('Base64 decode failed');
            }
            
            $fileName = 'media/' . Str::uuid() . '.' . $type;
            Storage::disk($disk)->put($fileName, $file);
            return $fileName;
        }

        throw new \Exception('Unsupported file format');
    }

    protected function getMimeType($file): ?string
    {
        if ($file instanceof UploadedFile) {
            return $file->getMimeType();
        }
        
        if (preg_match('/^data:image\/(\w+);base64,/', $file, $type)) {
            return 'image/' . strtolower($type[1]);
        }
        
        return null;
    }
    
    protected function getFileSize($file, string $disk, string $path): int
    {
        if ($file instanceof UploadedFile) {
            return $file->getSize();
        }
        
        return Storage::disk($disk)->size($path);
    }
}
