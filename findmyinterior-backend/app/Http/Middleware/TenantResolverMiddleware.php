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
     *
     * Priority order:
     * 1. X-Tenant-ID / X-Platform header (explicit override — highest priority)
     *    This allows TrueDial (Vercel) requests going through findmyinterior.com domain
     *    to correctly resolve to Tenant #2 (TrueDial) instead of Tenant #1.
     * 2. Request domain
     * 3. Default to Tenant #1 (FindMyInterior)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        // 1. Resolve by Header FIRST (explicit platform/tenant override — highest priority)
        //    TrueDial sends X-Tenant-ID: 2 so its requests through findmyinterior.com domain
        //    are correctly scoped to the TrueDial tenant.
        $headerVal = $request->header('X-Tenant-ID') ?: $request->header('X-Platform');
        if ($headerVal) {
            $tenant = Tenant::where('id', $headerVal)
                ->orWhere('slug', $headerVal)
                ->where('status', 'active')
                ->first();
        }

        // 2. Resolve by Domain (fallback for direct domain access)
        if (!$tenant) {
            $host = $request->getHost();
            $tenant = Tenant::where('domain', $host)->where('status', 'active')->first();
        }

        // 3. Default fallback to FindMyInterior (tenant ID 1)
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
