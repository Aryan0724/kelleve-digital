import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/me
 * 
 * Internal Next.js API route that reads the httpOnly auth_token cookie
 * and calls the Laravel backend's /auth/me endpoint to get user data.
 * This allows client-side AuthContext to hydrate without exposing the token.
 */

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

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const apiBase = getServerApiBase();
    const res = await fetch(`${apiBase}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Platform": "truedial",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // Token expired or invalid — clear the cookie
      if (res.status === 401) {
        cookieStore.delete("auth_token");
      }
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const data = await res.json();

    // Laravel Sanctum /auth/me can return different structures
    // Normalize to a clean user object
    const rawUser = data.data || data.user || data;
    
    const user = {
      id: rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      phone: rawUser.phone || null,
      avatar: rawUser.avatar || null,
      role: rawUser.role || rawUser.roles?.[0]?.slug || "customer",
      roles: rawUser.roles?.map((r: any) => r.slug || r.name || r) || [],
      verification_level: rawUser.verification_level || "unverified",
      is_active: rawUser.is_active ?? true,
      professional_type: rawUser.professional_type || null,
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[/api/auth/me] Error:", error);
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }
}
