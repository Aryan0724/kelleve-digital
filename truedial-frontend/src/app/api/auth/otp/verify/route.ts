import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getServerApiBase(): string {
  if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http")) {
    return process.env.INTERNAL_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const vps = process.env.VPS_BACKEND_URL || "http://187.127.164.142:8000";
  return `${vps}/api/v1`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase = getServerApiBase();

    const res = await fetch(`${apiBase}/truedial/auth/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Platform": "truedial",
        "X-Tenant-ID": "2",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success && data.token) {
      const cookieStore = await cookies();
      const isSecure = process.env.NEXT_PUBLIC_API_URL?.startsWith("https") || false;
      cookieStore.set("auth_token", data.token, {
        httpOnly: true,
        secure: isSecure,
        maxAge: 86400 * 30,
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
        role: data.user?.role || data.user?.roles?.[0]?.slug || "customer",
        user: data.user,
        token: data.token,
      });
    }

    return NextResponse.json({
      success: false,
      message: data.message || "Invalid OTP",
    }, { status: res.status });
  } catch (error) {
    console.error("[/api/auth/otp/verify] Error:", error);
    return NextResponse.json({
      success: false,
      message: "Network error. Please try again.",
    }, { status: 500 });
  }
}
