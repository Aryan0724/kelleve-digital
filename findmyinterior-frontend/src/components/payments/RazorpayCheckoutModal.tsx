"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

// Load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface RazorpayCheckoutModalProps {
  defaultAmount?: number; // amount in INR (will be converted to paise)
  title?: string;
  description?: string;
  onSuccess?: (verificationData: any) => void;
  onError?: (errorMessage: string) => void;
  buttonText?: string;
}

export function RazorpayCheckoutModal({
  defaultAmount = 499,
  title = "Standard Web Checkout",
  description = "Secure payment powered by Razorpay",
  onSuccess,
  onError,
  buttonText = "Pay Now",
}: RazorpayCheckoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amountInINR, setAmountInINR] = useState(defaultAmount);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePayment = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const amountInPaise = Math.round(Number(amountInINR) * 100);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      setErrorMessage("Minimum payment amount is ₹1.00 (100 paise)");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const response = await api.post("/create-order", {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const { order_id, amount, currency } = response.data;

      if (!order_id) {
        throw new Error("Failed to retrieve Order ID from backend");
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 3. Configure Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TKAMwh6HKLnjZV",
        amount: amount.toString(),
        currency: currency || "INR",
        name: "FindMyInterior",
        description: description,
        order_id: order_id,
        handler: async function (paymentResponse: any) {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await api.post("/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              setSuccessMessage("Payment verified successfully! Thank you for your purchase.");
              setOpen(false);
              if (onSuccess) {
                onSuccess(verifyRes.data);
              }
            } else {
              throw new Error(verifyRes.data?.message || "Signature verification failed");
            }
          } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Payment verification failed.";
            setErrorMessage(msg);
            if (onError) onError(msg);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the Razorpay modal without paying
            setErrorMessage("Payment was cancelled by the user.");
            setLoading(false);
            if (onError) onError("Payment was cancelled by the user.");
          },
        },
        theme: {
          color: "#ea580c", // Orange-600
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      // Handle payment.failed event
      razorpayInstance.on("payment.failed", function (response: any) {
        const errorDesc = response.error?.description || "Payment transaction failed.";
        setErrorMessage(errorDesc);
        setLoading(false);
        if (onError) onError(errorDesc);
      });

      razorpayInstance.open();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to initiate checkout order.";
      setErrorMessage(msg);
      setLoading(false);
      if (onError) onError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-2" />}>
        <ShieldCheck className="h-4 w-4" />
        {buttonText}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2.5 text-sm text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="checkout-amount">Amount (INR)</Label>
            <Input
              id="checkout-amount"
              type="number"
              min="1"
              step="1"
              value={amountInINR}
              onChange={(e) => setAmountInINR(Number(e.target.value))}
              placeholder="Enter amount in ₹"
            />
            <p className="text-xs text-slate-500">
              Minimum checkout amount is ₹1 (100 paise)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? "Processing..." : `Proceed to Pay ₹${amountInINR}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
