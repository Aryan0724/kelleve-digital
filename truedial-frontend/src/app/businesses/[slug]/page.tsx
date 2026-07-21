import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { Star, MapPin, Phone, Mail, ShieldCheck, Clock, Share2, Heart, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InquiryForm from "@/components/forms/InquiryForm";
import Link from "next/link";

export default async function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const response = await TrueDialAPI.getListingBySlug(params.slug);
  const business = response.data;

  if (!business) {
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
          style={{ backgroundImage: `url('${business.gallery && business.gallery[0] ? business.gallery[0] : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070'}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex justify-between items-end">
          <div className="text-white animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border border-primary/50 backdrop-blur-md">
                {business.category?.name || "Business"}
              </Badge>
              {business.rating >= 4.5 && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified Premium
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{business.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {business.address || business.city}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Open Now (9 AM - 9 PM)</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-3">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
              <Heart className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-[2] space-y-12">
          
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">About {business.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {business.description || "This business has not provided a description yet."}
            </p>
          </section>

          {/* Features */}
          {business.features && business.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {business.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy dark:text-white">Customer Reviews</h2>
              <div className="flex items-center gap-2 bg-muted/20 px-4 py-2 rounded-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(business.rating || 5) ? 'fill-primary text-primary' : 'fill-muted text-muted'}`} />)}
                </div>
                <span className="font-bold text-lg">{business.rating || "5.0"}</span>
                <span className="text-muted-foreground text-sm">({business.reviews_count || 0})</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">R</div>
                    <div>
                      <h4 className="font-bold">Rahul Verma</h4>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                </div>
                <p className="text-muted-foreground">Excellent service and very professional. Highly recommended for anyone looking for quality work in this area.</p>
              </div>
            </div>
          </section>
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
                    <a href={`tel:${business.phone}`} className="font-bold hover:text-primary transition">{business.phone || "Not provided"}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block">Email</span>
                    <a href={`mailto:${business.email}`} className="font-bold hover:text-primary transition">{business.email || "Not provided"}</a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-navy dark:text-white mb-4">Send an Inquiry</h3>
                <InquiryForm listingId={business.id} />
              </div>
            </div>

          </div>
        </aside>

      </main>
      <Footer />
    </div>
  );
}
