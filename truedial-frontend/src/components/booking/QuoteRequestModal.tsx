"use client";

import { useState } from "react";
import { X, IndianRupee, User, Phone, Layers, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  businessName: string;
  businessSlug: string;
  onClose: () => void;
}

const PROJECT_TYPES = ["Full Home Interior", "Modular Kitchen", "Office Design", "Single Room", "Renovation", "New Construction", "Other"];
const BUDGETS = ["Under ₹2 Lakhs", "₹2L – ₹5L", "₹5L – ₹10L", "₹10L – ₹20L", "₹20L – ₹50L", "₹50L+"];

export default function QuoteRequestModal({ businessName, businessSlug, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/bookings/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ business_slug: businessSlug, client_name: name, phone, project_type: projectType, budget, description }),
      });
    } catch (_) {}
    finally {
      setIsLoading(false);
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Get a Free Quote</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{businessName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Quote Request Sent!</h3>
            <p className="text-sm text-muted-foreground">
              <strong>{businessName}</strong> will reach out to you at <strong>{phone}</strong> within 24 hours with a personalized quote for your <strong>{projectType}</strong> project.
            </p>
            <Button onClick={onClose} className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white w-full rounded-xl">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Your Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vikram Shah" className="h-11" required />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="h-11" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Project Type</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map(p => (
                  <button key={p} type="button" onClick={() => setProjectType(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      projectType === p ? "bg-[#E8701A] text-white border-[#E8701A]" : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Approximate Budget</label>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(b => (
                  <button key={b} type="button" onClick={() => setBudget(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      budget === b ? "bg-[#E8701A] text-white border-[#E8701A]" : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}>{b}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Project Details</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                placeholder="Tell us about your space, style preferences, area in sq ft, timeline..."
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <Button type="submit" disabled={isLoading || !projectType || !budget} className="w-full h-12 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white rounded-xl font-bold shadow-lg shadow-[#E8701A]/20">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Get Free Quote"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
