import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { Star, MapPin, Phone, Mail, ShieldCheck, Clock, Share2, Heart, CheckCircle2, Ticket, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InquiryForm from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import TrackedLink from "@/components/shared/TrackedLink";

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const response = await TrueDialAPI.getListingBySlug(resolvedParams.slug);
  const businessDTO = response.data; // Now a BusinessProfileDTO structure
  
  const offersResponse = await TrueDialAPI.getBusinessOffers(resolvedParams.slug);
  const activeOffers = offersResponse.success ? offersResponse.data : [];
  
  if (!businessDTO || !businessDTO.basicInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-8">The business you are looking for does not exist or has been removed.</p>
          <Link href="/search"><Button>Return to Search</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Gallery */}
      <div className="w-full h-[40vh] bg-navy relative overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${businessDTO.media && businessDTO.media[0] ? businessDTO.media[0].url : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070'}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex justify-between items-end">
          <div className="text-white animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border border-primary/50 backdrop-blur-md">
                {businessDTO.basicInfo.category || "Business"}
              </Badge>
              {businessDTO.basicInfo.verified && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified Premium
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{businessDTO.basicInfo.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {businessDTO.basicInfo.address}</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-3 flex-wrap">
            {businessDTO.actions.map((action: any, idx: number) => {
              let eventType = "WEBSITE_CLICK";
              if (action.label.toLowerCase().includes("call")) eventType = "PHONE_CLICK";
              if (action.label.toLowerCase().includes("whatsapp")) eventType = "WHATSAPP_CLICK";
              if (action.label.toLowerCase().includes("direction")) eventType = "DIRECTION_CLICK";
              
              return (
                <TrackedLink 
                  key={idx} 
                  href={action.url} 
                  target="_blank" 
                  rel="noreferrer"
                  eventType={eventType}
                  entityType="listing"
                  entityId={businessDTO.basicInfo.id}
                  metadata={{ source: 'hero_actions', label: action.label }}
                >
                  <Button variant={action.priority === 'primary' ? 'default' : 'outline'} className={action.priority === 'outline' ? 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md' : ''}>
                    {action.label}
                  </Button>
                </TrackedLink>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-[2] space-y-12">
          
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">About {businessDTO.basicInfo.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
              {businessDTO.basicInfo.description || "This business has not provided a description yet."}
            </p>
          </section>

          {/* Active Offers Section */}
          {activeOffers && activeOffers.length > 0 && (
            <section className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-blue-600" /> Special Offers
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {activeOffers.map((offer: any) => (
                  <div key={offer.id} className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center w-full">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                        {offer.media && offer.media.length > 0 ? (
                            <img src={offer.media[0].url} alt={offer.title} className="w-full h-full object-cover" />
                        ) : businessDTO.media && businessDTO.media.length > 0 ? (
                            <img src={businessDTO.media[0].url} alt={offer.title} className="w-full h-full object-cover" />
                        ) : (
                            <Tag className="w-8 h-8 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{offer.title}</h3>
                          {offer.discount_type && offer.discount_value && (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">
                                  {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                              </Badge>
                          )}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">{offer.description}</p>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                          {offer.promo_code && (
                            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Code: {offer.promo_code}</span>
                          )}
                          {offer.valid_until && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Valid till {new Date(offer.valid_until).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {offer.cta_label && (
                      <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        {offer.cta_url ? (
                            <TrackedLink 
                              href={offer.cta_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-center inline-block"
                              eventType="OFFER_CLICK"
                              entityType="offer"
                              entityId={offer.id}
                              metadata={{ listing_id: businessDTO.basicInfo.id, source: 'business_profile' }}
                            >
                                {offer.cta_label}
                            </TrackedLink>
                        ) : (
                            <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-center">
                                {offer.cta_label}
                            </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Catalog: Products */}
          {businessDTO.catalog?.products?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessDTO.catalog.products.map((product: any) => (
                  <div key={product.id} className="border p-4 rounded-xl flex gap-4">
                    {product.media && product.media.length > 0 && (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={product.media[0].url} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{product.description}</p>
                      {product.price && <span className="font-semibold text-primary">₹{product.price}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Catalog: Services */}
          {businessDTO.catalog?.services?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessDTO.catalog.services.map((service: any) => (
                  <div key={service.id} className="border p-4 rounded-xl">
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{service.description}</p>
                    {service.price_starting_at && <span className="font-semibold text-primary">Starting at ₹{service.price_starting_at}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <ReviewSection listing={businessDTO.basicInfo} />
        </div>

        {/* Sidebar - Sticky Contact Form */}
        <aside className="flex-1">
          <div className="sticky top-24 space-y-6">
            
            {/* Contact Info Card */}
            <div className="premium-card p-6 rounded-2xl shadow-xl border border-border/50">
              <h3 className="text-xl font-bold text-navy dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block">Phone</span>
                    <TrackedLink 
                      href={`tel:${businessDTO.basicInfo.phone}`} 
                      className="font-bold hover:text-primary transition"
                      eventType="PHONE_CLICK"
                      entityType="listing"
                      entityId={businessDTO.basicInfo.id}
                      metadata={{ source: 'sidebar_contact' }}
                    >
                      {businessDTO.basicInfo.phone || "Not provided"}
                    </TrackedLink>
                  </div>
                </div>
                
                {businessDTO.basicInfo.website && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Website</span>
                      <TrackedLink 
                        href={businessDTO.basicInfo.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-bold hover:text-primary transition"
                        eventType="WEBSITE_CLICK"
                        entityType="listing"
                        entityId={businessDTO.basicInfo.id}
                        metadata={{ source: 'sidebar_contact' }}
                      >
                        {businessDTO.basicInfo.website}
                      </TrackedLink>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-navy dark:text-white mb-4">Send an Inquiry</h3>
                <InquiryForm listingId={businessDTO.basicInfo.id} />
              </div>
            </div>

          </div>
        </aside>

      </main>
      <Footer />
    </div>
  );
}
