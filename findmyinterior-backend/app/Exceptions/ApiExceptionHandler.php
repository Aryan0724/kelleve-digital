<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class ApiExceptionHandler
{
    /**
     * Handle the exception and return a standardized JSON response.
     */
    public static function handle(Throwable $exception, $request)
    {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $exception->errors(),
            ], 422);
        }

        if ($exception instanceof ModelNotFoundException || $exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found',
            ], 404);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Please log in to continue',
            ], 401);
        }

        if ($exception instanceof AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action',
            ], 403);
        }

        if ($exception instanceof ThrottleRequestsException) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.',
            ], 429);
        }

        if ($exception instanceof QueryException) {
            $errorCode = $exception->errorInfo[1] ?? null;

            // 1062 = Duplicate entry
            if ($errorCode === 1062) {
                return response()->json([
                    'success' => false,
                    'message' => 'This entry already exists.',
                ], 409);
            }

            // 1406 = Data too long for column
            if ($errorCode === 1406) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data too large for a specific field. Please check your inputs.',
                ], 422);
            }
            
            // Log other database errors but don't leak details
            \Illuminate\Support\Facades\Log::error('Database Error: ' . $exception->getMessage(), [
                'trace' => $exception->getTraceAsString(),
                'url' => $request->fullUrl(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'A database error occurred. Our team has been notified.',
            ], 500);
        }

        if ($exception instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage() ?: 'HTTP Error',
            ], $exception->getStatusCode());
        }

        // Generic fallback for all other unhandled exceptions
        \Illuminate\Support\Facades\Log::error('Unhandled Exception: ' . $exception->getMessage(), [
            'trace' => $exception->getTraceAsString(),
            'url' => $request->fullUrl(),
        ]);

        $message = $exception->getMessage() ?: 'Something went wrong. Our team has been notified.';

        return response()->json([
            'success' => false,
            'message' => $message,
            'debug'   => config('app.debug') ? [
                'file'  => $exception->getFile(),
                'line'  => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ] : null,
        ], 500);
    }
}
