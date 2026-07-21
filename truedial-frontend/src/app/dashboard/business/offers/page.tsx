import { Tag, Plus, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function OffersPage() {
  const activeOffers = [
    { id: 1, title: "Flat 50% Off on Interior Design Consultation", code: "WELCOME50", validUntil: "2026-12-31", uses: 45 },
    { id: 2, title: "Free Dental Checkup for First Time Patients", code: "FREEDENTAL", validUntil: "2026-10-15", uses: 12 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Manage Offers</h1>
          <p className="text-muted-foreground">Create exclusive discounts to attract TrueDial Privilege Card holders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Create Offer Form */}
        <div className="md:col-span-1">
          <div className="premium-card p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary"/> Create New Offer</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer Title</label>
                <Input placeholder="e.g. 20% Off All Services" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Promo Code</label>
                <Input placeholder="e.g. TRUEDIAL20" className="uppercase" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Valid Until</label>
                <Input type="date" required />
              </div>
              <Button type="submit" className="w-full">Publish Offer</Button>
            </form>
          </div>
        </div>

        {/* Active Offers */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-lg mb-2">Active Offers</h3>
          
          {activeOffers.map((offer) => (
            <div key={offer.id} className="premium-card p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{offer.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className="font-mono bg-muted/50">{offer.code}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Valid till {offer.validUntil}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-l border-border pl-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-navy dark:text-white">{offer.uses}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Claims</span>
                </div>
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 w-10 p-0 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
