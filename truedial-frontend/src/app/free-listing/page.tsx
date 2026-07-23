"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Store, MapPin, Tags, Camera } from "lucide-react";
import { sendOtpAction, verifyOtpAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Basic Details", icon: Store },
  { id: 2, title: "OTP Verification", icon: CheckCircle },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Categories", icon: Tags },
];

export default function FreeListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [otp, setOtp] = useState("");
  
  // Step 3 & 4 State (Normally would be sent to an API to complete profile, we'll just mock redirecting)
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!companyName) {
      setError("Please enter your Company/Business Name");
      return;
    }
    
    setIsLoading(true);
    setError("");
    const res = await sendOtpAction(phone);
    setIsLoading(false);
    
    if (res.success) {
      setStep(2);
    } else {
      setError(res.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    const res = await verifyOtpAction(phone, otp, companyName);
    setIsLoading(false);

    if (res.success) {
      // Successfully authenticated! In a real app, we'd store the token
      // and update the user's business profile with location/categories in subsequent steps.
      // We will proceed to step 3 for UX completion before redirecting.
      setStep(3);
    } else {
      setError(res.message || "Invalid OTP. Please try again.");
    }
  };
  
  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically hit `/api/v1/truedial/vendor/businesses` to save details
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard/business");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">T</div>
            <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-navy dark:text-white tracking-tight">Add Your Business for Free</h1>
          <p className="mt-2 text-lg text-muted-foreground">Reach millions of customers in your city</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {STEPS.map((s) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' :
                    isCurrent ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30 ring-4 ring-primary/20' :
                    'bg-background border-2 border-border text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8 md:p-12">
            
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg text-sm font-medium mb-8 flex items-center gap-2 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Company Name</label>
                  <Input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Interiors" 
                    className="h-14 text-lg bg-muted/50 border-transparent focus:bg-background transition-colors" 
                    required 
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="h-14 px-4 bg-muted/50 rounded-md border border-transparent flex items-center text-muted-foreground font-medium">
                      +91
                    </div>
                    <Input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210" 
                      className="h-14 text-lg bg-muted/50 border-transparent focus:bg-background transition-colors flex-1" 
                      required 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> We'll send an OTP to verify this number
                  </p>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg mt-8 shadow-xl shadow-primary/20 group rounded-xl">
                  {isLoading ? "Sending OTP..." : "Start Free Listing"}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in-right">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Verify your number</h3>
                  <p className="text-muted-foreground mt-2">
                    We've sent a 6-digit code to <strong>+91 {phone}</strong>
                  </p>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <Input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••" 
                    className="h-16 text-3xl tracking-[0.5em] text-center bg-muted/50 border-transparent focus:bg-background" 
                    required 
                    autoFocus
                    maxLength={6}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-14 rounded-xl flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="h-14 text-lg shadow-xl shadow-primary/20 group rounded-xl flex-[2]">
                    {isLoading ? "Verifying..." : "Verify OTP"}
                    {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6 animate-fade-in-right">
                <h3 className="text-2xl font-bold mb-6">Where is your business located?</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">City / Town</label>
                  <Input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai" 
                    className="h-14 text-lg bg-muted/50 border-transparent focus:bg-background" 
                    required 
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Full Address</label>
                  <Input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building name, Street, Landmark" 
                    className="h-14 text-lg bg-muted/50 border-transparent focus:bg-background" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full h-14 text-lg mt-8 shadow-xl shadow-primary/20 group rounded-xl">
                  Continue to Categories
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={handleCompleteSetup} className="space-y-6 animate-fade-in-right">
                <h3 className="text-2xl font-bold mb-6">What services do you offer?</h3>
                
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground">Select Categories (Comma separated)</label>
                  <Input 
                    type="text" 
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="e.g. Interior Designers, Modular Kitchens, Architects" 
                    className="h-14 text-lg bg-muted/50 border-transparent focus:bg-background" 
                    required 
                    autoFocus
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["Interior Designers", "Modular Kitchens", "Carpenters", "Painters", "Architects"].map(tag => (
                      <div key={tag} className="px-3 py-1.5 bg-muted rounded-full text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors border border-border" onClick={() => setCategories(prev => prev ? prev + ", " + tag : tag)}>
                        + {tag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg shadow-xl shadow-primary/20 group rounded-xl">
                    {isLoading ? "Saving Profile..." : "Complete Setup & Go to Dashboard"}
                    {!isLoading && <CheckCircle className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
              </form>
            )}

          </div>
          
          <div className="bg-muted/50 p-6 text-center border-t border-border">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to TrueDial's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
