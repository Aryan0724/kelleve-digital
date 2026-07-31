"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userStr = params.get("user");
      const errorMsg = params.get("error");

      if (errorMsg) {
        setError(decodeURIComponent(errorMsg));
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          setAuth(user, token);
          window.history.replaceState({}, document.title, window.location.pathname);
          if (user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } catch (e) {
          console.error("Failed to parse user from Google Login", e);
          setError("Failed to process Google login data.");
        }
      }
    }
  }, [router, setAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data.data;
      setAuth(user, token);
      
      // Redirect based on role
      if (user.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          
          <GoogleAuthButton text="Continue with Google" />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
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

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-500">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
