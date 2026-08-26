import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/register
 * 
 * Proxies registration to the Laravel backend, sets httpOnly auth_token cookie,
 * and returns success + user role for redirect.
 */

function getServerApiBase(): string {
  if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http")) {
    return process.env.INTERNAL_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const backendUrl = process.env.TRUEDIAL_BACKEND_URL || (process.env.NODE_ENV === "production" ? "https://truedial.in" : "http://127.0.0.1:8001");
  return `${backendUrl}/api/v1`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase = getServerApiBase();

    const res = await fetch(`${apiBase}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Platform": "truedial",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success && data.data?.token) {
      const cookieStore = await cookies();
      const isSecure = process.env.NEXT_PUBLIC_API_URL?.startsWith("https") || false;
      cookieStore.set("auth_token", data.data.token, {
        httpOnly: true,
        secure: isSecure,
        maxAge: 86400 * 30,
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
        role: data.data.user?.role || body.role || "customer",
        user: {
          id: data.data.user?.id,
          name: data.data.user?.name,
          email: data.data.user?.email,
          professional_type: data.data.user?.professional_type || body.role,
        },
      });
    }

    // Parse validation errors from Laravel
    const errors = data.errors;
    let message = data.message || "Registration failed";
    if (errors && typeof errors === "object") {
      const firstError = Object.values(errors).flat()[0];
      if (firstError) message = firstError as string;
    }

    return NextResponse.json({ success: false, message }, { status: 200 });
  } catch (error) {
    console.error("[/api/auth/register] Error:", error);
    return NextResponse.json({
      success: false,
      message: "Network error. Please try again.",
    }, { status: 200 });
  }
}
