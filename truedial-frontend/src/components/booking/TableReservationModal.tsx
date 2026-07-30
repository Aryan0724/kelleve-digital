"use client";

import { useState } from "react";
import { X, CalendarDays, Clock, User, Phone, Users, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  businessName: string;
  businessSlug: string;
  onClose: () => void;
}

const DINING_SLOTS = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];
const GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10];

export default function TableReservationModal({ businessName, businessSlug, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/bookings/reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ business_slug: businessSlug, guest_name: name, phone, date, time, guests, special_requests: requests }),
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
            <h2 className="text-xl font-bold text-foreground">Reserve a Table</h2>
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
            <h3 className="text-lg font-bold text-foreground">Reservation Requested!</h3>
            <p className="text-sm text-muted-foreground">
              Table for <strong>{guests}</strong> at <strong>{businessName}</strong> on <strong>{date} at {time}</strong>. Confirmation will be sent to <strong>{phone}</strong>.
            </p>
            <Button onClick={onClose} className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white w-full rounded-xl">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Your Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Mehta" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Number of Guests</label>
              <div className="flex gap-2 flex-wrap">
                {GUEST_COUNTS.map(n => (
                  <button key={n} type="button" onClick={() => setGuests(n)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold border transition ${
                      guests === n ? "bg-[#E8701A] text-white border-[#E8701A]" : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}>{n}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Date</label>
                <Input value={date} onChange={e => setDate(e.target.value)} type="date" min={new Date().toISOString().split("T")[0]} className="h-11" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time</label>
                <select value={time} onChange={e => setTime(e.target.value)} required
                  className="w-full h-11 px-3 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select</option>
                  {DINING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Special Requests (optional)</label>
              <textarea value={requests} onChange={e => setRequests(e.target.value)} placeholder="e.g. Birthday cake, window seat, vegan menu..." rows={2}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <Button type="submit" disabled={isLoading || !time} className="w-full h-12 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white rounded-xl font-bold shadow-lg shadow-[#E8701A]/20">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</> : `Reserve Table for ${guests}`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
