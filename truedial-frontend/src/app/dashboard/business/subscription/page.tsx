"use client";

import { useState } from "react";
import { Check, Zap, Award, ShieldCheck, Download, CreditCard, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("Professional VIP");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [toastMessage, setToastMessage] = useState("");

  const PLANS = [
    {
      name: "Free Starter",
      priceMonthly: 0,
      priceAnnual: 0,
      badge: "Basic",
      features: [
        "Standard Business Listing",
        "Up to 5 lead inquiries / month",
        "Basic contact form",
        "Standard directory placement",
        "Email support"
      ],
      current: currentPlan === "Free Starter"
    },
    {
      name: "Professional VIP",
      priceMonthly: 1999,
      priceAnnual: 1499,
      badge: "Most Popular",
      popular: true,
      features: [
        "Verified Business Shield Badge",
        "Unlimited direct customer leads",
        "0% commission on inquiries",
        "SMS & Email marketing automation",
        "Privilege Card VIP member promotions",
        "Priority ranking on TrueDial & Find My Interior"
      ],
      current: currentPlan === "Professional VIP"
    },
    {
      name: "Enterprise Turnkey",
      priceMonthly: 4999,
      priceAnnual: 3999,
      badge: "Full Power",
      features: [
        "Everything in Professional VIP",
        "Featured homepage showcase spot",
        "Multi-city & multi-branch listings",
        "Dedicated relationship manager",
        "API integration & CRM sync",
        "Custom promotional banners"
      ],
      current: currentPlan === "Enterprise Turnkey"
    }
  ];

  const INVOICES = [
    { id: "INV-2026-1041", date: "Oct 1, 2026", amount: "₹17,988", plan: "Professional VIP (Annual)", status: "Paid" },
    { id: "INV-2025-0892", date: "Oct 1, 2025", amount: "₹17,988", plan: "Professional VIP (Annual)", status: "Paid" }
  ];

  const handleSelectPlan = (planName: string) => {
    setCurrentPlan(planName);
    setToastMessage(`Successfully switched to ${planName} Plan!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Subscription & Membership Plans</h1>
          <p className="text-muted-foreground text-sm">
            Manage your TrueDial listing tier, billing cycle, and verified business perks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              billingCycle === "annual"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual Billing (Save 25%)
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
        </div>
      </div>

      {/* ACTIVE PLAN BANNER */}
      <div className="premium-card p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-foreground">Current Plan: {currentPlan}</h3>
              <Badge className="bg-green-500/20 text-green-600 border-green-200 text-xs">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Next billing date: <span className="font-semibold text-foreground">October 1, 2027</span> • Automatic renewal enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            <CreditCard className="w-4 h-4 mr-1.5" /> Manage Payment Method
          </Button>
        </div>
      </div>

      {/* TIER COMPARISON CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
          const isCurrent = plan.name === currentPlan;

          return (
            <div
              key={plan.name}
              className={`premium-card rounded-2xl p-6 flex flex-col justify-between transition relative ${
                plan.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/10"
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Recommended VIP Tier
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {plan.badge}
                    </Badge>
                  </div>
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  {billingCycle === "annual" && price > 0 && (
                    <div className="text-[11px] text-green-600 font-semibold mt-0.5">
                      Billed annually (₹{(price * 12).toLocaleString()}/year)
                    </div>
                  )}
                </div>

                <ul className="space-y-3 my-6 text-sm">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/80">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                {isCurrent ? (
                  <Button disabled className="w-full font-semibold text-xs h-11">
                    Current Active Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full font-semibold text-xs h-11"
                  >
                    {price === 0 ? "Downgrade to Starter" : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BILLING HISTORY & INVOICES */}
      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-foreground">Billing History & Tax Invoices</h3>
            <p className="text-xs text-muted-foreground">Download GST-compliant invoices for accounting.</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {INVOICES.length} Invoices
          </Badge>
        </div>

        <div className="divide-y divide-border">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                  GST
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{inv.id} • {inv.plan}</div>
                  <div className="text-xs text-muted-foreground">{inv.date} • Amount Paid: <span className="font-semibold text-foreground">{inv.amount}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-600 border-green-200 text-xs">
                  {inv.status}
                </Badge>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5" onClick={() => alert(`Downloading ${inv.id}.pdf...`)}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
