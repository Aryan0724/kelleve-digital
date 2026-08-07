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

    /**
     * Legacy method: redirect to storage to prevent base64 DB blobs
     */
    public static function toBase64(
        \Illuminate\Http\UploadedFile $file,
        int $maxDimension = 800,
        int $quality = 80
    ): string {
        return self::toStoragePath($file, 'legacy');
    }
}
