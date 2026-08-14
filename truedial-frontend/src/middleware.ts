import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: Auth token injection for legacy /api-proxy/ paths.
 * 
 * NOTE: For the new /api/proxy/ path, token injection is handled directly
 * inside src/app/api/proxy/[...path]/route.ts which reads httpOnly cookies
 * server-side and forwards the Authorization header.
 * 
 * This middleware handles the legacy rewrite paths if any old code still uses them.
 */
export function middleware(request: NextRequest) {
  // For any /api-proxy/ path, inject the auth token from the httpOnly cookie
  if (request.nextUrl.pathname.startsWith('/api-proxy/')) {
    const token = request.cookies.get('auth_token')?.value;
    const requestHeaders = new Headers(request.headers);

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    // Always inject tenant headers for TrueDial
    requestHeaders.set('X-Tenant-ID', '2');
    requestHeaders.set('X-Platform', 'truedial');

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

// Only match /api-proxy/ paths
export const config = {
  matcher: '/api-proxy/:path*',
};
