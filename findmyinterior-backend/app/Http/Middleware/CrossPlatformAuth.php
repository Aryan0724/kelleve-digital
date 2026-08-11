<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CrossPlatformAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $tenantId = $request->header('X-Tenant-ID', 'findmyinterior'); // default to current

        if ($token) {
            $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

            if ($accessToken && (! $accessToken->expires_at || $accessToken->expires_at->isFuture())) {
                // Determine user and roles based on the tenant
                $user = $accessToken->tokenable;
                
                if ($user) {
                    // Set the current user
                    \Illuminate\Support\Facades\Auth::login($user);
                    
                    // Attach tenant roles to the user object dynamically
                    $roles = \Illuminate\Support\Facades\DB::table('user_tenant_roles')
                        ->where('user_id', $user->id)
                        ->where('tenant', $tenantId)
                        ->where('is_active', true)
                        ->pluck('role')
                        ->toArray();
                        
                    $request->attributes->set('tenant_roles', $roles);
                    $request->attributes->set('current_tenant', $tenantId);
                }
            }
        }

        return $next($request);
    }
}
