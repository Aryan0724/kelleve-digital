"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        // We do not have the token in the client response because it's httpOnly, 
        // but our auth store might expect it. Let's pass a dummy or handle it if needed.
        login(data.user, "httpOnly-cookie-set");
        await refreshUser(); // Sync AuthContext with the newly set HTTP-only cookie
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto premium-glass shadow-2xl animate-fade-in-up">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-primary">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-9 h-12 text-lg bg-background border-border focus:ring-primary focus:border-primary rounded-xl"
                autoFocus
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-9 h-12 text-lg bg-background border-border focus:ring-primary focus:border-primary rounded-xl"
              />
            </div>
          </div>
          
          {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl shadow-md transition-all active:scale-[0.98] group"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <>
                Login
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
