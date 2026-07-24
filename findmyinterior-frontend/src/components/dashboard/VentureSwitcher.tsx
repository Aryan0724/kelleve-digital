"use client";

import { useEffect, useState } from "react";
import { Building2, ChevronDown, Plus, X, MapPin, CheckCircle2, Loader2, Search } from "lucide-react";
import api from "@/lib/api";

// Professional types taxonomy for venture creation
const VENTURE_TYPES = [
  { icon: "🏠", label: "Interior & Design", types: ["Interior Designer", "Interior Design Company", "Modular Kitchen Designer", "Wardrobe Designer", "2D/3D Designer", "Space Planner"] },
  { icon: "📐", label: "Architecture & Engineering", types: ["Architect", "Structural Engineer", "Civil Engineer", "MEP Consultant", "Landscape Designer", "Vastu Consultant"] },
  { icon: "👷", label: "Contractors", types: ["Interior Contractor", "Civil Contractor", "Turnkey Contractor", "Renovation Contractor", "Demolition Contractor"] },
  { icon: "🛠", label: "Skilled Workforce", types: ["Carpenter", "Electrician", "Plumber", "Painter", "POP / False Ceiling Worker", "Tile & Marble Fitter", "Granite Installer", "Fabricator", "Glass Installer", "Welder", "Polish Worker", "Wallpaper Installer"] },
  { icon: "🧱", label: "Material Suppliers", types: ["Plywood Dealer", "Laminate Dealer", "Tile Dealer", "Marble & Granite Dealer", "Paint Dealer", "Hardware Supplier", "Lighting Supplier", "Electrical Supplier", "Furniture Supplier", "Door & Window Supplier"] },
  { icon: "🏗", label: "Builders & Developers", types: ["Builder", "Real Estate Developer", "Apartment Project", "Commercial Project", "Villa Project"] },
  { icon: "🏡", label: "Home Improvement", types: ["Home Renovation", "Waterproofing", "Pest Control", "Deep Cleaning", "CCTV & Security", "Home Automation", "Solar Installation", "AC Installation"] },
  { icon: "🚚", label: "Support Services", types: ["Packers & Movers", "Interior Material Transport", "Equipment Rental", "Interior Project Consultant"] },
];

const typeToSlug = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

interface Venture {
  id: number;
  name: string;
  professional_type: string;
  city: string;
  status: string;
}

function AddVentureModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: "", typeSlug: "", city: "", gst_number: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedTypeLabel, setSelectedTypeLabel] = useState("");

  const filteredTypes = VENTURE_TYPES.map(cat => ({
    ...cat,
    types: cat.types.filter(t => !typeSearch || t.toLowerCase().includes(typeSearch.toLowerCase()))
  })).filter(cat => cat.types.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.typeSlug) { setError("Please select a venture type."); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/user/ventures", {
        name: form.name,
        professional_type: form.typeSlug,
        city: form.city,
        gst_number: form.gst_number || undefined,
        phone: form.phone || undefined,
      });
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create venture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Add New Venture</h3>
            <p className="text-white/70 text-xs mt-0.5">Create a new company profile under your account</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Venture / Company Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Kleve World"
              className="mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Type of Business *</label>
            <div className="relative mt-1">
              <button type="button" onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none hover:border-orange-400 transition">
                <span className={selectedTypeLabel ? "" : "text-slate-400"}>{selectedTypeLabel || "Select business type..."}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-slate-900 p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input autoFocus value={typeSearch} onChange={e => setTypeSearch(e.target.value)}
                        placeholder="Search..." className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-orange-400" />
                    </div>
                  </div>
                  {filteredTypes.map(cat => (
                    <div key={cat.label}>
                      <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">{cat.icon} {cat.label}</div>
                      {cat.types.map(type => (
                        <button key={type} type="button"
                          onClick={() => { setSelectedTypeLabel(type); setForm({ ...form, typeSlug: typeToSlug(type) }); setShowTypeDropdown(false); setTypeSearch(""); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 transition">
                          {type}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">City *</label>
            <div className="mt-1 flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus-within:border-orange-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Patna"
                className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">GST Number</label>
              <input value={form.gst_number} onChange={e => setForm({ ...form, gst_number: e.target.value })}
                placeholder="Optional"
                className="mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Optional"
                className="mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-orange-400" />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8701A] hover:bg-[#c25a12] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Venture</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VentureSwitcher() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeVenture, setActiveVenture] = useState<Venture | null>(null);

  const fetchVentures = async () => {
    try {
      const res = await api.get("/user/ventures");
      setVentures(res.data.data || []);
      if (res.data.data?.length > 0 && !activeVenture) {
        setActiveVenture(res.data.data[0]);
      }
    } catch {
      // user might not have ventures yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVentures(); }, []);

  if (loading) return null;

  return (
    <>
      <div className="relative">
        {/* Switcher trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-400 transition text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          <Building2 className="w-4 h-4 text-orange-500" />
          <span className="max-w-[120px] truncate">{activeVenture?.name || "My Venture"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">Your Ventures</p>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {ventures.length === 0 ? (
                <p className="text-xs text-slate-500 px-4 py-3 text-center">No ventures yet. Add one below!</p>
              ) : (
                ventures.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setActiveVenture(v); setOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition flex items-center gap-2 ${
                      activeVenture?.id === v.id
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {activeVenture?.id === v.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{v.name}</p>
                      <p className="text-xs text-slate-400 truncate">{v.professional_type?.replace(/_/g, " ")} • {v.city}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setShowAddModal(true); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition font-medium"
              >
                <Plus className="w-4 h-4" /> Add New Venture
              </button>
              <p className="text-xs text-slate-400 px-3 mt-1">Multiple companies under one login</p>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddVentureModal
          onClose={() => setShowAddModal(false)}
          onAdded={fetchVentures}
        />
      )}
    </>
  );
}
