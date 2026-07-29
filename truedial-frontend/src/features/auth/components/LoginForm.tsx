"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/context/AuthContext";
import { authService } from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { refreshUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverOtpMessage, setServerOtpMessage] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setServerOtpMessage("");

    try {
      const res = await authService.sendOtp({ phone });
      setStep("OTP");
      if (res.otp) {
        setServerOtpMessage(`Testing OTP: ${res.otp}`); // Fallback for local testing
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authService.verifyOtp({ phone, otp });
      if (res.token && res.user) {
        login(res.user, res.token);
        await refreshUser(); // Sync AuthContext with the newly set HTTP-only cookie
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto premium-glass shadow-2xl animate-fade-in-up">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-primary">
          Welcome to TrueDial
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          {step === "PHONE" 
            ? "Enter your mobile number to get started." 
            : "Enter the OTP sent to your mobile number."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="h-12 px-4 text-lg bg-background border-border focus:ring-primary focus:border-primary rounded-xl"
                autoFocus
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl shadow-md transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                className="h-12 px-4 text-lg text-center tracking-widest bg-background border-border focus:ring-primary focus:border-primary rounded-xl"
                autoFocus
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            {serverOtpMessage && (
              <p className="text-sm font-medium text-accent-foreground text-center bg-accent/20 p-2 rounded-lg border border-accent/30">
                {serverOtpMessage}
              </p>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl shadow-md transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Verify & Login
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep("PHONE");
                  setOtp("");
                  setError("");
                  setServerOtpMessage("");
                }}
                className="text-sm text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
                disabled={loading}
              >
                Change Mobile Number
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
