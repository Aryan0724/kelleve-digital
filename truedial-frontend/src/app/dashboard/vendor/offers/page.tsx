"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Clock, Trash2, Edit2, CheckCircle2, ShieldCheck, Sparkles, X, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { TrueDialAPI } from "@/lib/api";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [businessId, setBusinessId] = useState<number | null>(null);

  useEffect(() => {
    fetchBusinessId();
    fetchOffers();
  }, []);

  const fetchBusinessId = async () => {
    const res = await TrueDialAPI.getMyBusiness();
    if (res.success && res.data) {
      setBusinessId(res.data.id);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    const res = await TrueDialAPI.getVendorOffers();
    if (res.success) {
      setOffers(res.data?.data || res.data || []);
    }
    setLoading(false);
  };

  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    code: "",
    validUntil: "2026-12-31",
    description: "",
    discountValue: "20",
    discountType: "percentage",
    eligibleCardType: "all",
    status: "active"
  });

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setForm({
      title: "",
      code: "",
      validUntil: "2026-12-31",
      description: "",
      discountValue: "20",
      discountType: "percentage",
      eligibleCardType: "all",
      status: "active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: any) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title || offer.name || "",
      code: offer.promo_code || offer.code || "",
      validUntil: offer.valid_until ? new Date(offer.valid_until).toISOString().split('T')[0] : offer.validUntil || "2026-12-31",
      description: offer.description || "",
      discountValue: offer.discount_value || offer.discountValue || "20",
      discountType: offer.discount_type || offer.discountType || "percentage",
      eligibleCardType: offer.eligible_card_type || offer.eligibleCardType || "all",
      status: offer.status || (offer.is_active ? "active" : "expired")
    });
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.code.trim()) return;
    if (!businessId && !editingOffer) {
      alert("Business profile not found. Please complete your profile first.");
      return;
    }

    const payload: any = {
      title: form.title,
      promo_code: form.code,
      description: form.description,
      discount_value: form.discountValue,
      discount_type: form.discountType,
      eligible_card_type: form.eligibleCardType,
      valid_until: form.validUntil,
      status: form.status === "Active" ? "active" : "paused"
    };

    let res;
    if (editingOffer) {
      res = await TrueDialAPI.updateOffer(editingOffer.id, payload);
    } else {
      payload.listing_id = businessId;
      res = await TrueDialAPI.createOffer(payload);
    }

    if (res?.success) {
      setToastMessage(editingOffer ? `Offer "${form.code}" updated!` : `New offer "${form.code}" published!`);
      fetchOffers();
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(""), 3500);
    } else {
      alert(res?.message || "Failed to save offer");
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      const res = await TrueDialAPI.deleteOffer(id);
      if (res.success) {
        setOffers(offers.filter(o => o.id !== id));
        setToastMessage("Offer removed from catalog.");
        setTimeout(() => setToastMessage(""), 3000);
      } else {
        alert(res.message || "Failed to delete offer");
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    const offer = offers.find(o => o.id === id);
    if (!offer) return;
    
    const nextStatus = (offer.status || (offer.is_active ? "Active" : "Expired")) === "Active" ? "Expired" : "Active";
    
    const res = await TrueDialAPI.updateOffer(id, { is_active: nextStatus === "Active" });
    if (res.success) {
      setOffers(offers.map(o => o.id === id ? { ...o, status: nextStatus, is_active: nextStatus === "Active" } : o));
      setToastMessage(`Offer #${id} status changed to ${nextStatus}`);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
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
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Manage Exclusive Offers</h1>
          <p className="text-muted-foreground text-sm">
            Create and edit promo codes for TrueDial Privilege Card VIP members to boost conversions.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="flex items-center gap-2 font-semibold shadow-sm">
          <Plus className="w-4 h-4" /> Create New Offer
        </Button>
      </div>

      {/* OFFERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const status = offer.status || (offer.is_active ? "Active" : "Expired");
          const title = offer.title || offer.name || "";
          const discountValue = offer.discountValue || offer.discount_value || "";
          const validUntil = offer.validUntil || offer.valid_until || "";
          
          return (
          <div 
            key={offer.id} 
            className={`premium-card rounded-xl p-6 flex flex-col justify-between transition hover:border-primary/40 ${
              status === "Expired" ? "opacity-75 bg-muted/30" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <Badge className={`text-xs font-bold ${
                  status === "Active" 
                    ? "bg-green-500/10 text-green-600 border-green-500/30" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {status}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleOpenEdit(offer)}
                    className="p-2 bg-muted hover:bg-primary hover:text-white text-foreground rounded-lg transition"
                    title="Edit Offer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="p-2 bg-muted hover:bg-red-600 hover:text-white text-foreground rounded-lg transition"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {discountValue}
                </span>
                <h3 className="font-bold text-lg text-foreground mt-2 line-clamp-2">{title}</h3>
              </div>

              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono bg-muted px-2.5 py-1 rounded-md font-bold text-foreground tracking-wider border border-border">
                  {offer.code}
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Valid till {validUntil}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Redeemed: <strong className="text-foreground">{offer.uses || 0} times</strong>
                </span>
                <button 
                  onClick={() => handleToggleStatus(offer.id)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {status === "Active" ? "Pause Offer" : "Reactivate Offer"}
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* EDIT / CREATE OFFER DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">
                  {editingOffer ? `Edit Offer: ${editingOffer.code}` : "Create New Promotional Offer"}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Offer Title / Headline *
                </label>
                <Input 
                  placeholder="e.g. Flat 25% Off on Modular Kitchen Cabinets"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Promo Code *
                  </label>
                  <Input 
                    placeholder="e.g. VIP25"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Discount Value Label
                  </label>
                  <Input 
                    placeholder="e.g. 25% OFF or ₹15,000 OFF"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="buy_one_get_one">Buy 1 Get 1</option>
                    <option value="free_service">Free Add-on Service</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Eligible Card Type
                  </label>
                  <select
                    value={form.eligibleCardType}
                    onChange={(e) => setForm({ ...form, eligibleCardType: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Privilege Cards</option>
                    <option value="free">First Year Free Only</option>
                    <option value="city">City Card Only</option>
                    <option value="multi-city">Multi-City Card Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Valid Until Date *
                  </label>
                  <Input 
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Offer Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Active">Active & Published</option>
                    <option value="Expired">Paused / Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Offer Terms & Description
                </label>
                <Textarea 
                  rows={3}
                  placeholder="e.g. Valid for all TrueDial Privilege Card holders..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  {editingOffer ? "Update Offer" : "Publish Offer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
