"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrueDialAPI } from "@/lib/api";
import { CheckCircle, Loader2, Calendar, Clock, Users, Package } from "lucide-react";

export default function InquiryForm({ listingId, archetype = "default" }: { listingId: number, archetype?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Construct dynamic message based on archetype fields
    let extraDetails = "";
    if (archetype === 'restaurant') {
      extraDetails = `\nTable Booking: ${formData.get("date")} at ${formData.get("time")} for ${formData.get("guests")} guests.`;
    } else if (archetype === 'healthcare' || archetype === 'salon') {
      extraDetails = `\nAppointment Request: ${formData.get("date")} at ${formData.get("time")}. Service: ${formData.get("service")}`;
    } else if (archetype === 'b2b' || archetype === 'supplier') {
      extraDetails = `\nRFQ Details: Need ${formData.get("quantity")} units. Delivery by ${formData.get("date")}.`;
    }

    const baseMessage = formData.get("message") as string;
    
    const data = {
      listing_id: String(listingId),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: (baseMessage || '') + extraDetails,
    };
    
    await TrueDialAPI.submitInquiry(data);
    
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-12 h-12 mb-2" />
        <h4 className="font-bold text-lg">Request Sent!</h4>
        <p className="text-sm mt-1">The business has received your details and will contact you shortly.</p>
        <Button variant="outline" className="mt-4 border-green-200 dark:border-green-900/50" onClick={() => setSuccess(false)}>Send Another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Archetype Specific Fields */}
      {(archetype === 'restaurant') && (
        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5"/> Date</label>
            <Input type="date" name="date" required className="bg-white dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5"/> Time</label>
            <Input type="time" name="time" required className="bg-white dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5"/> Guests</label>
            <Input type="number" name="guests" min="1" max="20" defaultValue="2" required className="bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {(archetype === 'healthcare' || archetype === 'salon') && (
        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Service Needed</label>
            <select name="service" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm" required>
              <option value="">Select Service...</option>
              <option value="Consultation">General Consultation</option>
              <option value="Specific Procedure">Specific Procedure</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5"/> Date</label>
            <Input type="date" name="date" required className="bg-white dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5"/> Time</label>
            <Input type="time" name="time" required className="bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {(archetype === 'b2b' || archetype === 'supplier') && (
        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Package className="w-3.5 h-3.5"/> Quantity</label>
            <Input type="number" name="quantity" min="1" placeholder="e.g. 500" required className="bg-white dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5"/> Needed By</label>
            <Input type="date" name="date" required className="bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {/* Standard Fields */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Your Name</label>
        <Input name="name" placeholder="John Doe" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone Number</label>
        <Input name="phone" placeholder="+91 9876543210" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Additional Notes</label>
        <textarea name="message" rows={3} placeholder={archetype === 'restaurant' ? "Any special requests?" : "I would like to know more..."} className="w-full flex rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <Button type="submit" className="w-full h-12 font-bold shadow-md shadow-primary/20" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
          archetype === 'restaurant' ? "Request Table" : 
          (archetype === 'healthcare' || archetype === 'salon') ? "Request Appointment" : 
          (archetype === 'b2b' || archetype === 'supplier') ? "Request Quote" : 
          "Contact Business"}
      </Button>
    </form>
  );
}
