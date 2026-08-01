"use client";

import { useState } from "react";
import { Tag, Plus, Clock, Trash2, Edit2, CheckCircle2, ShieldCheck, Sparkles, X, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OffersPage() {
  const [offers, setOffers] = useState([
    { 
      id: 1, 
      title: "Flat 25% Off on Modular Kitchen Cabinets", 
      code: "VIP25", 
      validUntil: "2026-12-31", 
      uses: 45, 
      description: "Valid for all TrueDial Privilege Card members on minimum billing of ₹2 Lakhs.",
      discountValue: "25% OFF",
      status: "Active"
    },
    { 
      id: 2, 
      title: "Free Acoustic Inspection & Estimate", 
      code: "FREEACOUSTIC", 
      validUntil: "2026-11-30", 
      uses: 19, 
      description: "Complimentary sound test and woodwork consultation for residential properties.",
      discountValue: "FREE VISIT",
      status: "Active"
    },
    { 
      id: 3, 
      title: "Flat ₹15,000 Off on Architectural Consulting", 
      code: "ARCH15K", 
      validUntil: "2026-10-15", 
      uses: 12, 
      description: "Special seasonal discount for first-time clients booking full home interiors.",
      discountValue: "₹15,000 OFF",
      status: "Expired"
    }
  ]);

  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    code: "",
    validUntil: "2026-12-31",
    description: "",
    discountValue: "20% OFF",
    status: "Active"
  });

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setForm({
      title: "",
      code: "",
      validUntil: "2026-12-31",
      description: "",
      discountValue: "20% OFF",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: any) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      code: offer.code,
      validUntil: offer.validUntil,
      description: offer.description || "",
      discountValue: offer.discountValue || "20% OFF",
      status: offer.status || "Active"
    });
    setIsModalOpen(true);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.code.trim()) return;

    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...form } : o));
      setToastMessage(`Offer "${form.code}" updated successfully!`);
    } else {
      const newId = Math.max(0, ...offers.map(o => o.id)) + 1;
      setOffers([{ id: newId, ...form, uses: 0 }, ...offers]);
      setToastMessage(`New offer "${form.code}" created & published!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteOffer = (id: number) => {
    setOffers(offers.filter(o => o.id !== id));
    setToastMessage("Offer removed from catalog.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleToggleStatus = (id: number) => {
    setOffers(offers.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === "Active" ? "Expired" : "Active";
        setToastMessage(`Offer #${id} status changed to ${nextStatus}`);
        return { ...o, status: nextStatus };
      }
      return o;
    }));
    setTimeout(() => setToastMessage(""), 3000);
  };

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
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className={`premium-card rounded-xl p-6 flex flex-col justify-between transition hover:border-primary/40 ${
              offer.status === "Expired" ? "opacity-75 bg-muted/30" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <Badge className={`text-xs font-bold ${
                  offer.status === "Active" 
                    ? "bg-green-500/10 text-green-600 border-green-500/30" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {offer.status}
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
                  {offer.discountValue}
                </span>
                <h3 className="font-bold text-lg text-foreground mt-2 line-clamp-2">{offer.title}</h3>
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
                  <Clock className="w-3.5 h-3.5" /> Valid till {offer.validUntil}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Redeemed: <strong className="text-foreground">{offer.uses} times</strong>
                </span>
                <button 
                  onClick={() => handleToggleStatus(offer.id)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {offer.status === "Active" ? "Pause Offer" : "Reactivate Offer"}
                </button>
              </div>
            </div>
          </div>
        ))}
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
