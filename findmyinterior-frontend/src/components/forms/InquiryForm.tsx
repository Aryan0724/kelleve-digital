"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function InquiryForm({ type, id, title }: { type: 'Listing' | 'BuilderProject' | 'Supplier' | 'Worker', id: number, title: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    message: `I am interested in ${title}. Please contact me.`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/inquiries", {
        ...formData,
        inquirable_type: type,
        inquirable_id: id,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700" />}>
        Contact Now
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {title}</DialogTitle>
          <DialogDescription>
            Send a direct message. Your details will be shared so they can reach out to you.
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="py-8 text-center text-green-600 font-semibold">
            Inquiry sent successfully! They will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message/Requirement</label>
              <Textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="h-24" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
