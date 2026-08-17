import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { 
  Star, MapPin, Phone, Mail, ShieldCheck, Clock, Share2, Heart, 
  CheckCircle2, Ticket, Tag, ChevronLeft, Search, Navigation, Globe, Bookmark, 
  ChevronRight, PlaySquare
} from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import TrackedLink from "@/components/shared/TrackedLink";
import MessageBusinessButton from "@/components/messaging/MessageBusinessButton";

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
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Business Not Found</h1>
          <p className="text-gray-500 mb-8">The business you are looking for does not exist or has been removed.</p>
          <Link href="/search"><button className="bg-blue-600 text-white px-6 py-2 rounded-xl">Return to Search</button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate a mock cover image and logo if missing
  const coverImage = (businessDTO.media && businessDTO.media[0]) ? businessDTO.media[0].url : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070';
  const logoImage = (businessDTO.media && businessDTO.media.length > 1) ? businessDTO.media[1].url : 'https://api.dicebear.com/7.x/initials/svg?seed=' + businessDTO.basicInfo.title;

  const quickActions = [
    { name: 'Call', icon: Phone, color: '#1E40AF', bg: 'bg-white', border: 'border-blue-100', href: `tel:${businessDTO.basicInfo.phone}` },
    { name: 'WhatsApp', icon: Phone, color: '#FFFFFF', bg: 'bg-[#25D366]', border: 'border-[#25D366]', href: `https://wa.me/${businessDTO.basicInfo.whatsapp || businessDTO.basicInfo.phone}?text=Hi` },
    { name: 'Directions', icon: Navigation, color: '#1E40AF', bg: 'bg-white', border: 'border-blue-100', href: `https://maps.google.com/?q=${encodeURIComponent(businessDTO.basicInfo.address)}` },
    { name: 'Website', icon: Globe, color: '#1E40AF', bg: 'bg-white', border: 'border-blue-100', href: businessDTO.basicInfo.website || '#' },
    { name: 'Save', icon: Bookmark, color: '#1E40AF', bg: 'bg-white', border: 'border-blue-100', href: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 font-sans pb-24">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full">
        
        {/* 1. HERO HEADER (Matches Mobile Design) */}
        <div className="w-full relative bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-6 md:rounded-b-3xl">
          {/* Cover Image */}
          <div className="h-64 md:h-80 w-full relative">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Logo Overlap */}
            <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-12">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                <img src={logoImage} className="w-full h-full object-cover" alt="Logo" />
              </div>
            </div>
          </div>
          
          <div className="pt-14 pb-8 px-6 md:px-12 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {businessDTO.basicInfo.verified && (
                  <div className="bg-green-100 dark:bg-green-950 px-2 py-1 rounded-full flex items-center shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-1" />
                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Verified</span>
                  </div>
                )}
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{businessDTO.basicInfo.category}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{businessDTO.basicInfo.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg flex items-center font-bold shadow-sm">
                  <span className="mr-1">4.5</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2">1,248 Reviews</span>
                <span className="text-slate-300 mx-1">•</span>
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {businessDTO.basicInfo.address.split(',')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. QUICK ACTIONS ROW */}
        <div className="px-6 md:px-12 py-6 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 mb-6 flex flex-row justify-between md:justify-start md:gap-12 shadow-sm">
          {quickActions.map((action, i) => (
            <TrackedLink 
              key={i}
              href={action.href}
              className="flex flex-col items-center group"
              eventType={action.name === 'Call' ? 'PHONE_CLICK' : action.name === 'WhatsApp' ? 'WHATSAPP_CLICK' : action.name === 'Website' ? 'WEBSITE_CLICK' : 'DIRECTION_CLICK'}
              entityType="listing"
              entityId={businessDTO.basicInfo.id}
            >
              <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center mb-2 ${action.bg} border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform`}>
                <action.icon className="w-6 h-6" color={action.color} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{action.name}</span>
            </TrackedLink>
          ))}
        </div>

        {/* Two-Column Layout for Desktop */}
        <div className="px-6 md:px-12 flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Column */}
          <div className="flex-[2] space-y-6">
            
            {/* 3. OPEN NOW STRIP */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-row items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex flex-row items-center gap-3">
                <Clock className="w-6 h-6 text-green-600" />
                <div>
                  <span className="text-base font-black text-green-600">Open Now</span>
                  <span className="text-xs font-semibold text-slate-500 block">Closes at 11:00 PM</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* 4. WHAT PEOPLE LOVE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">What People Love</h3>
              <div className="flex flex-row flex-wrap gap-2">
                {['Great Ambience', 'Friendly Staff', 'Fast Service', 'Live Music', 'Value for Money', 'Clean Restrooms'].map((tag, i) => (
                  <div key={i} className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. ABOUT THIS PLACE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">About This Place</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {businessDTO.basicInfo.description || "Welcome to our establishment! We strive to provide the best service and experience to all our customers. Explore our offerings and feel free to contact us."}
              </p>
              <button className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-2">Read More</button>
            </div>

            {/* 6. VIDEO PREVIEW */}
            {businessDTO.media && businessDTO.media.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex flex-row justify-between items-center mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Video Preview</h3>
                  <span className="text-xs font-bold text-blue-600">See All</span>
                </div>
                <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative shadow-sm">
                  <img src={businessDTO.media[0].url} alt="Video Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors">
                    <PlaySquare className="w-14 h-14 text-white opacity-90" />
                  </div>
                </div>
              </div>
            )}

            {/* 7. PHOTO GALLERY */}
            {businessDTO.media && businessDTO.media.length > 1 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex flex-row justify-between items-center mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Photo Gallery</h3>
                  <span className="text-xs font-bold text-blue-600">View All (12)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {businessDTO.media.slice(1, 5).map((m: any, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                      <img src={m.url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TOP OFFERS FOR YOU (Orange Cards) */}
            {activeOffers && activeOffers.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex flex-row justify-between items-center mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Top Offers for You</h3>
                  <span className="text-xs font-bold text-blue-600">See All</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeOffers.map((off: any, i: number) => (
                    <div key={i} className="bg-orange-500 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                      <div>
                        <h4 className="text-xl font-black text-white">{off.title}</h4>
                        <p className="text-sm font-bold text-orange-100">{off.discount_type === 'percentage' ? `Up to ${off.discount_value}% OFF` : `Flat ₹${off.discount_value} OFF`}</p>
                        <p className="text-xs text-orange-200 mt-1">{off.description || 'On total bill'}</p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <span className="text-[10px] text-orange-100">Valid till {new Date(off.valid_until || Date.now()).toLocaleDateString()}</span>
                        <span className="text-xs font-bold text-white bg-black/20 px-2 py-1 rounded">T&C</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION (Based on Archetype) */}
            {businessDTO.basicInfo.category?.toLowerCase().includes('food') || businessDTO.basicInfo.category?.toLowerCase().includes('restaurant') ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Popular Menu Items</h3>
                <div className="space-y-4">
                  {['Butter Chicken', 'Paneer Tikka Masala', 'Garlic Naan', 'Dal Makhani'].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Chef's special preparation</div>
                      </div>
                      <div className="font-bold text-emerald-600">₹{250 + (idx * 50)}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  View Full Menu
                </button>
              </div>
            ) : businessDTO.basicInfo.category?.toLowerCase().includes('health') || businessDTO.basicInfo.category?.toLowerCase().includes('clinic') ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Services & Procedures</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['General Consultation', 'Dental Checkup', 'Blood Test', 'Vaccination', 'Physiotherapy', 'X-Ray'].map((service, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : businessDTO.basicInfo.category?.toLowerCase().includes('beauty') || businessDTO.basicInfo.category?.toLowerCase().includes('salon') ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Top Services</h3>
                <div className="space-y-4">
                  {['Advanced Haircut & Styling', 'Keratin Treatment', 'Bridal Makeup Package', 'Deep Tissue Massage'].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{45 + (idx * 15)} mins duration</div>
                      </div>
                      <div className="font-bold text-pink-500">From ₹{499 + (idx * 500)}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-pink-50 dark:bg-pink-900/10 text-sm font-bold text-pink-600 dark:text-pink-400 rounded-lg border border-pink-100 dark:border-pink-900/20 hover:bg-pink-100 transition">
                  Book a Service
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Featured Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" className="w-full h-32 object-cover rounded-xl" alt="Highlight 1" />
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070" className="w-full h-32 object-cover rounded-xl" alt="Highlight 2" />
                </div>
              </div>
            )}

            {/* 9. REVIEWS */}
            <div id="reviews" className="scroll-mt-32">
              <ReviewSection listing={businessDTO.basicInfo} />
            </div>

          </div>

          {/* Sidebar for Web: Contact, Map, Timings */}
          <aside className="flex-1 space-y-6 hidden lg:block sticky top-24 h-max">
            
            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-500 block">Phone</span>
                    <a href={`tel:${businessDTO.basicInfo.phone}`} className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition">
                      {businessDTO.basicInfo.phone}
                    </a>
                  </div>
                </div>
                
                {businessDTO.basicInfo.website && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-500 block">Website</span>
                      <a href={businessDTO.basicInfo.website} target="_blank" rel="noreferrer" className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition">
                        {businessDTO.basicInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                {businessDTO.basicInfo.user_id && (
                  <MessageBusinessButton
                    vendorUserId={businessDTO.basicInfo.user_id}
                    businessName={businessDTO.basicInfo.title}
                  />
                )}
                <h3 className="font-bold text-navy dark:text-white mb-4">Send an Inquiry</h3>
                <InquiryForm listingId={businessDTO.basicInfo.id} />
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" /> Operating Hours
              </h3>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between items-center"><span className="text-slate-500">Mon - Fri</span><span className="text-slate-900 dark:text-white">10:00 AM - 11:00 PM</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Saturday</span><span className="text-slate-900 dark:text-white">10:00 AM - 12:00 AM</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Sunday</span><span className="text-slate-900 dark:text-white">10:00 AM - 12:00 AM</span></div>
              </div>
            </div>
            
          </aside>

        </div>
      </main>

      {/* 10. STICKY BOTTOM PRIVILEGE CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-950 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-900/50 shadow-sm shrink-0">
              <Ticket className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white">Get Extra 10% OFF up to ₹500</h4>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500">With TrueDial VIP Privilege Card</p>
            </div>
          </div>
          <Link href="/offers" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#F59E0B] hover:bg-amber-400 transition-colors py-3 px-8 rounded-xl font-black text-slate-900 shadow-md">
              Claim VIP Discount
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
