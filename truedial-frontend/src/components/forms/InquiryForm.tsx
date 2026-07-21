"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrueDialAPI } from "@/lib/api";
import { CheckCircle, Loader2 } from "lucide-react";

export default function InquiryForm({ listingId }: { listingId: number }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      listing_id: String(listingId),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };
    
    await TrueDialAPI.submitInquiry(data);
    
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-12 h-12 mb-2" />
        <h4 className="font-bold text-lg">Inquiry Sent!</h4>
        <p className="text-sm mt-1">The business will contact you shortly.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>Send Another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Your Name</label>
        <Input name="name" placeholder="John Doe" required />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Phone Number</label>
        <Input name="phone" placeholder="+91 9876543210" required />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Message</label>
        <textarea name="message" rows={3} placeholder="I would like to know more about your services..." className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
      </div>
      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Contact Business"}
      </Button>
    </form>
  );
}
