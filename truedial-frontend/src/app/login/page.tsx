"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { loginAction, sendOtpAction, verifyOtpAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  
  // OTP State
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setIsLoading(true);
    setError("");
    const res = await sendOtpAction(phone);
    setIsLoading(false);
    
    if (res.success) {
      setOtpSent(true);
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
    const res = await verifyOtpAction(phone, otp);
    setIsLoading(false);

    if (res.success) {
      const role = res.user?.roles?.[0]?.slug || res.user?.role;
      router.push(role === "business" ? "/dashboard/business" : "/dashboard/user");
    } else {
      setError(res.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-1 bg-navy relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-primary/30"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/30">T</div>
            <span className="text-3xl font-bold">truedial</span>
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Welcome back to India's fastest growing business network.</h1>
          <p className="text-navy-foreground/80 text-lg mb-8">Access your dashboard, manage your listings, and connect with millions of customers instantly.</p>
          
          <div className="flex items-center gap-3 text-sm font-medium bg-white/10 backdrop-blur-sm p-4 rounded-lg w-fit border border-white/20">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Secure & Encrypted Connection</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-24 animate-fade-in-right">
        <div className="max-w-md w-full mx-auto">
          <div className="md:hidden flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">T</div>
            <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
          </div>

          <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Login to your account</h2>
          <p className="text-muted-foreground mb-6">Enter your mobile number or email to access your TrueDial dashboard.</p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm font-medium mb-6">
              {error}
            </div>
          )}

          {loginMethod === "otp" ? (
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your 10-digit mobile number" 
                        className="pl-10 h-12 bg-background border-border focus:ring-primary text-lg" 
                        required 
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-12 text-md mt-4 shadow-lg shadow-primary/20 group">
                    {isLoading ? "Sending OTP..." : "Login with OTP"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-muted rounded-lg mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">OTP sent to</p>
                      <p className="font-semibold text-foreground">+91 {phone}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setOtpSent(false)} className="text-primary hover:text-primary/80">
                      Change
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Enter OTP</label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••••" 
                        className="pl-10 h-12 bg-background border-border focus:ring-primary text-lg tracking-[0.5em] text-center" 
                        required 
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-12 text-md mt-4 shadow-lg shadow-primary/20 group">
                    {isLoading ? "Verifying..." : "Verify & Login"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              )}
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button variant="outline" onClick={() => { setError(""); setLoginMethod("password"); }} className="w-full h-12">
                <Mail className="w-4 h-4 mr-2" /> Login with Email & Password
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <form className="space-y-6" action={loginAction}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input type="email" name="email" placeholder="name@company.com" className="pl-10 h-12 bg-background border-border focus:ring-primary" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot Password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input type="password" name="password" placeholder="••••••••" className="pl-10 h-12 bg-background border-border focus:ring-primary" required />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-md mt-4 shadow-lg shadow-primary/20 group">
                  Login to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button variant="outline" onClick={() => { setError(""); setLoginMethod("otp"); }} className="w-full h-12">
                <Phone className="w-4 h-4 mr-2" /> Login with Mobile OTP
              </Button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Want to list your business? <Link href="/free-listing" className="text-primary font-bold hover:underline">Get a Free Listing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
