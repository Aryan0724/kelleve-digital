"use client";

import { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Tag, Plus, Edit2, Play, Pause, Archive, Clock, Ticket } from "lucide-react";

export default function VendorOffersDashboard() {
  const [offers, setOffers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  
  // Analytics State
  const [stats, setStats] = useState({
    activeOffers: 0,
    totalClicks: 0,
    codesCopied: 0
  });

  // Form State
  const [formData, setFormData] = useState({
    listing_id: "",
    title: "",
    description: "",
    promo_code: "",
    status: "active",
    discount_type: "percentage",
    discount_value: "",
    cta_label: "Claim Offer",
    cta_url: "",
    valid_until: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // In a real scenario, we might have an endpoint to get the vendor's listings
    // For now, assume the user has listings available or we fetch them elsewhere.
    const res = await TrueDialAPI.getVendorOffers();
    if (res.success) {
      setOffers(res.data.data);
      const active = res.data.data.filter((o: any) => o.status === 'active').length;
      setStats({
        activeOffers: active,
        totalClicks: 124, // Mocked for now until analytics is built
        codesCopied: 45   // Mocked for now
      });
    }
    
    // Fetch listings for the dropdown (simplified for demo, usually an API call)
    const listingsRes = await TrueDialAPI.getListings({ user_id: 'me' }); 
    if (listingsRes.success && listingsRes.data) {
        setListings(listingsRes.data);
        if (listingsRes.data.length > 0) {
            setFormData(prev => ({ ...prev, listing_id: listingsRes.data[0].id.toString() }));
        }
    }
    setLoading(false);
  };

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setCurrentOffer(offer);
      setFormData({
        listing_id: offer.listing_id.toString(),
        title: offer.title,
        description: offer.description || "",
        promo_code: offer.promo_code || "",
        status: offer.status,
        discount_type: offer.discount_type || "percentage",
        discount_value: offer.discount_value?.toString() || "",
        cta_label: offer.cta_label || "Claim Offer",
        cta_url: offer.cta_url || "",
        valid_until: offer.valid_until ? new Date(offer.valid_until).toISOString().split('T')[0] : ""
      });
    } else {
      setCurrentOffer(null);
      setFormData({
        listing_id: listings.length > 0 ? listings[0].id.toString() : "",
        title: "",
        description: "",
        promo_code: "",
        status: "active",
        discount_type: "percentage",
        discount_value: "",
        cta_label: "Claim Offer",
        cta_url: "",
        valid_until: ""
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        ...formData,
        listing_id: parseInt(formData.listing_id),
        discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
    };

    if (currentOffer) {
        const res = await TrueDialAPI.updateOffer(currentOffer.id, payload);
        if (res.success) {
            setOffers(offers.map(o => o.id === currentOffer.id ? res.data : o));
            setModalOpen(false);
        } else {
            alert(res.message || "Error updating offer");
        }
    } else {
        const res = await TrueDialAPI.createOffer(payload);
        if (res.success) {
            setOffers([res.data, ...offers]);
            setModalOpen(false);
        } else {
            alert(res.message || "Error creating offer");
        }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await TrueDialAPI.updateOffer(id, { status: newStatus });
    if (res.success) {
        setOffers(offers.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'expired': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        case 'archived': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'; // draft
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Offers & Promotions</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create and manage deals to attract more customers.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Offer
          </button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Active Offers</div>
                <div className="text-4xl font-bold text-zinc-900 dark:text-white">{stats.activeOffers}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                <Ticket className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Offer Clicks</div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">{stats.totalClicks}</div>
            <div className="text-xs text-green-500 mt-1 font-medium">+12% this week</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Promo Codes Copied</div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">{stats.codesCopied}</div>
          </div>
        </div>

        {/* Offers List */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              <div className="p-12 text-center text-zinc-500">Loading offers...</div>
            ) : offers.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <Ticket className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No Offers Yet</h3>
                <p className="mt-1">Create your first offer to start attracting customers.</p>
              </div>
            ) : (
              offers.map(offer => (
                <div key={offer.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                    <Tag className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{offer.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(offer.status)}`}>
                            {offer.status}
                        </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-1 mb-2">{offer.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                        {offer.discount_type && offer.discount_value && (
                            <span className="font-medium text-zinc-900 dark:text-white">
                                {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                            </span>
                        )}
                        {offer.promo_code && (
                            <span className="flex items-center gap-1 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                                Code: {offer.promo_code}
                            </span>
                        )}
                        {offer.valid_until && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Valid until {new Date(offer.valid_until).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button onClick={() => handleOpenModal(offer)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Edit Offer">
                        <Edit2 className="w-5 h-5" />
                    </button>
                    {offer.status === 'active' ? (
                        <button onClick={() => handleStatusChange(offer.id, 'paused')} className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors" title="Pause Offer">
                            <Pause className="w-5 h-5" />
                        </button>
                    ) : offer.status === 'paused' || offer.status === 'draft' ? (
                        <button onClick={() => handleStatusChange(offer.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Activate Offer">
                            <Play className="w-5 h-5" />
                        </button>
                    ) : null}
                    <button onClick={() => handleStatusChange(offer.id, 'archived')} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Archive Offer">
                        <Archive className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Offer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold">{currentOffer ? "Edit Offer" : "Create New Offer"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="offerForm" onSubmit={handleSubmit} className="space-y-6">
                
                {listings.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Business Listing</label>
                    <select 
                      value={formData.listing_id}
                      onChange={e => setFormData({...formData, listing_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    >
                      {listings.map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Offer Title *</label>
                        <input 
                            type="text" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. 20% Off Spring Sale"
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Valid Until</label>
                        <input 
                            type="date" 
                            value={formData.valid_until}
                            onChange={e => setFormData({...formData, valid_until: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail the terms of your offer..."
                        className="w-full h-24 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Type</label>
                        <select 
                            value={formData.discount_type}
                            onChange={e => setFormData({...formData, discount_type: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed_amount">Fixed Amount (₹)</option>
                            <option value="free_item">Free Item</option>
                            <option value="bundle">Bundle</option>
                            <option value="cashback">Cashback</option>
                            <option value="coupon_code">Coupon Code</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Value</label>
                        <input 
                            type="number" 
                            value={formData.discount_value}
                            onChange={e => setFormData({...formData, discount_value: e.target.value})}
                            placeholder={formData.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Promo Code (Optional)</label>
                        <input 
                            type="text" 
                            value={formData.promo_code}
                            onChange={e => setFormData({...formData, promo_code: e.target.value})}
                            placeholder="e.g. SPRING20"
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                            maxLength={20}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">CTA Label</label>
                        <select 
                            value={formData.cta_label}
                            onChange={e => setFormData({...formData, cta_label: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Claim Offer">Claim Offer</option>
                            <option value="Book Now">Book Now</option>
                            <option value="Order Online">Order Online</option>
                            <option value="Visit Website">Visit Website</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">CTA URL (Optional)</label>
                        <input 
                            type="url" 
                            value={formData.cta_url}
                            onChange={e => setFormData({...formData, cta_url: e.target.value})}
                            placeholder="https://"
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="flex gap-4">
                        {['draft', 'active', 'paused'].map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    value={s}
                                    checked={formData.status === s}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="capitalize">{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 shrink-0 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-2xl">
              <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 font-medium text-zinc-600 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="offerForm" className="px-6 py-3 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                {currentOffer ? "Save Changes" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
