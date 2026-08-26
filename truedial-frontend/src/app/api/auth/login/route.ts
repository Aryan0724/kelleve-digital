import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * 
 * Proxies login to the Laravel backend, sets the httpOnly auth_token cookie,
 * and returns success + user role to the client.
 */

function getServerApiBase(): string {
  if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http") && !process.env.INTERNAL_API_URL.includes("172.17.0.1") && !process.env.INTERNAL_API_URL.includes("fmi_nginx")) {
    return process.env.INTERNAL_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "https://findmyinterior.com/api/v1";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase = getServerApiBase();

    const res = await fetch(`${apiBase}/auth/login`, {
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
        role: data.data.user?.role || data.data.user?.roles?.[0]?.slug || "customer",
        user: {
          id: data.data.user?.id,
          name: data.data.user?.name,
          email: data.data.user?.email,
          professional_type: data.data.user?.professional_type,
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: data.message || "Invalid credentials",
    }, { status: 200 });
  } catch (error) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json({
      success: false,
      message: "Network error. Please try again.",
    }, { status: 200 });
  }
}
