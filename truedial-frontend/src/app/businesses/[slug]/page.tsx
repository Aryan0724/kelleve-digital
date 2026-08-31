import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import BusinessProfileClient from "@/components/business/BusinessProfileClient";

export const dynamic = 'force-dynamic';

function generateFallbackBusiness(slug: string) {
  const cleanTitle = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const isHealthcare = slug.includes("health") || slug.includes("clinic") || slug.includes("hospital") || slug.includes("doctor") || slug.includes("apollo");
  const isHotel = slug.includes("hotel") || slug.includes("suites") || slug.includes("resort") || slug.includes("inn");
  const isEducation = slug.includes("academy") || slug.includes("coaching") || slug.includes("iit") || slug.includes("neet") || slug.includes("classes");
  const isInterior = slug.includes("interior") || slug.includes("architect") || slug.includes("design");
  const isSalon = slug.includes("salon") || slug.includes("beauty") || slug.includes("spa");
  const isAuto = slug.includes("car") || slug.includes("auto") || slug.includes("mechanic") || slug.includes("speed");

  let category = "Restaurants & Cafes";
  let coverImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop";

  if (isHealthcare) {
    category = "Hospitals & Healthcare";
    coverImage = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop";
  } else if (isHotel) {
    category = "Hotels & Lodging";
    coverImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";
  } else if (isEducation) {
    category = "Education & Coaching";
    coverImage = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop";
  } else if (isInterior) {
    category = "Interior & Architecture";
    coverImage = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop";
  } else if (isSalon) {
    category = "Salons & Beauty";
    coverImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop";
  } else if (isAuto) {
    category = "Automobile Services";
    coverImage = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop";
  }

  return {
    basicInfo: {
      id: 101,
      slug: slug,
      title: cleanTitle || "The Royal Heritage Dine & Cafe",
      category: category,
      tagline: `Top Rated ${category} Destination in Delhi NCR`,
      description: `Welcome to ${cleanTitle || "our business"}! We strive to provide the best service, world-class facilities, and an unforgettable experience to all our customers. Explore our offerings and feel free to connect with us directly.`,
      city: "Delhi NCR",
      address: `Connaught Place / Cyber Hub, Delhi NCR, India`,
      phone: "+91 98765 00101",
      whatsapp: "919876500101",
      website: `https://${slug}.truedial.in`,
      verified: true,
      is_premium: true,
      avg_rating: 4.8,
      review_count: 142,
    },
    metrics: {
      rating: 4.8,
      reviews_count: 142,
    },
    media: [
      { url: coverImage },
      { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" }
    ],
    catalog: {
      services: [
        {
          id: 1,
          name: "VIP Premium Consultation & Service",
          description: "Complete professional service with dedicated specialist and guaranteed customer satisfaction.",
          price_from: 499,
          price_to: 1499,
          duration: "45 mins"
        },
        {
          id: 2,
          name: "Express Priority Booking Slot",
          description: "Immediate slot booking with direct assistance and zero waiting time.",
          price_from: 299,
          price_to: 799,
          duration: "30 mins"
        },
        {
          id: 3,
          name: "Full Comprehensive Package",
          description: "All-inclusive end-to-end service package tailored to your exact requirements.",
          price_from: 2499,
          price_to: 5999,
          duration: "2 hours"
        }
      ],
      products: [
        {
          id: 1,
          name: "Signature Special Offering",
          description: "Handcrafted delicacy made with premium organic ingredients and chef special spices.",
          price: 450,
          image: coverImage,
          is_veg: true
        },
        {
          id: 2,
          name: "Royal Gourmet Feast Selection",
          description: "Award-winning specialty served with artisanal sides and freshly made dips.",
          price: 680,
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
          is_veg: false
        },
        {
          id: 3,
          name: "Deluxe Refreshment Blend",
          description: "Chilled fresh blend infused with natural fruits and aromatic mint.",
          price: 180,
          image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
          is_veg: true
        }
      ]
    }
  };
}

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let businessDTO: any = null;
  let activeOffers: any[] = [];

  try {
    const response = await TrueDialAPI.getListingBySlug(slug);
    if (response && response.success && response.data) {
      businessDTO = response.data;
    }
  } catch (err) {
    console.warn("Could not fetch business from API, using fallback profile:", err);
  }

  try {
    const offersResponse = await TrueDialAPI.getBusinessOffers(slug);
    if (offersResponse && offersResponse.success && Array.isArray(offersResponse.data)) {
      activeOffers = offersResponse.data;
    }
  } catch (err) {
    // ignore
  }

  if (!businessDTO || !businessDTO.basicInfo) {
    businessDTO = generateFallbackBusiness(slug);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <BusinessProfileClient 
          business={businessDTO} 
          initialOffers={activeOffers} 
        />
      </main>
      <Footer />
    </div>
  );
}
