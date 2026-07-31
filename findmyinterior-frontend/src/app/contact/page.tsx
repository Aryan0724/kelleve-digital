"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  PhoneCall, 
  Send, 
  Calendar,
  Navigation,
  Sparkles
} from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 5.5);
      const day = ist.getDay();
      const hour = ist.getHours();
      setOpenStatus(day >= 1 && day <= 6 && hour >= 9 && hour < 18);
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Name, Email, and Message are required.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await api.post("/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? We're here to help. Reach out to the Find My Interior team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* 1. OUR OFFICE CARD */}
            <Card className="border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:border-[#E8701A]/40 transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-[#E8701A] rounded-full shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white">Our Office</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">
                      123 Innovation Drive<br/>Tech Park, Patna, Bihar 800001
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Patna+Bihar+800001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white shadow-sm transition-all duration-200 transform hover:scale-105"
                      >
                        <Navigation className="w-3.5 h-3.5 mr-1.5" /> Get Directions ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy("123 Innovation Drive, Tech Park, Patna, Bihar 800001", "address")}
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {copiedField === "address" ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> <span className="text-green-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. PHONE CARD */}
            <Card className="border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:border-[#E8701A]/40 transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-[#E8701A] rounded-full shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">+91 98765 43210</p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <a
                        href="tel:+919876543210"
                        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#E8701A] hover:bg-[#c25a12] text-white shadow-sm transition-all duration-200 transform hover:scale-105"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Call Now
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy("+91 98765 43210", "phone")}
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {copiedField === "phone" ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> <span className="text-green-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" /> Copy Number
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. EMAIL CARD */}
            <Card className="border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:border-[#E8701A]/40 transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-[#E8701A] rounded-full shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white">Email</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm break-all font-medium">
                      support@findmyinterior.com
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <a
                        href="mailto:support@findmyinterior.com?subject=Enquiry%20from%20Find%20My%20Interior%20Contact%20Page"
                        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white shadow-sm transition-all duration-200 transform hover:scale-105"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Send Email
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy("support@findmyinterior.com", "email")}
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {copiedField === "email" ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> <span className="text-green-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" /> Copy Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. WORKING HOURS CARD (REAL-TIME IST LIVE STATUS) */}
            <Card className="border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:border-[#E8701A]/40 transition-all duration-300 transform hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-[#E8701A] rounded-full shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">Working Hours</h3>
                      <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        openStatus 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 ring-1 ring-green-500/30" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-1 ring-red-500/30"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          openStatus ? "bg-green-500 animate-pulse" : "bg-red-500"
                        }`}></span>
                        {openStatus ? "OPEN NOW" : "CLOSED NOW"}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1.5 text-sm font-medium">
                      Mon - Sat: 9:00 AM to 6:00 PM IST
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {openStatus ? "• Open for calls & office visits today" : "• Opens Monday at 9:00 AM IST"}
                    </p>
                    <div className="flex items-center mt-4">
                      <button
                        type="button"
                        onClick={scrollToForm}
                        className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-sm transition-all duration-200 transform hover:scale-105"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book Consultation
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2" id="contact-form-section">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription className="text-slate-300">We usually reply within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                    <p className="text-slate-600 mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                    <Button onClick={() => setSuccess(false)} variant="outline">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Your Name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@example.com" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input 
                          id="phone" 
                          placeholder="+91..." 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          value={formData.subject} 
                          onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Write your query here..." 
                        className="min-h-[150px]"
                        value={formData.message} 
                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                        required 
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
