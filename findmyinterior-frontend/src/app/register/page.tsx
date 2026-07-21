"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors({ password_confirmation: "Passwords do not match." });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors({ password: "Password must be at least 8 characters." });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      const { user, token } = res.data.data;
      setAuth(user, token);
      router.push("/dashboard");
    } catch (err: any) {
      const responseData = err.response?.data;
      console.error("Registration error:", responseData);

      // Parse Laravel validation errors (field-level)
      if (responseData?.errors && typeof responseData.errors === "object") {
        const parsedErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(responseData.errors)) {
          parsedErrors[field] = Array.isArray(messages) ? (messages as string[])[0] : String(messages);
        }
        setFieldErrors(parsedErrors);
        setError("Please fix the errors below.");
      } else {
        setError(responseData?.message || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key: string) => fieldErrors[key];

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Join FindMyInterior as a homeowner or a business professional.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister} className="space-y-4 pt-6">
          <CardContent className="space-y-4">
            {/* Top-level error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <select
                className="w-full border-slate-200 rounded-md text-sm p-2.5 border focus:ring-orange-600 focus:border-orange-600"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Homeowner (Looking for services)</option>
                <option value="business">Interior Designer / Contractor</option>
                <option value="builder">Real Estate Builder</option>
                <option value="supplier">Material Supplier</option>
                <option value="worker">Skilled Worker</option>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={field("name") ? "border-red-400" : ""}
                />
                {field("name") && <p className="text-xs text-red-600 mt-1">{field("name")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={field("phone") ? "border-red-400" : ""}
                />
                {field("phone") && <p className="text-xs text-red-600 mt-1">{field("phone")}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={field("email") ? "border-red-400" : ""}
              />
              {field("email") && <p className="text-xs text-red-600 mt-1">{field("email")}</p>}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pr-10 ${field("password") ? "border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {field("password") && <p className="text-xs text-red-600 mt-1">{field("password")}</p>}
                <p className="text-xs text-slate-400">Minimum 8 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className={`pr-10 ${field("password_confirmation") ? "border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {field("password_confirmation") && (
                  <p className="text-xs text-red-600 mt-1">{field("password_confirmation")}</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600"
              />
              <Label htmlFor="terms" className="text-sm font-normal text-slate-600 leading-snug">
                I agree to the{" "}
                <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
                ,{" "}
                <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                , and{" "}
                <Link href="/compliance" className="text-orange-600 hover:underline">Community Guidelines</Link>
                .
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
