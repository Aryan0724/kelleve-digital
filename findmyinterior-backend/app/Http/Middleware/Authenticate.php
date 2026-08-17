<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     * For API routes, return null to trigger a JSON 401 response instead.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Never redirect API requests — they should get a JSON 401
        if ($request->is('api/*') || $request->expectsJson()) {
            return null;
        }

        return '/login';
    }
}
