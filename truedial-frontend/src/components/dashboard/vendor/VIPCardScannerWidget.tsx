import { useState } from "react";
import { CreditCard, Scan, CheckCircle2 } from "lucide-react";

export default function VIPCardScannerWidget() {
  const [cardNumber, setCardNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");

  const handleVerify = () => {
    if (!cardNumber.trim()) return;
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
      setCardNumber("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1200);
  };

  return (
    <div className="premium-card p-6 rounded-xl flex flex-col mt-6 border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/20">
      <h3 className="font-bold text-navy dark:text-white mb-2 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-amber-500" /> Verify VIP Card
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Enter a customer's TrueDial VIP Card number to register their transaction and grant the discount.
      </p>
      
      {status === "success" ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <div className="font-bold text-sm">Card Verified!</div>
            <div className="text-xs">VIP-PLATINUM (Flat 20% Discount applied)</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Scan className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="e.g. TD-VIP-88219" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <button 
            onClick={handleVerify}
            disabled={status === "verifying"}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 min-w-[80px]"
          >
            {status === "verifying" ? "..." : "Verify"}
          </button>
        </div>
      )}
    </div>
  );
}
