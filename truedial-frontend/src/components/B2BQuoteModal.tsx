"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, ArrowRight, MessageSquare, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtpAction, verifyOtpAction } from "@/app/actions/auth";

export default function B2BQuoteModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !requirement) {
      setError("Please enter your requirement");
      return;
    }
    if (step === 2 && !city) {
      setError("Please enter your city");
      return;
    }
    setError("");
    setStep(s => s + 1);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setIsLoading(true);
    const res = await sendOtpAction(phone);
    setIsLoading(false);
    if (res.success) {
      setStep(4);
    } else {
      setError(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setIsLoading(true);
    const res = await verifyOtpAction(phone, otp);
    setIsLoading(false);
    
    if (res.success) {
      // Typically, submit the requirement to the backend here
      setStep(5);
    } else {
      setError(res.message);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-gray-500 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-gradient-to-r from-orange-50 to-primary/10 p-8 pb-6 border-b border-orange-100">
            <h2 className="text-2xl font-bold text-navy">Get Best Quotes Fast</h2>
            <p className="text-gray-600 mt-1">Tell us what you need, and we'll connect you with top vendors.</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">What are you looking for?</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input 
                      value={requirement}
                      onChange={e => setRequirement(e.target.value)}
                      placeholder="e.g., Commercial Interior Designers"
                      className="pl-10 h-12 bg-gray-50 border-transparent focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full h-12 text-md shadow-lg shadow-primary/20">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Where do you need this?</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g., Andheri, Mumbai"
                      className="pl-10 h-12 bg-gray-50 border-transparent focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full h-12 text-md shadow-lg shadow-primary/20">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Your Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="h-12 px-4 bg-gray-100 rounded-md flex items-center text-gray-500 font-medium">
                      +91
                    </div>
                    <Input 
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="h-12 flex-1 bg-gray-50 border-transparent focus:bg-white text-lg tracking-wide"
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-md shadow-lg shadow-primary/20">
                  {isLoading ? "Sending OTP..." : "Get Quotes Now"}
                </Button>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Enter the OTP sent to +91 {phone}</p>
                </div>
                <div className="space-y-2">
                  <Input 
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="h-14 text-center text-2xl tracking-[0.5em] bg-gray-50 border-transparent focus:bg-white"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-md shadow-lg shadow-primary/20">
                  {isLoading ? "Verifying..." : "Verify & Submit"}
                </Button>
              </form>
            )}

            {step === 5 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Requirement Submitted!</h3>
                <p className="text-gray-500 mb-8">Top rated vendors will contact you shortly with their best quotes.</p>
                <Button onClick={onClose} className="w-full h-12">
                  Done
                </Button>
              </div>
            )}
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
