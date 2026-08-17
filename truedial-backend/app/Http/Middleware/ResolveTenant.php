<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class ResolveTenant {
    public function handle(Request $request, Closure $next): Response {
        // Tenant context is always 1 for TrueDial
        return $next($request);
    }
}
