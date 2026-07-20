import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock, Building, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Right Panel - Branding (Swapped for Register) */}
      <div className="hidden md:flex flex-1 bg-navy relative overflow-hidden items-center justify-center p-12 order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-navy via-navy/90 to-primary/30"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-white text-navy rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-white/20">T</div>
            <span className="text-3xl font-bold">truedial</span>
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Grow your business beyond limits.</h1>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-navy-foreground/90"><CheckCircle className="w-5 h-5 text-primary"/> List your business for free</li>
            <li className="flex items-center gap-3 text-navy-foreground/90"><CheckCircle className="w-5 h-5 text-primary"/> Connect with local customers instantly</li>
            <li className="flex items-center gap-3 text-navy-foreground/90"><CheckCircle className="w-5 h-5 text-primary"/> Access marketing and SMS tools</li>
            <li className="flex items-center gap-3 text-navy-foreground/90"><CheckCircle className="w-5 h-5 text-primary"/> Get verified premium badges</li>
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
          <p className="text-muted-foreground mb-8">Join TrueDial today and take your business online.</p>

          <form className="space-y-5" action="/dashboard/business">
            {/* Account Type Toggle */}
            <div className="flex p-1 bg-muted rounded-lg mb-6">
              <div className="flex-1 text-center py-2 bg-background shadow-sm rounded-md text-sm font-semibold text-foreground cursor-pointer">Business Account</div>
              <div className="flex-1 text-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition">Personal Account</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input type="text" placeholder="John" className="pl-9 bg-background focus:ring-primary" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input type="text" placeholder="Doe" className="pl-9 bg-background focus:ring-primary" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Business Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="e.g. John's Restaurant" className="pl-9 bg-background focus:ring-primary" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="john@company.com" className="pl-9 bg-background focus:ring-primary" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input type="tel" placeholder="+91 98765 43210" className="pl-9 bg-background focus:ring-primary" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Create a strong password" className="pl-9 bg-background focus:ring-primary" required />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-md mt-6 shadow-lg shadow-primary/20 group">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
