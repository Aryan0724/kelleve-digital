<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use App\Models\Tenant;
use Symfony\Component\HttpFoundation\Response;

class TenantResolverMiddleware
{
    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        // 1. Resolve by Domain (Production priority)
        $host = $request->getHost();
        $tenant = Tenant::where('domain', $host)->where('status', 'active')->first();

        // 2. Resolve by Header (Dev priority / Fallback)
        if (!$tenant && $request->hasHeader('X-Tenant-ID')) {
            $tenantId = $request->header('X-Tenant-ID');
            $tenant = Tenant::where('id', $tenantId)->orWhere('slug', $tenantId)->where('status', 'active')->first();
        }

        // If no tenant is found, we might want to default to Find My Interior or abort.
        // For MVP, if domain doesn't match and no header, default to tenant ID 1
        if (!$tenant) {
            $tenant = Tenant::find(1);
        }

        if ($tenant) {
            $this->tenantContext->setTenant($tenant);
        } else {
            return response()->json(['success' => false, 'message' => 'Tenant not found. Header was: ' . $request->header('X-Tenant-ID')], 404);
        }

        return $next($request);
    }
}
