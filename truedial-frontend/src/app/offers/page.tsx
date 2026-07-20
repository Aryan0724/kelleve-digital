import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tag, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFERS = [
  {
    title: "Flat 20% OFF on Dine-in",
    business: "The Grand Palace Restaurant",
    category: "Restaurants",
    validity: "Valid till 30th Aug 2026",
    code: "PALACE20",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Free Dental Checkup",
    business: "City Care Super Specialty",
    category: "Hospitals",
    validity: "Valid till 15th Sep 2026",
    code: "CITYCAREFREE",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Buy 1 Get 1 Free Oil Change",
    business: "Speedy Auto Servicing",
    category: "Automotive",
    validity: "Valid till 31st Oct 2026",
    code: "SPEEDYBOGO",
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=600&auto=format&fit=crop"
  }
];

export default function OffersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-primary/10 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">Exclusive TrueDial Offers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best discounts and deals from verified businesses in your city. Claim them directly through our platform.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-background py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OFFERS.map((offer, idx) => (
              <div key={idx} className="premium-card rounded-xl overflow-hidden group cursor-pointer animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="h-48 relative">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: `url(${offer.image})`}}></div>
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Tag className="w-3 h-3"/> {offer.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2 group-hover:text-primary transition">{offer.title}</h3>
                  <p className="text-sm font-medium text-foreground mb-4">{offer.business}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {offer.validity}</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle className="w-4 h-4"/> Verified</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 border border-dashed border-primary/50 bg-primary/5 text-primary font-mono text-center py-2 rounded font-bold">
                      {offer.code}
                    </div>
                    <Button>Claim Offer</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
