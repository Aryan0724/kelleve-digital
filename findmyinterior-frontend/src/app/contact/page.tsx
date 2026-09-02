"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");

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
            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Our Office</h3>
                  <p className="text-slate-600 mt-1">
                    <a href="https://maps.app.goo.gl/UaY84sBFCaLg17nQ6" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">
                      123 Innovation Drive<br/>Tech Park, Patna, Bihar 800001
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Phone &amp; WhatsApp</h3>
                  <div className="flex flex-col gap-1.5 mt-2 text-sm">
                    <a href="tel:+917070440365" className="text-slate-700 hover:text-orange-600 font-semibold transition-colors flex items-center gap-1.5">
                      <span>+91 70704 40365</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <a href="tel:+919534900999" className="text-slate-700 hover:text-orange-600 font-semibold transition-colors">
                        <span>+91 95349 00999</span>
                      </a>
                      <a
                        href="https://wa.me/919534900999?text=Hi,%20I%20need%20help%20with%20FindMyInterior."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] bg-green-100 text-green-700 hover:bg-green-200 px-2 py-0.5 rounded-full font-bold transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <div className="flex flex-col gap-1.5 mt-2 text-sm">
                    <a href="mailto:Support@findmyinterior.com" className="text-slate-700 hover:text-orange-600 font-semibold transition-colors break-all">
                      Support@findmyinterior.com
                    </a>
                    <a href="mailto:Office@findmyinterior.com" className="text-slate-700 hover:text-orange-600 font-semibold transition-colors break-all">
                      Office@findmyinterior.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Working Hours</h3>
                  <p className="text-slate-600 mt-1">Mon - Sat: 9:00 AM to 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
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
