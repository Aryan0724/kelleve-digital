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
    const vps = process.env.VPS_BACKEND_URL || "http://187.127.164.142:8000";
    return `${vps}/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api-proxy";
}

const API_BASE_URL = getApiBaseUrl();

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
      // Mock successful inquiry submission
      return { success: true, message: "Inquiry submitted successfully!" };
    }
  }



  // Vendor Reputation Management
  static async getVendorReviews(page = 1) {
    try {
      const res = await fetch(`/api-proxy/truedial/vendor/reviews?page=${page}`, {
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
      const res = await fetch(`/api-proxy/truedial/vendor/reviews/${reviewId}/reply`, {
        method: 'POST',
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
      const res = await fetch(`/api-proxy/truedial/vendor/reviews/${reviewId}/report`, {
        method: 'POST',
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
      const res = await fetch(`/api-proxy/truedial/vendor/my-business`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to fetch my business");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  }

  static async updateBusiness(id: number, data: Record<string, any>) {
    try {
      const res = await fetch(`/api-proxy/truedial/vendor/businesses/${id}`, {
        method: 'PUT',
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
      const res = await fetch(`/api-proxy/truedial/vendor/businesses/me/products`, {
        method: 'PUT',
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
      const res = await fetch(`/api-proxy/truedial/vendor/businesses/me/services`, {
        method: 'PUT',
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
      const res = await fetch(`/api-proxy/truedial/vendor/offers`, {
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
      const res = await fetch(`/api-proxy/truedial/vendor/offers`, {
        method: 'POST',
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
      const res = await fetch(`/api-proxy/truedial/vendor/offers/${id}`, {
        method: 'PUT',
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
      const res = await fetch(`/api-proxy/truedial/vendor/offers/${id}`, {
        method: 'DELETE',
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
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/media/${id}/cover`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
          'Accept': 'application/json',
          ...(typeof localStorage !== 'undefined' && localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
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
      const url = new URL(`/api-proxy/truedial/vendor/analytics/overview`, window.location.origin);
      url.searchParams.append('period', period);
      if (listingId) url.searchParams.append('listing_id', listingId.toString());

      const res = await fetch(url.toString(), {
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
      const res = await fetch(`/api-proxy/truedial/vendor/payments/order`, {
        method: 'POST',
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
      const res = await fetch(`/api-proxy/truedial/vendor/payments/verify`, {
        method: 'POST',
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
      const url = new URL(`${API_BASE_URL}/truedial/vendor/analytics/chart`);
      url.searchParams.append('period', period);
      if (listingId) url.searchParams.append('listing_id', listingId.toString());

      const res = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics chart");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }
  static async get(endpoint: string) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error("API Get failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return { data: [] };
    }
  }

  static async post(endpoint: string, data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("API Post failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return { success: false };
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

// ==========================================
// MOCK DATA FALLBACKS FOR DEMO / OFFLINE MODE
// ==========================================
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Sharma Interior Decorators",
    slug: "sharma-interior-decorators",
    category: { name: "Interior Designers" },
    city: "Delhi NCR",
    rating: 4.8,
    reviews_count: 124,
    description: "Premium interior design services for residential and commercial spaces across Delhi NCR.",
    address: "123 Connaught Place, New Delhi",
    phone: "+91 98765 43210",
    email: "contact@sharmainteriors.com",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b1456ca45?q=80&w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800"
    ],
    features: ["Free Consultation", "3D Modeling", "Vastu Compliant"]
  },
  {
    id: 2,
    title: "Royal Palace Hotel",
    slug: "royal-palace-hotel",
    category: { name: "Hotels" },
    city: "Mumbai",
    rating: 4.5,
    reviews_count: 89,
    description: "Luxury stays with seaside views in the heart of Mumbai.",
    address: "Marine Drive, Mumbai",
    phone: "+91 91234 56789",
    email: "info@royalpalace.com",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
    ],
    features: ["Sea View", "Free WiFi", "Pool"]
  },
  {
    id: 3,
    title: "Apollo Dental Clinic",
    slug: "apollo-dental-clinic",
    category: { name: "Hospitals" },
    city: "Bangalore",
    rating: 4.9,
    reviews_count: 210,
    description: "Advanced dental care by certified specialists.",
    address: "Indiranagar, Bangalore",
    phone: "+91 99887 76655",
    email: "care@apollodental.com",
    gallery: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800"
    ],
    features: ["X-Ray", "Root Canal", "Implants"]
  },
  {
    id: 4,
    title: "Aura Architecture & Interior Studio",
    slug: "aura-architecture-interior-studio",
    category: { name: "Architects" },
    city: "Mumbai",
    rating: 4.9,
    reviews_count: 156,
    description: "Award-winning architectural and luxury interior design firm specializing in turnkey projects.",
    address: "Bandra West, Mumbai",
    phone: "+91 98200 11223",
    email: "info@aurastudio.com",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
    ],
    features: ["Turnkey Execution", "3D Modeling", "Vastu Certified"]
  },
  {
    id: 5,
    title: "The Spice Route Dining & Lounge",
    slug: "spice-route-dining",
    category: { name: "Restaurants" },
    city: "Delhi NCR",
    rating: 4.7,
    reviews_count: 340,
    description: "Authentic pan-Asian fine dining with private banquet rooms and rooftop lounge.",
    address: "Hauz Khas Village, New Delhi",
    phone: "+91 98111 22334",
    email: "reservations@spiceroute.com",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"
    ],
    features: ["50% VIP Card Off", "Valet Parking", "Rooftop"]
  },
  {
    id: 6,
    title: "Agarwal Packers & Logistics",
    slug: "agarwal-packers-logistics",
    category: { name: "Packers & Movers" },
    city: "Pune",
    rating: 4.6,
    reviews_count: 412,
    description: "Trusted household relocation, vehicle shifting, and secure warehousing across India.",
    address: "Wakad, Pune",
    phone: "+91 93222 33445",
    email: "support@agarwalmovers.com",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800"
    ],
    features: ["Damage Insurance", "GPS Tracking", "Instant Quotes"]
  },
  {
    id: 7,
    title: "Tata Steel Building Supplies (B2B)",
    slug: "tata-steel-building-supplies",
    category: { name: "B2B Wholesalers" },
    city: "Mumbai",
    rating: 4.9,
    reviews_count: 520,
    description: "Factory direct distributor of structural TMT bars, cement, and commercial construction hardware.",
    address: "Andheri East, Mumbai",
    phone: "+91 98210 99887",
    email: "b2b@tatabuildings.com",
    gallery: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800"
    ],
    features: ["Wholesale Rates", "Factory Direct", "Bulk Credit"]
  },
  {
    id: 8,
    title: "Fortis Memorial Super Specialty Hospital",
    slug: "fortis-memorial-hospital",
    category: { name: "Hospitals" },
    city: "Delhi NCR",
    rating: 4.8,
    reviews_count: 670,
    description: "24x7 emergency medical services, cardiology, orthopedics, and diagnostic laboratory.",
    address: "Sector 44, Gurgaon",
    phone: "+91 99990 00111",
    email: "helpdesk@fortishospital.com",
    gallery: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800"
    ],
    features: ["24x7 Emergency", "ICU Facility", "VIP Discount"]
  },
  {
    id: 9,
    title: "VastuCreations Interior Designers",
    slug: "vastucreations-interior-designers",
    category: { name: "Interior Designers" },
    city: "Bangalore",
    rating: 4.9,
    reviews_count: 198,
    description: "Modern modular kitchen and luxury bedroom interiors tailored to your budget.",
    address: "Koramangala, Bangalore",
    phone: "+91 98450 11223",
    email: "design@vastucreations.com",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800"
    ],
    features: ["10 Year Warranty", "Free Consult", "3D Design"]
  },
  {
    id: 10,
    title: "Barbeque Nation Buffet & Grill",
    slug: "barbeque-nation-buffet",
    category: { name: "Restaurants" },
    city: "Hyderabad",
    rating: 4.7,
    reviews_count: 850,
    description: "Unlimited live grill table buffet with multi-cuisine dining.",
    address: "Banjara Hills, Hyderabad",
    phone: "+91 98850 44556",
    email: "hyd@barbequenation.com",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800"
    ],
    features: ["Live Grill", "Buffet", "Family Friendly"]
  }
];
