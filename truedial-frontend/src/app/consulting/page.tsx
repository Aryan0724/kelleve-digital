"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, BriefcaseBusiness, TrendingUp, ShieldCheck, Landmark, Palette, CheckCircle2 } from "lucide-react";

export default function ConsultingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_type: "Startup Registration",
    message: ""
  });

  const services = [
    { title: "Startup Registration", icon: <BriefcaseBusiness className="h-6 w-6 text-blue-500" />, desc: "Complete PVT LTD, LLP, or Proprietorship registration." },
    { title: "Trademark & IP", icon: <ShieldCheck className="h-6 w-6 text-green-500" />, desc: "Protect your brand name, logo, and intellectual property." },
    { title: "GST & Compliance", icon: <Landmark className="h-6 w-6 text-purple-500" />, desc: "Monthly GST filings, ITR, and corporate compliance." },
    { title: "Brand Identity & Logo", icon: <Palette className="h-6 w-6 text-pink-500" />, desc: "Professional logo design, domain registration, and branding." },
    { title: "Business Funding", icon: <TrendingUp className="h-6 w-6 text-[#E8701A]" />, desc: "Pitch deck creation and investor connection." },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/public/consulting/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", phone: "", service_type: "Startup Registration", message: "" });
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f24]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0a1c3a] to-[#050f24] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[#E8701A]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-[#E8701A] text-white hover:bg-[#c95d13] mb-6 border-0">TrueDial Business Consulting</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Expert Guidance to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#E8701A]">Scale Your Vision</span>
            </h1>
            <p className="text-xl text-white/70 mb-10">
              From startup registration and trademarks to funding and compliance. Let our experts handle the paperwork while you focus on growth.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-blue-200">
                <CheckCircle2 className="h-5 w-5 mr-3 text-blue-400" /> Dedicated Account Manager
              </div>
              <div className="flex items-center text-blue-200">
                <CheckCircle2 className="h-5 w-5 mr-3 text-blue-400" /> 100% Digital Process
              </div>
              <div className="flex items-center text-blue-200">
                <CheckCircle2 className="h-5 w-5 mr-3 text-blue-400" /> Verified Legal Experts
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
            {success ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-blue-200">Our consulting team will call you within 24 hours to discuss your requirements.</p>
                <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100" onClick={() => setSuccess(false)}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">Request a Free Callback</h3>
                <p className="text-blue-200 text-sm mb-6">Select a service below and our experts will guide you.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-blue-200 font-medium mb-1 block">Full Name</label>
                    <Input required name="name" value={formData.name} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 h-12" placeholder="Rahul Sharma" />
                  </div>
                  
                  <div>
                    <label className="text-xs text-blue-200 font-medium mb-1 block">Phone Number</label>
                    <Input required name="phone" value={formData.phone} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 h-12" placeholder="+91 9876543210" />
                  </div>

                  <div>
                    <label className="text-xs text-blue-200 font-medium mb-1 block">Required Service</label>
                    <select 
                      name="service_type" 
                      value={formData.service_type} 
                      onChange={handleChange}
                      className="flex h-12 w-full items-center justify-between rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {services.map(s => (
                        <option key={s.title} value={s.title} className="bg-slate-900">{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-blue-200 font-medium mb-1 block">Additional Details (Optional)</label>
                    <Textarea name="message" value={formData.message} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 min-h-[80px]" placeholder="Tell us more about your business..." />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold mt-2">
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Request Callback"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Comprehensive Business Services</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to legally structure, protect, and scale your operations under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0a1c3a]/50 border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
