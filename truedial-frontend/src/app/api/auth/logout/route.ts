import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * 
 * Deletes the httpOnly auth_token cookie.
 * Called from client-side dashboard logout button.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ success: true });
}
