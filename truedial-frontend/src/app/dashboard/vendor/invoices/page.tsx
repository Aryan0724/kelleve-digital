"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt, Plus, Copy, CheckCircle2, IndianRupee, Send } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    lead_name: "",
    amount: "",
    description: ""
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/invoices`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setInvoices([data.data, ...invoices]);
        setIsCreating(false);
        setFormData({ lead_name: "", amount: "", description: "" });
      }
    } catch (error) {
      console.error("Failed to generate payment link:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payment Links</h1>
          <p className="text-muted-foreground mt-2">
            Generate and send Razorpay payment links to your customers.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Payment Link
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-[#E8701A]" />
              Generate Payment Link
            </CardTitle>
            <CardDescription>Enter the customer details and the amount due.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Customer / Lead Name</label>
                <Input name="lead_name" value={formData.lead_name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Amount to Collect (₹)</label>
                <Input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="5000" className="bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Description / Memo (Optional)</label>
              <Input name="description" value={formData.description} onChange={handleChange} placeholder="Advance for modular kitchen design" className="bg-slate-50 dark:bg-slate-900" />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving || !formData.lead_name || !formData.amount} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Receipt className="mr-2 h-4 w-4" />}
                Generate Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <div 
            key={invoice.id} 
            className="group relative overflow-hidden rounded-2xl border border-white/20 p-6 shadow-xl backdrop-blur-md bg-white dark:bg-gradient-to-br dark:from-[#0a1c3a] dark:to-[#050f24] transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <Receipt className="h-4 w-4 mr-2 text-slate-400" />
                  INV-{invoice.id}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{invoice.lead_name}</p>
              </div>
              <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className={invoice.status === 'paid' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
                {invoice.status.toUpperCase()}
              </Badge>
            </div>

            <div className="my-6">
              <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                <IndianRupee className="h-6 w-6 mr-1" />
                {parseFloat(invoice.amount).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">Generated {new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-white/10 pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy(invoice.payment_link)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs"
              >
                {copiedLink === invoice.payment_link ? (
                  <><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> Copied</>
                ) : (
                  <><Copy className="mr-2 h-3 w-3" /> Copy Link</>
                )}
              </Button>
              <Button 
                size="sm"
                variant="secondary"
                disabled={invoice.status === 'paid'}
                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 text-xs"
              >
                <Send className="mr-2 h-3 w-3" /> Send SMS
              </Button>
            </div>
          </div>
        ))}

        {invoices.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Receipt className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No payment links generated</h3>
            <p className="mt-2 text-sm text-slate-500">Create a payment link to get paid by your customers instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
