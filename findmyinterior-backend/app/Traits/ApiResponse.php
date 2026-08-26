<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Send a standard success response.
     */
    protected function success($data = null, ?string $message = null, int $code = 200, array $meta = []): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'meta'    => empty($meta) ? null : $meta,
            'errors'  => null,
        ], $code);
    }

    /**
     * Send a standard error response.
     */
    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data'    => null,
            'meta'    => null,
            'errors'  => $errors,
        ], $code);
    }
}
