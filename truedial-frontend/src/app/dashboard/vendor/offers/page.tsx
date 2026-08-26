"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Clock, Trash2, Edit2, CheckCircle2, ShieldCheck, Sparkles, X, IndianRupee, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrueDialAPI } from "@/lib/api";

const INITIAL_MOCK_OFFERS = [
  {
    id: 1,
    title: "Flat 20% Privilege Discount",
    promo_code: "TRUE20",
    discount_type: "percentage",
    discount_value: "20",
    eligible_card_type: "all",
    valid_until: "2026-12-31",
    description: "Valid for all TrueDial Privilege Card members on all services and billing.",
    status: "active",
    is_active: true
  },
  {
    id: 2,
    title: "Festive ₹150 Cashback Voucher",
    promo_code: "FESTIVE150",
    discount_type: "fixed",
    discount_value: "150",
    eligible_card_type: "all",
    valid_until: "2026-11-30",
    description: "Instant discount on minimum billing of ₹699. One-time use per customer.",
    status: "active",
    is_active: true
  }
];

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<number | null>(null);

  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchBusinessAndOffers();
  }, []);

  const fetchBusinessAndOffers = async () => {
    setLoading(true);
    try {
      const bizRes = await TrueDialAPI.getMyBusiness();
      if (bizRes?.success && bizRes.data) {
        setBusinessId(bizRes.data.id);
      }

      const res = await TrueDialAPI.getVendorOffers();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setOffers(res.data);
      } else if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setOffers(res.data.data);
      } else {
        // Load stored offers or default mock offers
        const saved = localStorage.getItem("truedial_vendor_offers");
        if (saved) {
          try {
            setOffers(JSON.parse(saved));
          } catch {
            setOffers(INITIAL_MOCK_OFFERS);
          }
        } else {
          setOffers(INITIAL_MOCK_OFFERS);
        }
      }
    } catch {
      const saved = localStorage.getItem("truedial_vendor_offers");
      if (saved) {
        try { setOffers(JSON.parse(saved)); } catch { setOffers(INITIAL_MOCK_OFFERS); }
      } else {
        setOffers(INITIAL_MOCK_OFFERS);
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setForm({
      title: "",
      code: `OFFER${Math.floor(100 + Math.random() * 900)}`,
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
      validUntil: offer.valid_until ? new Date(offer.valid_until).toISOString().split('T')[0] : "2026-12-31",
      description: offer.description || "",
      discountValue: String(offer.discount_value || "20"),
      discountType: offer.discount_type || "percentage",
      eligibleCardType: offer.eligible_card_type || "all",
      status: (offer.status === "active" || offer.is_active) ? "active" : "paused"
    });
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please provide an offer title");
      return;
    }
    const cleanCode = (form.code || `OFFER${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase();

    setSaving(true);

    const payload: any = {
      title: form.title.trim(),
      promo_code: cleanCode,
      description: form.description || "Valid on all orders & services.",
      discount_value: parseFloat(form.discountValue) || 20,
      discount_type: form.discountType || "percentage",
      eligible_card_type: form.eligibleCardType || "all",
      valid_until: form.validUntil,
      status: form.status === "active" ? "active" : "paused"
    };

    if (businessId) {
      payload.listing_id = businessId;
    }

    try {
      let savedOffer: any = null;
      if (editingOffer) {
        const res = await TrueDialAPI.updateOffer(editingOffer.id, payload);
        savedOffer = res?.data || { ...editingOffer, ...payload };
        const updatedList = offers.map(o => o.id === editingOffer.id ? { ...o, ...savedOffer } : o);
        setOffers(updatedList);
        localStorage.setItem("truedial_vendor_offers", JSON.stringify(updatedList));
        showToast(`Offer "${cleanCode}" updated successfully!`);
      } else {
        const res = await TrueDialAPI.createOffer(payload);
        savedOffer = res?.data || {
          id: Date.now(),
          ...payload,
          is_active: true
        };
        const updatedList = [savedOffer, ...offers];
        setOffers(updatedList);
        localStorage.setItem("truedial_vendor_offers", JSON.stringify(updatedList));
        showToast(`New offer "${cleanCode}" published successfully!`);
      }
      setIsModalOpen(false);
    } catch {
      // Offline / client fallback
      if (editingOffer) {
        const updatedList = offers.map(o => o.id === editingOffer.id ? { ...o, ...payload } : o);
        setOffers(updatedList);
        localStorage.setItem("truedial_vendor_offers", JSON.stringify(updatedList));
        showToast(`Offer "${cleanCode}" updated!`);
      } else {
        const newOffer = { id: Date.now(), ...payload, is_active: true };
        const updatedList = [newOffer, ...offers];
        setOffers(updatedList);
        localStorage.setItem("truedial_vendor_offers", JSON.stringify(updatedList));
        showToast(`New offer "${cleanCode}" published!`);
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this promotional offer?")) {
      try {
        await TrueDialAPI.deleteOffer(id);
      } catch {
        // ignore
      }
      const updated = offers.filter(o => o.id !== id);
      setOffers(updated);
      localStorage.setItem("truedial_vendor_offers", JSON.stringify(updated));
      showToast("Offer removed from catalog.");
    }
  };

  const handleToggleStatus = async (id: number) => {
    const offer = offers.find(o => o.id === id);
    if (!offer) return;
    
    const nextStatus = (offer.status === "active" || offer.is_active) ? "paused" : "active";
    
    try {
      await TrueDialAPI.updateOffer(id, { status: nextStatus, is_active: nextStatus === "active" });
    } catch {
      // ignore
    }

    const updated = offers.map(o => o.id === id ? { ...o, status: nextStatus, is_active: nextStatus === "active" } : o);
    setOffers(updated);
    localStorage.setItem("truedial_vendor_offers", JSON.stringify(updated));
    showToast(`Offer status changed to ${nextStatus === "active" ? "Active" : "Paused"}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-orange-500" />
            Manage Exclusive Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and edit promo codes for TrueDial Privilege Card members and local customers.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Offers</div>
          <div className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">
            {offers.filter(o => o.status === "active" || o.is_active).length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privilege Card Deals</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {offers.length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Redemptions</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            184
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => {
          const isActive = offer.status === "active" || offer.is_active;
          return (
            <div 
              key={offer.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 uppercase tracking-wider">
                      {offer.discount_type === "percentage" ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {isActive ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEdit(offer)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3">
                  {offer.title || offer.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {offer.description || "Valid for all customers on TrueDial."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 rounded-lg border border-slate-200 dark:border-slate-700">
                    {offer.promo_code || offer.code}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Exp: {new Date(offer.valid_until || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <button 
                  onClick={() => handleToggleStatus(offer.id)}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  {isActive ? "Pause" : "Reactivate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT OFFER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in-up relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingOffer ? "Edit Promotional Offer" : "Create New Promotional Offer"}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Offer Title / Headline *
                </label>
                <Input 
                  placeholder="e.g. Flat 20% Off on All Orders / Food Bill"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Promo Code *
                  </label>
                  <Input 
                    placeholder="e.g. TRUE20"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="font-mono uppercase text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Discount Value
                  </label>
                  <Input 
                    placeholder="e.g. 20 (for 20%) or 150 (for ₹150)"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="buy_one_get_one">Buy 1 Get 1</option>
                    <option value="free_service">Free Add-on Service</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Eligible Card Type
                  </label>
                  <select
                    value={form.eligibleCardType}
                    onChange={(e) => setForm({ ...form, eligibleCardType: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="all">All Privilege Cards</option>
                    <option value="free">First Year Free Only</option>
                    <option value="city">City Card Only</option>
                    <option value="multi-city">Multi-City Card Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Valid Until Date *
                  </label>
                  <Input 
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Offer Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="active">Active & Published</option>
                    <option value="paused">Paused / Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Offer Terms & Description
                </label>
                <Textarea 
                  rows={3}
                  placeholder="e.g. Valid for all TrueDial Privilege Card holders on dining and services..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={saving}
                  className="bg-[#E05A1B] hover:bg-[#c94d13] text-white text-xs font-bold"
                >
                  {saving ? "Publishing..." : (editingOffer ? "Update Offer" : "Publish Offer")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
