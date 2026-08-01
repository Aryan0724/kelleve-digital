"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Package, Wrench, Save, CheckCircle2, Image as ImageIcon, Tag, IndianRupee, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Product = { 
  id: number; 
  name: string; 
  category: string;
  description: string; 
  price: number | string; 
  image: string;
};

type Service = { 
  id: number; 
  name: string; 
  category: string;
  description: string; 
  price: number | string; 
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Luxury Modular Kitchen (Acrylic Finish)",
    category: "Kitchen & Wardrobe",
    description: "Waterproof marine plywood cabinetry with soft-close Hettich hinges, quartz countertop, and integrated chimney space.",
    price: "245000",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Teakwood Acoustic Wall Paneling",
    category: "Architectural Woodwork",
    description: "Bespoke fluted teakwood wall panels with sound-absorbing acoustic backing for living rooms and home theaters.",
    price: "45000",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Italian Marble Dining Table (6-Seater)",
    category: "Bespoke Furniture",
    description: "Imported Carrara white marble tabletop with brushed brass metallic pedestal base.",
    price: "120000",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop"
  }
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: "3D Architectural & Interior Conceptualization",
    category: "Consultation & Design",
    description: "Full photorealistic 3D renders, spatial planning, and electrical/plumbing layout drawings for apartments.",
    price: "75/sq.ft"
  },
  {
    id: 2,
    name: "Turnkey Commercial Office Interior Fit-Out",
    category: "Commercial Fit-Out",
    description: "End-to-end execution including HVAC, networking, modular workstations, and glass partition cabins.",
    price: "1800/sq.ft"
  }
];

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'products'|'services'>('products');
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal State for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Kitchen & Wardrobe",
    description: "",
    price: "",
    image: ""
  });

  // Modal State for Services
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    description: "",
    price: ""
  });

  const [masterCategories, setMasterCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    // Attempt API load or keep default
    const fetchCatalog = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/vendor/businesses/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.listing_products?.length > 0) {
            setProducts(data.data.listing_products.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category || "General",
              description: p.description || "",
              price: p.price || "",
              image: p.image || (p.media?.length > 0 ? p.media[0].file_name : "")
            })));
          }
        }
      } catch (err) {
        // Fallback silently to DEFAULT_PRODUCTS
      }
    };
    
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/public/categories`);
        if (res.ok) {
          const data = await res.json();
          const cats = data.data || data;
          if (Array.isArray(cats)) {
             setMasterCategories(cats);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCatalog();
    fetchCategories();
  }, []);

  // PRODUCT HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: masterCategories.length > 0 ? masterCategories[0].name : "",
      description: "",
      price: "",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: String(prod.price),
      image: prod.image
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
      setToastMessage("Product updated successfully!");
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      setProducts([{ id: newId, ...productForm }, ...products]);
      setToastMessage("New product added to catalog!");
    }
    setIsProductModalOpen(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    setToastMessage("Product removed from catalog");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // SERVICE HANDLERS
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      category: masterCategories.length > 0 ? masterCategories[0].name : "",
      description: "",
      price: ""
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name,
      category: srv.category,
      description: srv.description,
      price: String(srv.price)
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s));
      setToastMessage("Service updated successfully!");
    } else {
      const newId = Math.max(0, ...services.map(s => s.id)) + 1;
      setServices([{ id: newId, ...serviceForm }, ...services]);
      setToastMessage("New service added to catalog!");
    }
    setIsServiceModalOpen(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    setToastMessage("Service removed from catalog");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // PERSIST CATALOG TO BACKEND
  const handleSaveAllToBackend = async () => {
    setSaving(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || "";
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/vendor/businesses/me/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ products, services })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setToastMessage("Catalog changes saved to TrueDial network!");
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Products & Services Catalog</h1>
          <p className="text-muted-foreground text-sm">
            Showcase your products with images and transparent pricing to attract clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveAllToBackend} disabled={saving} variant="outline" className="flex items-center gap-2 font-semibold">
            {saving ? "Saving..." : "Save Catalog"}
            {!saving && <Save className="w-4 h-4" />}
          </Button>
          {activeTab === 'products' ? (
            <Button onClick={handleOpenAddProduct} className="flex items-center gap-2 font-semibold shadow-sm">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          ) : (
            <Button onClick={handleOpenAddService} className="flex items-center gap-2 font-semibold shadow-sm">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="w-4 h-4" /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === 'services'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wrench className="w-4 h-4" /> Services ({services.length})
        </button>
      </div>

      {/* PRODUCT GRID */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="premium-card rounded-xl overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition">
              <div>
                <div className="relative h-48 bg-muted overflow-hidden">
                  {prod.image ? (
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-10 h-10 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button 
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-2 bg-black/60 hover:bg-primary text-white rounded-lg backdrop-blur-sm transition"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 bg-black/60 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Badge className="absolute bottom-3 left-3 bg-navy/80 text-white backdrop-blur-sm border-white/20 text-xs">
                    {prod.category}
                  </Badge>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{prod.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary font-bold text-lg">
                    <span>₹</span>
                    <span>{Number(prod.price) ? Number(prod.price).toLocaleString() : prod.price}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-4 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenEditProduct(prod)} 
                  className="w-full text-xs font-semibold"
                >
                  Edit Product Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICE LIST */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="premium-card p-6 rounded-xl flex flex-col justify-between group hover:border-primary/40 transition">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 text-xs">
                      {srv.category}
                    </Badge>
                    <h3 className="font-bold text-lg text-foreground">{srv.name}</h3>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      onClick={() => handleOpenEditService(srv)}
                      className="p-2 bg-muted hover:bg-primary hover:text-white text-foreground rounded-lg transition"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-2 bg-muted hover:bg-red-600 hover:text-white text-foreground rounded-lg transition"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Starting from: </span>
                  <span className="font-bold text-primary text-base">₹{srv.price}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenEditService(srv)}
                  className="text-xs font-semibold"
                >
                  Edit Service
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCT DIALOG MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-lg text-foreground">
                {editingProduct ? "Edit Product Details" : "Add New Product"}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Product Title *
                </label>
                <Input 
                  placeholder="e.g. Italian Marble Dining Table"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    {masterCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {masterCategories.length === 0 && (
                      <option value="General">General</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Price (INR) *
                  </label>
                  <Input 
                    placeholder="e.g. 45000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Image URL (or Unsplash sample) *
                </label>
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  required
                />
                {productForm.image && (
                  <div className="mt-2 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Product Description *
                </label>
                <Textarea 
                  rows={3} 
                  placeholder="Describe material finish, warranty, dimensions..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  {editingProduct ? "Update Product" : "Add to Catalog"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE DIALOG MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-lg text-foreground">
                {editingService ? "Edit Service Details" : "Add New Service"}
              </h3>
              <button 
                onClick={() => setIsServiceModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveServiceForm} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Service Title *
                </label>
                <Input 
                  placeholder="e.g. Turnkey Office Interior Fit-Out"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Category *
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    {masterCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {masterCategories.length === 0 && (
                      <option value="General">General</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Starting Price *
                  </label>
                  <Input 
                    placeholder="e.g. 75/sq.ft or 15000"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Service Scope & Description *
                </label>
                <Textarea 
                  rows={3} 
                  placeholder="Describe scope of work, deliverables, and estimated timelines..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  {editingService ? "Update Service" : "Add Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
