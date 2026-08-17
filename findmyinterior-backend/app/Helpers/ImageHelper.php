<?php

namespace App\Helpers;

class ImageHelper
{
    /**
     * Store an uploaded file to public storage and return the URL path.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $directory Directory within storage/app/public/
     * @return string URL path to the image
     */
    public static function toStoragePath(\Illuminate\Http\UploadedFile $file, string $directory = 'images'): string
    {
        $path = $file->store($directory, 'public');
        return '/storage/' . $path;
    }

    public static function toBase64(
        \Illuminate\Http\UploadedFile $file,
        int $maxDimension = 800,
        int $quality = 80
    ): string {
        // Fallback: just base64-encode the raw file bytes
        // The frontend already compresses images to max 1200x1200, so we can safely store this directly.
        $raw  = file_get_contents($file->getRealPath());
        $mime = $file->getMimeType() ?: 'image/jpeg';
        return "data:{$mime};base64," . base64_encode($raw);
    }
}
