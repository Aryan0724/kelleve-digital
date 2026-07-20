// TrueDial API Connector
// Connects to the central findmyinterior-backend Laravel instance

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class TrueDialAPI {
  static async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async getListings(params: Record<string, string> = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/listings?${queryParams}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch listings");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async getListingBySlug(slug: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${slug}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch listing");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  }

  // Auth (Sanctum)
  static async login(credentials: Record<string, string>) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async register(data: Record<string, string>) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async submitInquiry(data: Record<string, string>) {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }
}
