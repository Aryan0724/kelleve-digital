import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_BASE =
  process.env.INTERNAL_API_URL ||
  process.env.VPS_BACKEND_URL ||
  'http://127.0.0.1:8000';

const API_BASE = `${BACKEND_BASE}/api/v1`;

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const search = req.nextUrl.search || '';

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const targetUrl = `${API_BASE}/${path}${search}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Platform': 'truedial',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const bodyText = await req.text();
      if (bodyText) fetchOptions.body = bodyText;
    } catch {}
  }

  try {
    const backendRes = await fetch(targetUrl, fetchOptions);
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
    const text = await backendRes.text();
    return new NextResponse(text, { status: backendRes.status });
  } catch (error) {
    console.error('[api-proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy connection error. Is the backend running?' },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
