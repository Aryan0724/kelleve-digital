<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UnifiedStorageService
{
    /**
     * Store an uploaded file to the public disk safely.
     *
     * @param UploadedFile $file The actual file upload (multipart/form-data)
     * @param string $directory The directory to store in (e.g., 'avatars', 'portfolios')
     * @return string The public URL path to the stored file
     */
    public function storeFile(UploadedFile $file, string $directory = 'uploads'): string
    {
        // Generate a safe, random filename
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        
        // Store it using Laravel's robust storage system
        $path = $file->storeAs($directory, $filename, 'public');
        
        return Storage::disk('public')->url($path);
    }

    /**
     * Parse a base64 encoded string and store it as a file.
     * This is maintained for frontend compatibility during C-0 but standard multipart is preferred.
     *
     * @param string $base64String
     * @param string $directory
     * @return string The public URL path to the stored file
     */
    public function storeBase64(string $base64String, string $directory = 'uploads'): string
    {
        // Extract the mime type and the actual base64 data
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $base64String = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                throw new \Exception('Invalid image type');
            }

            $base64String = str_replace(' ', '+', $base64String);
            $decodedData = base64_decode($base64String);

            if ($decodedData === false) {
                throw new \Exception('Base64 decode failed');
            }
        } else {
            throw new \Exception('Did not match data URI with image data');
        }

        $filename = Str::uuid() . '.' . $type;
        $path = $directory . '/' . $filename;
        
        Storage::disk('public')->put($path, $decodedData);
        
        return Storage::disk('public')->url($path);
    }
}
