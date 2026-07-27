"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Tag, Plus, Trash2, IndianRupee, Image as ImageIcon } from "lucide-react";

export default function CatalogPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "product",
    image_url: ""
  });

  useEffect(() => {
    // In a real app, this would fetch the user's specific business and extract the products array.
    // For MVP, we mock the initial load.
    setItems([
      { id: 1, name: "Premium Leather Sofa Set", description: "3+1+1 genuine leather sofa in dark brown.", price: 45000, type: "product", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop" },
      { id: 2, name: "Modular Kitchen Consultation", description: "Initial site visit, measurement and 3D design.", price: 2500, type: "service", image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300&auto=format&fit=crop" }
    ]);
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const newItem = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price) || 0
      };

      const newItems = [...items, newItem];
      
      // Update via API
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/businesses/me/products`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ products: newItems }),
        }
      );
      
      setItems(newItems);
      setIsCreating(false);
      setFormData({ name: "", description: "", price: "", type: "product", image_url: "" });
    } catch (error) {
      console.error("Failed to update catalog:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const newItems = items.filter(i => i.id !== id);
      
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/businesses/me/products`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ products: newItems }),
        }
      );
      
      setItems(newItems);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Showcase your products and services on your public profile.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
              <Package className="mr-2 h-5 w-5 text-[#E8701A]" />
              New Catalog Item
            </CardTitle>
            <CardDescription>Add a new product or service offering.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Item Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Italian Marble Flooring" className="bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="product">Physical Product</option>
                  <option value="service">Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Price (₹)</label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Image URL</label>
                <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Description</label>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="min-h-[100px] bg-slate-50 dark:bg-slate-900" 
                placeholder="Describe the item..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Save Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group relative overflow-hidden rounded-2xl border border-white/20 p-4 shadow-xl backdrop-blur-md bg-white dark:bg-[#0a1c3a]/70 transition-all duration-300 hover:shadow-2xl flex flex-col"
          >
            <div className="h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
              {item.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              )}
              <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white border-0 capitalize">
                {item.type}
              </Badge>
            </div>
            
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-grow">{item.description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center text-lg font-bold text-slate-900 dark:text-white">
                <IndianRupee className="h-4 w-4 mr-1 text-[#E8701A]" />
                {item.price.toLocaleString('en-IN')}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {items.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Tag className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No items in your catalog</h3>
            <p className="mt-2 text-sm text-slate-500">Add products or services to attract more customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
