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
      console.error("API Fetch failed, using mock data.", error);
      return { success: true, data: MOCK_LISTINGS };
    }
  }

  static async autocompleteSearch(q: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/search/autocomplete?q=${encodeURIComponent(q)}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch autocomplete results");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async getListingReviews(slug: string, page = 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/public/businesses/${slug}/reviews?page=${page}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch reviews");
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
      console.error("API Fetch failed, using mock data.", error);
      const listing = MOCK_LISTINGS.find(l => l.slug === slug) || MOCK_LISTINGS[0];
      return { success: true, data: listing };
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
      // Mock successful inquiry submission
      return { success: true, message: "Inquiry submitted successfully!" };
    }
  }

  // Vendor Reputation Management
  static async getVendorReviews(page = 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/reviews?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch vendor reviews");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  static async replyToReview(reviewId: number, body: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ body })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  static async reportReview(reviewId: number, reason: string, notes: string = "") {
    try {
      const res = await fetch(`${API_BASE_URL}/truedial/vendor/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason, notes })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
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
    city: "Delhi",
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
  }
];
