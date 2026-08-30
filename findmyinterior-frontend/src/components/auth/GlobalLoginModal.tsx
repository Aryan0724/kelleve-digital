"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-toastify";

export function GlobalLoginModal() {
  const { showLoginModal, setShowLoginModal, loginRedirectUrl, setAuth } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data.data;
      setAuth(user, token);
      
      setShowLoginModal(false);
      
      // Optionally redirect or just let them stay on the page
      if (loginRedirectUrl) {
        router.push(loginRedirectUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeAndNavigate = (path: string) => {
    setShowLoginModal(false);
    router.push(path);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={(open) => setShowLoginModal(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-5 pt-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="modal-email">Email or Mobile Number</Label>
            <Input 
              id="modal-email" 
              type="text" 
              placeholder="name@example.com or 10-digit mobile" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="modal-password">Password</Label>
              <button 
                type="button" 
                onClick={() => closeAndNavigate('/forgot-password')}
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input 
                id="modal-password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-5 pt-2">
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-md h-11" disabled={loading}>
              {loading ? "Logging in..." : "Login to account"}
            </Button>
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => closeAndNavigate('/register')}
                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
              >
                Create one now
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
