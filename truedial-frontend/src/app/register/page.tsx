"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle, Loader2, Store, Utensils, Stethoscope, Scissors, Dumbbell, GraduationCap, Hotel, Scale, Camera, Car, Plane, Laptop, HardHat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { CATEGORIES } from "@/lib/categories";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"customer" | "business" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [professionalType, setProfessionalType] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleAccountTypeSelect = (type: "customer" | "business") => {
    setAccountType(type);
    if (type === "customer") {
      setProfessionalType("customer");
      setStep(3); // Go straight to form
    } else {
      setStep(2); // Go to category picker
    }
  };

  const activeCategoryData = CATEGORIES.find(c => c.id === selectedCategory);

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
    
    // We get business_name for businesses
    const businessName = formData.get("business_name") as string;

    if (password !== password_confirmation) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (accountType === 'business' && !professionalType) {
      setError("Please select a specific business type.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: accountType === 'business' && businessName ? businessName : name, 
          email, 
          phone, 
          password, 
          password_confirmation, 
          role: professionalType // We pass the specific type here
        }),
      });

      const data = await res.json();

      if (data.success) {
        await refreshUser();
        
        if (accountType === "business") {
          // Send to vendor dashboard directly. Onboarding will catch them there if needed.
          router.push("/dashboard/vendor");
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
      <div className={`hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12 order-2 transition-colors duration-500 ${accountType === 'business' ? 'bg-[#E8701A]' : 'bg-navy'}`}>
        <div className={`absolute inset-0 bg-cover bg-center opacity-20 ${accountType === 'business' ? 'bg-[url("https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop")]' : 'bg-[url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop")]'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-tl ${accountType === 'business' ? 'from-[#E8701A] via-[#E8701A]/90 to-navy/30' : 'from-navy via-navy/90 to-primary/30'}`}></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg ${accountType === 'business' ? 'bg-white text-[#E8701A] shadow-white/20' : 'bg-primary text-white shadow-primary/20'}`}>T</div>
            <span className="text-3xl font-bold">truedial</span>
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {accountType === 'business' ? "Grow your business beyond limits." : "Join India's most trusted network."}
          </h1>
          
          <ul className="space-y-4 mb-8">
            {accountType === 'business' ? (
              <>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Connect with local customers instantly</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Get a personalized business dashboard</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Access marketing and CRM tools</li>
                <li className="flex items-center gap-3 text-white/90"><CheckCircle className="w-5 h-5 text-white"/> Discover B2B requirements</li>
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

      {/* Left Panel - Forms */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 animate-fade-in order-1 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto py-8">
          
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">T</div>
            <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
          </div>

          {/* STEP 1: Account Type Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Create Account</h2>
              <p className="text-muted-foreground mb-8">Choose your account type to get started.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => handleAccountTypeSelect("customer")}
                  className="border-2 border-border rounded-xl p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">I'm a Customer</h3>
                  <p className="text-sm text-muted-foreground">Looking for services, shops, and professionals in my area.</p>
                </div>

                <div 
                  onClick={() => handleAccountTypeSelect("business")}
                  className="border-2 border-border rounded-xl p-6 cursor-pointer hover:border-[#E8701A] hover:bg-[#E8701A]/5 transition-all group text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E8701A]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Store className="w-8 h-8 text-[#E8701A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">I'm a Business Owner</h3>
                  <p className="text-sm text-muted-foreground">I want to list my business, get leads, and grow.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
              </div>
            </div>
          )}

          {/* STEP 2: Business Category Picker */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">← Back</button>
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8701A] w-1/2"></div>
                </div>
                <span className="text-sm font-medium">Step 1 of 2</span>
              </div>
              
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">What kind of business?</h2>
              <p className="text-muted-foreground mb-6">Select your primary business category.</p>

              {!selectedCategory ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="border border-border rounded-lg p-4 cursor-pointer hover:border-[#E8701A] hover:bg-[#E8701A]/5 transition-all flex flex-col items-center text-center gap-2"
                      >
                        <Icon className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                    <button onClick={() => { setSelectedCategory(null); setProfessionalType(""); }} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
                      ←
                    </button>
                    {activeCategoryData && (
                      <>
                        <activeCategoryData.icon className="w-5 h-5 text-[#E8701A]" />
                        <span className="font-bold">{activeCategoryData.name}</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select your specific type:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeCategoryData?.subTypes.map((sub) => (
                        <div 
                          key={sub.value}
                          onClick={() => setProfessionalType(sub.value)}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${professionalType === sub.value ? 'border-[#E8701A] bg-[#E8701A]/10 text-[#E8701A] font-bold' : 'border-border hover:border-[#E8701A]/50'}`}
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold"
                    disabled={!professionalType}
                    onClick={() => setStep(3)}
                  >
                    Continue to Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Basic Details */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep(accountType === 'business' ? 2 : 1)} className="text-muted-foreground hover:text-foreground">← Back</button>
                {accountType === 'business' && (
                  <>
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#E8701A] w-full"></div>
                    </div>
                    <span className="text-sm font-medium">Step 2 of 2</span>
                  </>
                )}
              </div>

              <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Basic Details</h2>
              <p className="text-muted-foreground mb-6">Let's get you set up.</p>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-md text-sm font-medium mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {accountType === 'business' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Business Name</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input type="text" name="business_name" placeholder="e.g. Spice Garden Restaurant" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">First Name {accountType === 'business' ? '(Owner)' : ''}</label>
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
                    <Input type="tel" name="phone" placeholder="9876543210" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input type="password" name="password" placeholder="••••••••" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input type="password" name="password_confirmation" placeholder="••••••••" className="pl-9 h-10 bg-background focus:ring-primary transition-colors" required disabled={isLoading} />
                    </div>
                  </div>
                </div>

                <Button type="submit" className={`w-full h-12 text-md mt-6 shadow-lg group font-semibold ${accountType === 'business' ? 'bg-[#E8701A] hover:bg-[#E8701A]/90 shadow-[#E8701A]/20' : 'shadow-primary/20'}`} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {accountType === 'business' ? "Creating Business Account..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {accountType === 'business' ? "Create Business Account" : "Create Account"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
