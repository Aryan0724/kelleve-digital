"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

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
