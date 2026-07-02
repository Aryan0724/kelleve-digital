<?php

namespace App\Helpers;

class ImageHelper
{
    /**
     * Convert an uploaded file to a base64 data URI.
     * Resizes to max 800px and compresses to JPEG 80% using GD
     * so the stored string stays small (~50-150KB typically).
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param int $maxDimension  Max width or height in pixels
     * @param int $quality       JPEG quality 1-100
     * @return string  data:image/jpeg;base64,...
     */
    public static function toBase64(
        \Illuminate\Http\UploadedFile $file,
        int $maxDimension = 800,
        int $quality = 80
    ): string {
        // Use GD to resize + re-encode as JPEG
        $mime = $file->getMimeType();
        $path = $file->getRealPath();

        if (function_exists('imagecreatefromstring') && $path) {
            try {
                $raw = file_get_contents($path);
                $src = imagecreatefromstring($raw);

                if ($src !== false) {
                    $origW = imagesx($src);
                    $origH = imagesy($src);

                    // Calculate scaled dimensions
                    if ($origW > $maxDimension || $origH > $maxDimension) {
                        $ratio = min($maxDimension / $origW, $maxDimension / $origH);
                        $newW  = (int) round($origW * $ratio);
                        $newH  = (int) round($origH * $ratio);
                    } else {
                        $newW = $origW;
                        $newH = $origH;
                    }

                    $dst = imagecreatetruecolor($newW, $newH);

                    // Preserve transparency for PNG
                    imagealphablending($dst, false);
                    imagesavealpha($dst, true);
                    $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
                    imagefilledrectangle($dst, 0, 0, $newW, $newH, $transparent);

                    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

                    ob_start();
                    imagejpeg($dst, null, $quality);
                    $jpeg = ob_get_clean();

                    imagedestroy($src);
                    imagedestroy($dst);

                    return 'data:image/jpeg;base64,' . base64_encode($jpeg);
                }
            } catch (\Throwable $e) {
                // Fall through to raw base64 below
            }
        }

        // Fallback: just base64-encode the raw file bytes
        $raw  = file_get_contents($file->getRealPath());
        $mime = $file->getMimeType() ?: 'image/jpeg';
        return "data:{$mime};base64," . base64_encode($raw);
    }
}
