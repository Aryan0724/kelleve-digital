"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"customer" | "business">("customer");
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const name = `${first_name} ${last_name}`;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get("password_confirmation") as string;

    if (password !== password_confirmation) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, password_confirmation, role }),
      });

      const data = await res.json();

      if (data.success) {
        await refreshUser();
        
        // If they registered as a business, redirect them to the free-listing wizard to complete onboarding
        if (role === "business") {
          router.push("/free-listing?new_user=true");
        } else {
          router.push("/dashboard/user");
        }
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Right Panel - Branding */}
      <div className={`hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12 order-2 transition-colors duration-500 ${role === 'business' ? 'bg-[#E8701A]' : 'bg-navy'}`}>
        <div className={`absolute inset-0 bg-cover bg-center opacity-20 ${role === 'business' ? 'bg-[url("https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop")]' : 'bg-[url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop")]'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-tl ${role === 'business' ? 'from-[#E8701A] via-[#E8701A]/90 to-navy/30' : 'from-navy via-navy/90 to-primary/30'}`}></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <Link href="/" className="flex items-center mb-12 group">
            <img 
              src="/logo.png" 
              alt="TrueDial" 
              className="h-14 sm:h-16 w-auto bg-white/95 p-1.5 rounded-xl shadow-lg transition-transform group-hover:scale-105" 
            />
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {role === 'business' ? "Grow your business beyond limits." : "Join India's most trusted network."}
          </h1>
          
          <ul className="space-y-4 mb-8">
            {role === 'business' ? (
              <>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> List your business for free</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Connect with local customers instantly</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Access marketing and SMS tools</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Get verified premium badges</li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-primary"/> Discover top-rated local services</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-primary"/> Access exclusive Privilege Cards</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-primary"/> Read authentic customer reviews</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-primary"/> Chat directly with verified vendors</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 animate-fade-in order-1 overflow-y-auto">
        <div className="max-w-md w-full mx-auto py-8">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">T</div>
            <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
          </div>

          <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Create Account</h2>
          <p className="text-muted-foreground mb-6">Join TrueDial today and get started instantly.</p>

          {/* Account Type Toggle */}
          <div className="flex p-1 bg-muted/50 rounded-lg mb-8 relative border border-border">
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="role" value="customer" className="peer sr-only" checked={role === "customer"} onChange={() => setRole("customer")} />
              <div className="text-center py-2.5 rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-background peer-checked:shadow-sm peer-checked:font-bold peer-checked:text-foreground transition-all duration-300">
                Personal Account
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="role" value="business" className="peer sr-only" checked={role === "business"} onChange={() => setRole("business")} />
              <div className="text-center py-2.5 rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-background peer-checked:shadow-sm peer-checked:font-bold peer-checked:text-primary transition-all duration-300">
                Business Account
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-md text-sm font-medium mb-6">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="text" name="first_name" placeholder="John" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="text" name="last_name" placeholder="Doe" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input type="email" name="email" placeholder="name@example.com" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input type="tel" name="phone" placeholder="+91 98765 43210" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input type="password" name="password" placeholder="Create a strong password" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input type="password" name="password_confirmation" placeholder="Confirm your password" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-md mt-6 shadow-lg shadow-primary/20 group font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {role === 'business' ? "Creating Business Account..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {role === 'business' ? "Create Business Account" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
