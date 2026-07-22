"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Package, Wrench, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Product = { id?: number; name: string; description: string; price: number | ''; image: string };
type Service = { id?: number; name: string; description: string; price: number | '' };

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'products'|'services'>('products');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
        const res = await fetch(`${API_BASE}/truedial/vendor/businesses/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          // Map relational array to the expected shape
          const mappedProducts = (data.data.listing_products || []).map((p: any) => ({
             id: p.id,
             name: p.name,
             description: p.description || '',
             price: p.price || '',
             image: p.media?.length > 0 ? p.media[0].file_name : ''
          }));
          setProducts(mappedProducts);

          const mappedServices = (data.data.listing_services || []).map((s: any) => ({
             id: s.id,
             name: s.name,
             description: s.description || '',
             price: s.price_starting_at || s.price || ''
          }));
          setServices(mappedServices);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleSaveProducts = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
      const res = await fetch(`${API_BASE}/truedial/vendor/businesses/me/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ products })
      });
      if (res.ok) {
        setSuccessMsg("Products saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
      const res = await fetch(`${API_BASE}/truedial/vendor/businesses/me/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ services })
      });
      if (res.ok) {
        setSuccessMsg("Services saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => setProducts([...products, { name: '', description: '', price: '', image: '' }]);
  const updateProduct = (idx: number, field: keyof Product, value: any) => {
    const updated = [...products];
    updated[idx] = { ...updated[idx], [field]: value };
    setProducts(updated);
  };
  const removeProduct = (idx: number) => setProducts(products.filter((_, i) => i !== idx));

  const addService = () => setServices([...services, { name: '', description: '', price: '' }]);
  const updateService = (idx: number, field: keyof Service, value: any) => {
    const updated = [...services];
    updated[idx] = { ...updated[idx], [field]: value };
    setServices(updated);
  };
  const removeService = (idx: number) => setServices(services.filter((_, i) => i !== idx));

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24 h-full overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Products & Services</h1>
          <p className="text-muted-foreground">Manage your catalog to attract more customers.</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-medium text-sm border border-green-200">
            <CheckCircle className="w-4 h-4" /> {successMsg}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-navy'}`}
        >
          <Package className="w-5 h-5" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('services')} 
          className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-navy'}`}
        >
          <Wrench className="w-5 h-5" /> Services
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border border-dashed rounded-xl backdrop-blur-md">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You have not added any products yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {products.map((p, i) => (
                <div key={i} className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition relative flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 space-y-4">
                    <div className="aspect-square bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center relative">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-10 h-10 text-gray-300" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center p-4">
                        <label className="text-xs text-white mb-2 text-center font-medium">Image URL</label>
                        <Input 
                          value={p.image} 
                          onChange={(e) => updateProduct(i, 'image', e.target.value)} 
                          placeholder="https://..." 
                          className="bg-white text-black h-8 text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <Input 
                        value={p.name} 
                        onChange={(e) => updateProduct(i, 'name', e.target.value)} 
                        placeholder="Product Name" 
                        className="font-bold text-lg h-12" 
                      />
                      <button onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground font-medium">₹</span>
                      <Input 
                        type="number" 
                        value={p.price} 
                        onChange={(e) => updateProduct(i, 'price', e.target.value)} 
                        placeholder="Price" 
                        className="pl-9 h-12 font-medium" 
                      />
                    </div>
                    <Textarea 
                      value={p.description} 
                      onChange={(e) => updateProduct(i, 'description', e.target.value)} 
                      placeholder="Product Description..." 
                      className="resize-none h-24" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={addProduct} className="gap-2 h-12 rounded-xl">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
            <Button onClick={handleSaveProducts} disabled={saving} className="gap-2 h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Products'}
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          {services.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border border-dashed rounded-xl backdrop-blur-md">
              <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You have not added any services yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {services.map((s, i) => (
                <div key={i} className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        value={s.name} 
                        onChange={(e) => updateService(i, 'name', e.target.value)} 
                        placeholder="Service Name" 
                        className="font-bold h-12" 
                      />
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-muted-foreground font-medium">₹</span>
                        <Input 
                          type="number" 
                          value={s.price} 
                          onChange={(e) => updateService(i, 'price', e.target.value)} 
                          placeholder="Starting Price (Optional)" 
                          className="pl-9 h-12 font-medium" 
                        />
                      </div>
                    </div>
                    <button onClick={() => removeService(i)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <Textarea 
                    value={s.description} 
                    onChange={(e) => updateService(i, 'description', e.target.value)} 
                    placeholder="Service Description..." 
                    className="resize-none h-20" 
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={addService} className="gap-2 h-12 rounded-xl">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
            <Button onClick={handleSaveServices} disabled={saving} className="gap-2 h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Services'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
