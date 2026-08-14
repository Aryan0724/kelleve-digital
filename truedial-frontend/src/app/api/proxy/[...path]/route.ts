import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getServerApiBase(): string {
  if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http")) {
    return process.env.INTERNAL_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const vps = process.env.VPS_BACKEND_URL || "https://findmyinterior.com";
  return `${vps}/api/v1`;
}

async function handleRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const { path } = await params;
    const urlPath = (path || []).join("/");
    
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    
    const targetUrl = `${getServerApiBase()}/${urlPath}${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers = new Headers();
    
    const allowedHeaders = ['content-type', 'accept', 'x-platform', 'x-tenant-id'];
    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    
    if (!headers.has('accept')) {
      headers.set('Accept', 'application/json');
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const options: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        headers.delete('content-type');
        const formData = await request.formData();
        options.body = formData;
      } else {
        const bodyText = await request.text();
        if (bodyText) {
          options.body = bodyText;
        }
      }
    }

    const res = await fetch(targetUrl, options);
    
    const resContentType = res.headers.get("content-type") || "";
    if (resContentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      return new NextResponse(text, { 
        status: res.status, 
        headers: { 'Content-Type': resContentType } 
      });
    }

  } catch (error) {
    console.error("[/api/proxy] Error:", error);
    return NextResponse.json({ success: false, message: "Network error in proxy" }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
