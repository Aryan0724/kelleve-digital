import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { 
  Star, MapPin, Phone, MessageCircle, ShieldCheck, Clock, Share2, Heart, 
  CheckCircle2, Ticket, ThumbsUp, ChevronRight, PlaySquare, Globe, Navigation, Award, MessageSquare
} from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import TrackedLink from "@/components/shared/TrackedLink";
import MessageBusinessButton from "@/components/messaging/MessageBusinessButton";

export const dynamic = 'force-dynamic';

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const response = await TrueDialAPI.getListingBySlug(resolvedParams.slug);
  const businessDTO = response.data; 
  
  const offersResponse = await TrueDialAPI.getBusinessOffers(resolvedParams.slug);
  const activeOffers = offersResponse.success ? offersResponse.data : [];
  
  if (!businessDTO || !businessDTO.basicInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
           <h1 className="text-3xl font-black mb-2">Business Not Found</h1>
           <p className="text-slate-500 mb-6 text-sm">The business you are looking for does not exist or has been removed.</p>
           <Link href="/search"><button className="bg-primary text-white font-bold px-6 py-2 rounded shadow-sm text-sm">Return to Search</button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
  ];

  const gallery = businessDTO.media && businessDTO.media.length > 0 
    ? businessDTO.media.map((m: any) => m.url)
    : defaultImages;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-slate-950 font-sans pb-16">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 py-2 text-[10px] text-slate-500 font-medium">
          <Link href="/" className="hover:text-primary">Home</Link> &gt; 
          <Link href={`/search?city=${businessDTO.basicInfo.city}`} className="mx-1 hover:text-primary">{businessDTO.basicInfo.city}</Link> &gt; 
          <Link href={`/search?category=${businessDTO.basicInfo.category}`} className="mx-1 hover:text-primary">{businessDTO.basicInfo.category}</Link> &gt; 
          <span className="mx-1 text-slate-800 dark:text-slate-300 font-bold">{businessDTO.basicInfo.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-4 md:py-6 flex flex-col lg:flex-row gap-4">
        
        {/* Main Content Column */}
        <div className="flex-[2] flex flex-col gap-4">
          
          {/* Dense Header & Info Box */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-4 md:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {businessDTO.basicInfo.title}
                  </h1>
                  {businessDTO.basicInfo.verified && (
                    <div className="bg-green-600 text-white rounded p-0.5" title="Verified">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                  {businessDTO.basicInfo.is_premium && (
                    <div className="bg-amber-500 text-white rounded p-0.5" title="Premium">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-green-600 text-white text-xs font-black px-1.5 py-0.5 rounded flex items-center">
                      4.5 <Star className="w-2.5 h-2.5 ml-0.5 fill-white" />
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      1,248 Ratings
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <ThumbsUp className="w-3.5 h-3.5 text-green-600" /> 84% Recommend
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium mb-5">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{businessDTO.basicInfo.address}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-green-600">Open Now</strong> - Closes at 11:00 PM 
                      <span className="text-primary cursor-pointer ml-2 hover:underline">See exact timings</span>
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <a 
                    href={`tel:${businessDTO.basicInfo.phone}`} 
                    className="flex-1 min-w-[120px]"
                  >
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 rounded text-xs md:text-sm flex items-center justify-center gap-1.5 transition">
                      <Phone className="w-4 h-4" /> Show Number
                    </button>
                  </a>
                  {businessDTO.basicInfo.whatsapp && (
                    <a 
                      href={`https://wa.me/${businessDTO.basicInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 min-w-[120px]"
                    >
                      <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-10 rounded text-xs md:text-sm flex items-center justify-center gap-1.5 transition">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                    </a>
                  )}
                  <button className="flex-1 min-w-[120px] border border-primary text-primary hover:bg-primary/5 font-bold h-10 rounded text-xs md:text-sm flex items-center justify-center gap-1.5 transition">
                    <MessageSquare className="w-4 h-4" /> Get Quotes
                  </button>
                </div>
              </div>

              {/* Right Image Grid */}
              <div className="w-full md:w-[320px] flex-shrink-0 grid grid-cols-2 grid-rows-2 gap-1 h-[200px] md:h-auto rounded-lg overflow-hidden relative">
                <div className="col-span-1 row-span-2 relative group cursor-pointer">
                  <img src={gallery[0]} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Main" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                </div>
                <div className="col-span-1 row-span-1 relative group cursor-pointer">
                  <img src={gallery[1]} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Gallery 1" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                </div>
                <div className="col-span-1 row-span-1 relative group cursor-pointer">
                  <img src={gallery[2] || gallery[0]} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="Gallery 2" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition hover:bg-black/70">
                    <span className="text-white font-bold text-sm">+{gallery.length}</span>
                    <span className="text-white text-[10px] font-semibold">View All Photos</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Links / Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex overflow-x-auto custom-scrollbar sticky top-16 z-20 shadow-sm">
            {['Overview', 'Services', 'Offers', 'Reviews', 'Photos'].map((tab, i) => (
              <button 
                key={i} 
                className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-primary hover:border-primary/30'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* About / Quick Info Box */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Quick Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center">
                <Navigation className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Get Directions</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center">
                <Globe className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Visit Website</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center">
                <Share2 className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Share Listing</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center">
                <Heart className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Save / Bookmark</span>
              </div>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-5 mb-2">About Us</h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              {businessDTO.basicInfo.description || "Welcome to our establishment! We strive to provide the best service and experience to all our customers. Explore our offerings and feel free to contact us. We have been serving the community for over a decade with top-notch professional services."}
            </p>
          </div>

          {/* Special Offers Section */}
          {activeOffers && activeOffers.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-orange-600" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Deals & Offers</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeOffers.map((off: any, i: number) => (
                  <div key={i} className="border border-orange-200 bg-orange-50 dark:bg-orange-950/20 rounded p-3 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/50 rounded-bl-full" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-orange-50">{off.title}</h4>
                      <p className="text-xs font-bold text-orange-600 mt-0.5">{off.discount_type === 'percentage' ? `Up to ${off.discount_value}% OFF` : `Flat ₹${off.discount_value} OFF`}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{off.description || 'Valid on all services. T&C Apply.'}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-orange-200/50 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Exp: {new Date(off.valid_until || Date.now()).toLocaleDateString()}</span>
                      <button className="text-[10px] font-bold bg-orange-600 text-white px-3 py-1 rounded">Claim Deal</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features / Amenities */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Features & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3">
              {['Accepts Credit Cards', 'Free Wi-Fi', 'Parking Available', 'Wheelchair Accessible', 'Air Conditioned', 'Appointments Recommended'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Ratings & Reviews</h2>
            <ReviewSection listing={businessDTO.basicInfo} />
          </div>

        </div>

        {/* Sticky Sidebar Right */}
        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
          
          {/* Send Inquiry Form Box */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 shadow-sm sticky top-24">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-100 dark:border-slate-800 mb-4 text-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Respond Time: <span className="text-green-600">Within 15 mins</span></span>
            </div>
            
            <h3 className="font-black text-sm text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Contact Business</h3>
            
            {businessDTO.basicInfo.user_id && (
              <div className="mb-4">
                <MessageBusinessButton
                  vendorUserId={businessDTO.basicInfo.user_id}
                  businessName={businessDTO.basicInfo.title}
                />
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 mb-3">Send Direct Message</h4>
              <InquiryForm listingId={businessDTO.basicInfo.id} />
            </div>
          </div>

          {/* Map & Address Box */}
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="h-40 bg-slate-200 relative">
              {/* Dummy Map Image */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800" className="w-full h-full object-cover opacity-70 grayscale" alt="Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-3 py-1.5 rounded shadow text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> View on Map
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">Address</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{businessDTO.basicInfo.address}</p>
              <button className="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:underline">
                <Navigation className="w-3 h-3" /> Get Directions
              </button>
            </div>
          </div>

        </aside>

      </main>

      {/* Sticky Bottom Ribbon for Mobile (Hide on Desktop where Sidebar is visible) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 px-4 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-3">
        <a href={`tel:${businessDTO.basicInfo.phone}`} className="flex-1">
          <button className="w-full bg-green-600 text-white font-bold h-10 rounded text-xs flex items-center justify-center gap-1.5">
            <Phone className="w-4 h-4" /> Call
          </button>
        </a>
        {businessDTO.basicInfo.whatsapp && (
          <a href={`https://wa.me/${businessDTO.basicInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1">
            <button className="w-full bg-[#25D366] text-white font-bold h-10 rounded text-xs flex items-center justify-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </a>
        )}
      </div>

    </div>
  );
}
