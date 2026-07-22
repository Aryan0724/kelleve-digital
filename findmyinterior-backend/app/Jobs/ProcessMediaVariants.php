<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Log;

class ProcessMediaVariants implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $media;

    /**
     * Create a new job instance.
     */
    public function __construct(Media $media)
    {
        $this->media = $media;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $disk = $this->media->disk;
            $originalPath = 'media/' . $this->media->file_name;

            if (!Storage::disk($disk)->exists($originalPath)) {
                Log::warning('ProcessMediaVariants: Original file not found', ['media_id' => $this->media->id, 'path' => $originalPath]);
                return;
            }

            $content = Storage::disk($disk)->get($originalPath);
            $image = Image::read($content);

            $filenameWithoutExt = pathinfo($this->media->file_name, PATHINFO_FILENAME);
            $ext = pathinfo($this->media->file_name, PATHINFO_EXTENSION);

            $variants = [
                'thumbnail' => 150,
                'small' => 300,
                'medium' => 600,
                'large' => 1024,
            ];

            foreach ($variants as $variantName => $width) {
                // Read fresh copy for each variant to prevent quality loss over successive downsizes
                $img = Image::read($content);
                
                // Scale down keeping aspect ratio
                $img->scaleDown(width: $width);
                
                $variantFilename = "media/{$filenameWithoutExt}-{$variantName}.{$ext}";
                
                // Save to storage
                Storage::disk($disk)->put($variantFilename, (string) $img->encode());
            }

            Log::info('ProcessMediaVariants: Successfully generated variants', ['media_id' => $this->media->id]);
        } catch (\Exception $e) {
            Log::error('ProcessMediaVariants: Failed to process variants', [
                'media_id' => $this->media->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
