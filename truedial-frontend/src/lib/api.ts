// TrueDial API Connector
// Connects to the dedicated TrueDial backend API

const isServer = typeof window === "undefined";

function getApiBaseUrl(): string {
  if (isServer) {
    if (process.env.INTERNAL_API_URL && process.env.INTERNAL_API_URL.startsWith("http")) {
      return process.env.INTERNAL_API_URL;
    }
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    const vps = process.env.VPS_BACKEND_URL || "https://findmyinterior.com";
    return `${vps}/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api/proxy";
}

const API_BASE_URL = getApiBaseUrl();

export class TrueDialAPI {
  // ------------------------------------------------------------------
  // Patients (EHR)
  // ------------------------------------------------------------------
  static async getPatients() {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/patients`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to fetch patients");
      return await res.json();
    } catch (error) {
      console.error("API Fetch failed for getPatients.", error);
      return { success: false, data: [] };
    }
  }

  static async createPatient(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/patients`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create patient");
      return await res.json();
    } catch (error) {
      console.error("API Fetch failed for createPatient.", error);
      return { success: false, message: "Network error" };
    }
  }

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
      console.error("API Fetch failed for getListings.", error);
      return { success: false, data: [] };
    }
  }

  static async searchBusinesses(params: Record<string, string> = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/truedial/public/search?${queryParams}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch search results");
      return await res.json();
    } catch (error) {
      console.error("searchBusinesses API failed:", error);
      return { success: false, data: { data: [] } };
    }
  }

  static async autocompleteSearch(q: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/search/autocomplete?q=${encodeURIComponent(q)}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch autocomplete results");
      return await res.json();
    } catch (error) {
      console.error("autocompleteSearch failed:", error);
      return { success: false, data: { data: [] } };
    }
  }

  static async getListingReviews(slug: string, page = 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/businesses/${slug}/reviews?page=${page}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return await res.json();
    } catch (error) {
      console.error("getListingReviews failed:", error);
      return { success: false, data: { data: [] } };
    }
  }

  static async getListingBySlug(slug: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/businesses/${slug}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch listing");
      return await res.json();
    } catch (error) {
      console.error("API Fetch failed for getListingBySlug.", error);
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
          "Accept": "application/json",
          "X-Platform": "truedial"
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
          "Accept": "application/json",
          "X-Platform": "truedial"
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



  // Vendor Reputation Management
  static async getVendorReviews(page = 1) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/reviews?page=${page}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to fetch vendor reviews");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: { data: [] } };
    }
  }

  static async replyToReview(reviewId: number, reply: string) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/reviews/${reviewId}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ body: reply })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async reportReview(reviewId: number, reason: string, notes: string = "") {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/reviews/${reviewId}/report`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ reason, notes })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  // Vendor Business Management
  static async getMyBusiness() {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/my-business`, {
        credentials: 'include',
        headers: { 
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch my business");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  }

  static async createBusiness(data: Record<string, any>) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/businesses`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async updateBusiness(id: number, data: Record<string, any>) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/businesses/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async updateProducts(products: any[]) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/businesses/me/products`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ products })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async updateServices(services: any[]) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/businesses/me/services`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ services })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  // Offers & Promotions

  static async getVendorOffers() {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/offers`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to fetch vendor offers");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async createOffer(data: Record<string, any>) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/offers`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async updateOffer(id: number, data: Record<string, any>) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/offers/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async deleteOffer(id: number) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/offers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  }

  static async getPublicOffers() {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/offers`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch offers");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async getBusinessOffers(slug: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/businesses/${slug}/offers`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch business offers");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  // Analytics Tracking
  static async uploadMedia(formData: FormData) {
    try {
      // Use the proxy so auth token + tenant headers are injected server-side
      const res = await fetch(`/api/proxy/truedial/vendor/media`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Failed to upload media");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async deleteMedia(id: number) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/media/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to delete media");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  static async setMediaCover(id: number) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/media/${id}/cover`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to set media cover");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  static async trackEvent(eventType: string, entityType: string, entityId: number, metadata: Record<string, any> = {}) {
    try {
      // In browser environment, try to collect basic metadata if not provided
      if (typeof window !== 'undefined') {
        metadata.referrer = metadata.referrer || document.referrer;
        metadata.device = metadata.device || (/Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
      }

      const res = await fetch(`${API_BASE_URL}/truedial/public/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          metadata
        })
      });
      return await res.json();
    } catch (error) {
      console.error('Tracking failed', error);
      return { success: false };
    }
  }

  static async getAnalyticsOverview(listingId?: number, period: string = '30d') {
    try {
      const url = new URL(`/api/proxy/truedial/vendor/analytics/overview`, window.location.origin);
      url.searchParams.append('period', period);
      if (listingId) url.searchParams.append('listing_id', listingId.toString());

      const res = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics overview");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: { current: {}, previous: {}, trends: {} } };
    }
  }

  static async createPaymentOrder(planId: number, billingCycle: string = 'monthly') {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/payments/order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ plan_id: planId, billing_cycle: billingCycle })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error creating payment order." };
    }
  }

  static async verifyPayment(orderId: string, paymentId: string, signature: string) {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/payments/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error verifying payment." };
    }
  }

  static async getAnalyticsChart(listingId?: number, period: string = '30d') {
    try {
      const params = new URLSearchParams({ period });
      if (listingId) params.append('listing_id', listingId.toString());
      const res = await fetch(`/api/proxy/truedial/vendor/analytics/chart?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics chart");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  // ─── Generic authenticated client-side methods ────────────────────────────
  // Route through /api-proxy which adds the auth token server-side

  static async get(path: string): Promise<any> {
    try {
      const res = await fetch(`/api-proxy${path}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });
      return await res.json();
    } catch (error) {
      console.error('[TrueDialAPI.get] Error:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async post(path: string, body: Record<string, any> = {}): Promise<any> {
    try {
      const res = await fetch(`/api-proxy${path}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error) {
      console.error('[TrueDialAPI.post] Error:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }
}


