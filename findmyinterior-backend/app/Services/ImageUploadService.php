<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    /**
     * Store a base64 encoded image to the local disk and return its URL path.
     * 
     * @param string $base64String
     * @param string $directory (e.g., 'avatars', 'rfqs')
     * @return string|null URL path of the saved image
     */
    public static function storeBase64($base64String, $directory = 'general')
    {
        if (empty($base64String)) {
            return null;
        }

        // If it's already a URL, just return it
        if (filter_var($base64String, FILTER_VALIDATE_URL) || Str::startsWith($base64String, '/storage/')) {
            return $base64String;
        }

        try {
            // Extract the extension and the image data
            preg_match('/^data:image\/(\w+);base64,/', $base64String, $type);
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1] ?? 'png'); // fallback to png
            
            // Clean up type for security/consistency
            if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $type = 'png';
            }

            $data = base64_decode($data);
            if ($data === false) {
                return null;
            }

            $fileName = Str::uuid() . '.' . $type;
            $path = $directory . '/' . $fileName;

            // Store to public disk (storage/app/public/)
            Storage::disk('public')->put($path, $data);

            // Return the URL path
            return '/storage/' . $path;

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Image upload failed: ' . $e->getMessage());
            return null;
        }
    }
}
