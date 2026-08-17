"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Smartphone } from "lucide-react";
import api from "@/lib/api";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  type: "login" | "registration" | "lead_verification" | "phone_update";
  onSuccess: (data: any) => void;
}

export function OtpVerificationModal({ isOpen, onClose, phoneNumber, type, onSuccess }: OtpVerificationModalProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).split("");
    if (pastedData.some(char => !/^\d$/.test(char))) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/send-otp", { phone: phoneNumber, type });
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = type === 'login' ? "/auth/login-with-otp" : "/auth/verify-otp";
      const res = await api.post(endpoint, {
        phone: phoneNumber,
        otp: otpString,
        type
      });
      
      onSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-xl">Verify your phone number</DialogTitle>
          <DialogDescription className="text-center pt-2">
            We've sent a 6-digit verification code to <br/>
            <span className="font-bold text-slate-800">+91 {phoneNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-lg border-slate-300 focus:border-orange-500 focus:ring-orange-500"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 font-medium text-center">{error}</p>}

          <Button 
            onClick={handleVerify} 
            disabled={loading || otp.join("").length !== 6}
            className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Verify & Continue
          </Button>

          <div className="mt-6 text-center text-sm text-slate-600">
            {countdown > 0 ? (
              <p>Resend code in <span className="font-bold text-slate-800">00:{countdown.toString().padStart(2, '0')}</span></p>
            ) : (
              <p>Didn't receive the code? <button onClick={handleResend} className="text-orange-600 font-bold hover:underline ml-1">Resend OTP</button></p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
