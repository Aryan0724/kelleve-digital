import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getServerApiBase(): string {
  if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http") && !process.env.INTERNAL_API_URL.includes("172.17.0.1") && !process.env.INTERNAL_API_URL.includes("fmi_nginx")) {
    return process.env.INTERNAL_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "https://findmyinterior.com/api/v1";
}

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Next.js 15: params is a Promise, must be awaited
    const { path } = await context.params;
    const urlPath = (path || []).join("/");

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

    const targetUrl = `${getServerApiBase()}/${urlPath}${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers = new Headers();

    // Copy allowed headers from the incoming request
    const allowedHeaders = ["content-type", "accept"];
    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    // Always enforce JSON accept
    if (!headers.has("accept")) {
      headers.set("Accept", "application/json");
    }

    headers.set("X-Platform", "truedial");
    headers.set("X-App-Source", "truedial-web");

    // Inject bearer token from httpOnly cookie
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const options: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
    };

    // Handle request body for non-GET requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        // For multipart, remove content-type so fetch sets it with boundary
        headers.delete("content-type");
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
        headers: { "Content-Type": resContentType || "text/plain" },
      });
    }
  } catch (error) {
    console.error("[/api/proxy] Error:", error);
    return NextResponse.json(
      { success: false, message: "Network error connecting to TrueDial backend" },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
