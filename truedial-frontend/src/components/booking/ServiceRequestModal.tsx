"use client";

import { useState } from "react";
import { X, CalendarDays, User, Phone, MapPin, Wrench, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  businessName: string;
  businessSlug: string;
  onClose: () => void;
}

const SERVICES = ["Repair", "Installation", "Maintenance / Servicing", "Inspection", "Emergency", "Other"];

export default function ServiceRequestModal({ businessName, businessSlug, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/bookings/service-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ business_slug: businessSlug, customer_name: name, phone, address, service_type: service, preferred_date: date, notes }),
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
            <h2 className="text-xl font-bold text-foreground">Request Service</h2>
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
            <h3 className="text-lg font-bold text-foreground">Service Request Sent!</h3>
            <p className="text-sm text-muted-foreground">
              <strong>{businessName}</strong> will contact you at <strong>{phone}</strong> to confirm your <strong>{service}</strong> booking.
            </p>
            <Button onClick={onClose} className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white w-full rounded-xl">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Your Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amit Singh" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Service Needed</label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map(s => (
                  <button key={s} type="button" onClick={() => setService(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      service === s ? "bg-[#E8701A] text-white border-[#E8701A]" : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Your Address</label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Building, Street, Area, City" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Preferred Date</label>
              <Input value={date} onChange={e => setDate(e.target.value)} type="date" min={new Date().toISOString().split("T")[0]} className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Additional Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. AC not cooling, water leak in bathroom..." rows={2}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <Button type="submit" disabled={isLoading || !service} className="w-full h-12 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white rounded-xl font-bold shadow-lg shadow-[#E8701A]/20">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Service Request"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
