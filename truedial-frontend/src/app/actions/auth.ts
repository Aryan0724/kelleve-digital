"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// TrueDial API Connector
// Connects to the central findmyinterior-backend Laravel instance

// Server-side: uses INTERNAL_API_URL (available within Docker network) or fallback to NEXT_PUBLIC
const API_BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let redirectPath = null;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (data.success && data.data?.token) {
      const cookieStore = await cookies();
      const isSecure = process.env.NEXT_PUBLIC_API_URL?.startsWith("https") || false;
      cookieStore.set("auth_token", data.data.token, { httpOnly: true, secure: isSecure, maxAge: 86400 * 30 });
      const role = data.data.user?.role;
      redirectPath = role === "business" ? "/dashboard/business" : "/dashboard/user";
    } else {
      redirectPath = `/login?error=${encodeURIComponent(data.message || "Invalid credentials")}`;
    }
  } catch (error) {
    redirectPath = "/login?error=Network+error";
  }
  
  if (redirectPath) redirect(redirectPath);
}

export async function logout() {
  (await cookies()).delete("auth_token");
  redirect("/login");
}

export async function registerAction(formData: FormData) {
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const name = `${first_name} ${last_name}`;
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");
  const password_confirmation = formData.get("password_confirmation");
  const role = formData.get("role") || "business";

  let redirectPath = null;
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name, email, phone, password, password_confirmation, role }),
    });

    const data = await res.json();
    
    if (data.success && data.data?.token) {
      const cookieStore = await cookies();
      const isSecure = process.env.NEXT_PUBLIC_API_URL?.startsWith("https") || false;
      cookieStore.set("auth_token", data.data.token, { httpOnly: true, secure: isSecure, maxAge: 86400 * 30 });
      const createdRole = data.data.user?.role || role;
      redirectPath = createdRole === "business" ? "/dashboard/business" : "/dashboard/user";
    } else {
      redirectPath = `/register?error=${encodeURIComponent(data.message || "Registration failed")}`;
    }
  } catch (error) {
    redirectPath = "/register?error=Network+error";
  }
  
  if (redirectPath) redirect(redirectPath);
}

export async function sendOtpAction(phone: string) {
  try {
    const res = await fetch(`${API_BASE}/truedial/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}

export async function verifyOtpAction(phone: string, otp: string, company_name?: string) {
  try {
    const res = await fetch(`${API_BASE}/truedial/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ phone, otp, company_name }),
    });
    const data = await res.json();
    
    if (data.success && data.token) {
      const cookieStore = await cookies();
      const isSecure = process.env.NEXT_PUBLIC_API_URL?.startsWith("https") || false;
      cookieStore.set("auth_token", data.token, { httpOnly: true, secure: isSecure, maxAge: 86400 * 30 });
      return { success: true, user: data.user };
    }
    return data;
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}
