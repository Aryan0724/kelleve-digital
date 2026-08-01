"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const urlError = searchParams.get("error");
  const redirectTo = searchParams.get("redirect");

  const [role, setRole] = useState<"customer" | "business">("customer");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // pass the role just in case backend needs it for redirect logic
      });

      const data = await res.json();

      if (data.success) {
        await refreshUser();
        const roleSlugs = (data.roles || (data.role ? [data.role] : [])).map((r: any) => typeof r === 'string' ? r : (r.slug || r.name || '')).map((s: string) => s.toLowerCase());
        
        const isVendor = roleSlugs.some((r: string) => 
          ['business', 'builder', 'supplier', 'worker', 'contractor', 'architect', 'interior_designer', 'skilled_worker', 'material_supplier', 'doctor', 'hospital', 'clinic', 'dentist', 'restaurant', 'cafe', 'bakery', 'food', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(r)
        );
        const isAdmin = roleSlugs.some((r: string) => ['admin', 'super_admin'].includes(r));
        
        let dashboardRoute = "/dashboard/user";
        if (isAdmin) dashboardRoute = "/dashboard/admin";
        else if (isVendor) dashboardRoute = "/dashboard/vendor";

        const dest = redirectTo || dashboardRoute;
        router.push(dest);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  const displayError = error || urlError || "";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Panel - Branding */}
      <div className={`hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12 transition-colors duration-500 ${role === 'business' ? 'bg-[#E8701A]' : 'bg-navy'}`}>
        <div className={`absolute inset-0 bg-cover bg-center opacity-20 ${role === 'business' ? 'bg-[url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop")]' : 'bg-[url("https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop")]'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-br ${role === 'business' ? 'from-[#E8701A] via-[#E8701A]/90 to-navy/30' : 'from-navy via-navy/90 to-primary/30'}`}></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg ${role === 'business' ? 'bg-white text-[#E8701A] shadow-white/30' : 'bg-primary text-white shadow-primary/30'}`}>T</div>
            <span className="text-3xl font-bold">truedial</span>
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {role === 'business' ? "Grow your business with TrueDial." : "Welcome back to India's fastest growing network."}
          </h1>
          <p className="text-white/80 text-lg mb-8">
            {role === 'business' 
              ? "Access your dashboard, manage your listings, and connect with millions of customers instantly." 
              : "Discover local services, read reviews, and connect with verified businesses in your area."}
          </p>
          
          <div className="flex items-center gap-3 text-sm font-medium bg-white/10 backdrop-blur-sm p-4 rounded-lg w-fit border border-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
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
          <p className="text-muted-foreground mb-6">Enter your email and password to access your TrueDial dashboard.</p>

          {/* Account Type Toggle */}
          <div className="flex p-1 bg-muted/50 rounded-lg mb-8 relative border border-border">
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="role" value="customer" className="peer sr-only" checked={role === "customer"} onChange={() => setRole("customer")} />
              <div className="text-center py-2.5 rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-background peer-checked:shadow-sm peer-checked:font-bold peer-checked:text-foreground transition-all duration-300">
                Personal Login
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="role" value="business" className="peer sr-only" checked={role === "business"} onChange={() => setRole("business")} />
              <div className="text-center py-2.5 rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-background peer-checked:shadow-sm peer-checked:font-bold peer-checked:text-primary transition-all duration-300">
                Business Login
              </div>
            </label>
          </div>

          {displayError && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-md text-sm font-medium mb-6 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="space-y-6 animate-fade-in">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder={role === 'business' ? "business@company.com" : "name@example.com"} 
                    className="pl-10 h-12 bg-background border-border focus:ring-primary transition-colors" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 bg-background border-border focus:ring-primary transition-colors" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary w-4 h-4" defaultChecked />
                  Remember me for 30 days
                </label>
              </div>

              <Button type="submit" className="w-full h-12 text-md mt-4 shadow-lg shadow-primary/20 group font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </div>
          
          {role === 'customer' && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Want to list your business? <Link href="/free-listing" className="text-[#E8701A] font-bold hover:underline">Get a Free Listing</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
