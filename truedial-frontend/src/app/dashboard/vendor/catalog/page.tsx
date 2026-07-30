"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Plus, Trash2, IndianRupee, Image as ImageIcon,
  Stethoscope, Utensils, Wrench, Briefcase, Tag, CheckCircle,
  XCircle, Clock, ShieldCheck, Flame, Leaf, Eye, Award, Layers
} from "lucide-react";

// ─── 1. Medical Treatments & Services Catalog ──────────────────────────────────
function MedicalCatalogView({ items, onAdd, onDelete, loading }: any) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Consultation");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30 mins");
  const [insurance, setInsurance] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      category,
      price: Number(price) || 500,
      description: `${category} • Duration: ${duration} • ${insurance ? "Insurance Accepted" : "Direct Pay"}`,
      type: "service",
    });
    setName("");
    setPrice("");
  };

  const categories = ["Consultation", "Dental", "Diagnostics & Labs", "Minor Procedure", "Health Checkup Package"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-primary" /> Clinic Services & Treatments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your consultation fees, diagnostic tests, and treatment packages visible to patients.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add New Treatment / Service</CardTitle>
          <CardDescription>Publish transparent consultation fees to build patient trust.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="e.g. Initial Cardiology Consultation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Input
                placeholder="Fee (₹)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div>
              <Button type="submit" disabled={loading} className="w-full h-10 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold">
                <Plus className="w-4 h-4 mr-1" /> Add Service
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-foreground">No clinic services listed yet</h3>
            <p className="text-sm text-muted-foreground">Add your first consultation fee or treatment package above.</p>
          </div>
        ) : (
          items.map((item: any, idx: number) => (
            <div key={idx} className="p-4 border border-border rounded-xl bg-card hover:border-primary/50 transition flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground">{item.name}</h4>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{item.category || "Service"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-3 pt-1 text-sm font-bold text-foreground">
                  <span className="flex items-center text-[#E8701A]"><IndianRupee className="w-3.5 h-3.5" />{item.price || "500"}</span>
                  <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 30 mins
                  </span>
                  <span className="text-xs font-normal text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Insurance Eligible
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(idx)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 2. Restaurant Digital Menu Manager ────────────────────────────────────────
function RestaurantMenuView({ items, onAdd, onDelete, loading }: any) {
  const [dishName, setDishName] = useState("");
  const [course, setCourse] = useState("Starters");
  const [diet, setDiet] = useState("Veg");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [inStockMap, setInStockMap] = useState<Record<number, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    onAdd({
      name: dishName,
      category: course,
      price: Number(price) || 250,
      description: `[${diet}] ${desc || "Chef special preparation"}`,
      type: "product",
    });
    setDishName("");
    setPrice("");
    setDesc("");
  };

  const toggleStock = (idx: number) => {
    setInStockMap((prev) => ({ ...prev, [idx]: prev[idx] === false ? true : false }));
  };

  const courses = ["Starters", "Main Course", "Breads & Rice", "Desserts", "Beverages", "Chef's Special"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Utensils className="w-7 h-7 text-[#E8701A]" /> Digital Menu Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update dishes, pricing, dietary tags (Veg / Non-Veg / Vegan), and mark items Sold Out in real time.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add Dish to Menu</CardTitle>
          <CardDescription>Diners viewing your TrueDial profile can explore your full menu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Dish Name (e.g. Paneer Tikka Masala)"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="Veg">🟢 Veg</option>
                  <option value="Non-Veg">🔴 Non-Veg</option>
                  <option value="Vegan">🌱 Vegan</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <Input
                  placeholder="Short appetizing description (optional)"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="₹ Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="h-10"
                />
                <Button type="submit" disabled={loading} className="h-10 px-5 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-foreground">Your digital menu is empty</h3>
            <p className="text-sm text-muted-foreground">Add your popular dishes and beverages above.</p>
          </div>
        ) : (
          items.map((item: any, idx: number) => {
            const isSoldOut = inStockMap[idx] === false;
            return (
              <div key={idx} className={`p-4 border rounded-xl transition flex items-start justify-between gap-4 ${isSoldOut ? "bg-muted/40 border-border opacity-70" : "bg-card border-border hover:border-primary/50"}`}>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.description?.includes("[Non-Veg]") ? "🔴" : "🟢"}</span>
                    <h4 className="font-bold text-foreground">{item.name}</h4>
                    <Badge variant="outline" className="text-xs">{item.category || "Course"}</Badge>
                    {isSoldOut && <Badge className="bg-red-500 text-white">Sold Out</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-foreground flex items-center text-[#E8701A]">
                      <IndianRupee className="w-3.5 h-3.5" />{item.price || "250"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStock(idx)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${isSoldOut ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"}`}
                    >
                      {isSoldOut ? "Mark Available" : "Mark Sold Out"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(idx)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── 3. Real Estate Project Portfolio Manager ──────────────────────────────────
function RealEstatePortfolioView({ items, onAdd, onDelete, loading }: any) {
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState("Full Home Interior");
  const [budgetRange, setBudgetRange] = useState("₹15L – ₹25L");
  const [areaSqFt, setAreaSqFt] = useState("1200");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      name: title,
      category: projectType,
      price: 0,
      description: `Budget: ${budgetRange} • Area: ${areaSqFt} sq. ft.`,
      image: imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      type: "product",
    });
    setTitle("");
    setImageUrl("");
  };

  const types = ["Full Home Interior", "Modular Kitchen", "Living Room & Lounge", "Office & Commercial", "Architectural Villa", "Renovation"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" /> Project Portfolio Showcase
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Display your finest finished interiors, 3D architectural renders, and client projects with budget indicators.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add Project Case Study</CardTitle>
          <CardDescription>High-budget clients look at completed portfolios before requesting quotes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Input
                  placeholder="Project Name (e.g. 4BHK Penthouse, Worli)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  placeholder="Budget Range (e.g. ₹20L – ₹35L)"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <Input
                  placeholder="Area in sq. ft. (e.g. 1500)"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder="Photo URL (Unsplash or hosted image)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Button type="submit" disabled={loading} className="w-full h-10 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold">
                  <Plus className="w-4 h-4 mr-1" /> Add Project
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-foreground">No portfolio projects published yet</h3>
            <p className="text-sm text-muted-foreground">Upload your completed design projects and 3D renders above.</p>
          </div>
        ) : (
          items.map((item: any, idx: number) => (
            <div key={idx} className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/50 transition flex flex-col justify-between group">
              <div className="h-44 bg-muted relative overflow-hidden">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/70 text-white backdrop-blur-md border border-white/20">
                    {item.category || "Interior"}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-base">{item.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs font-bold text-[#E8701A] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Featured Case Study
                  </span>
                  <button
                    onClick={() => onDelete(idx)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 4. Home Services Rate Card Manager ────────────────────────────────────────
function ServiceRateCardView({ items, onAdd, onDelete, loading }: any) {
  const [serviceName, setServiceName] = useState("");
  const [priceType, setPriceType] = useState("Fixed Price");
  const [amount, setAmount] = useState("");
  const [warranty, setWarranty] = useState("30-Day Warranty");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;
    onAdd({
      name: serviceName,
      category: priceType,
      price: Number(amount) || 499,
      description: `Pricing: ${priceType} • Includes ${warranty}`,
      type: "service",
    });
    setServiceName("");
    setAmount("");
  };

  const types = ["Fixed Price", "Starting At", "Inspection Fee", "Per Hour Rate"];
  const warranties = ["30-Day Warranty", "90-Day Warranty", "6-Month Guarantee", "1-Year Warranty", "Standard Service"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-7 h-7 text-[#E8701A]" /> Transparent Service Rate Card
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publish clear pricing for repairs, servicing, and installations to win trust and reduce bargain calls.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add Service & Rate</CardTitle>
          <CardDescription>Customers prefer booking professionals with transparent rate cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="e.g. Split AC Jet Service & Wash"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Input
                placeholder="Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div>
              <Button type="submit" disabled={loading} className="w-full h-10 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold">
                <Plus className="w-4 h-4 mr-1" /> Add Rate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-foreground">No service rates published yet</h3>
            <p className="text-sm text-muted-foreground">Add your standard service rates and warranty badges above.</p>
          </div>
        ) : (
          items.map((item: any, idx: number) => (
            <div key={idx} className="p-4 border border-border rounded-xl bg-card hover:border-primary/50 transition flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground">{item.name}</h4>
                  <Badge variant="outline" className="text-xs">{item.category || "Rate"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-3 pt-1 text-sm font-bold text-foreground">
                  <span className="flex items-center text-[#E8701A]"><IndianRupee className="w-3.5 h-3.5" />{item.price || "499"}</span>
                  <span className="text-xs font-normal text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Service Guarantee
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(idx)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 5. Generic Catalog View ───────────────────────────────────────────────────
function GenericCatalogView({ items, onAdd, onDelete, loading }: any) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      description: desc,
      price: Number(price) || 0,
      type: "product",
    });
    setName("");
    setDesc("");
    setPrice("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products & Services Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showcase what your business offers to visitors on TrueDial.
        </p>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add Item to Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <Input placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Input placeholder="Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <Button type="submit" disabled={loading} className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="p-4 border border-border rounded-xl bg-card flex items-start justify-between">
            <div>
              <h4 className="font-bold text-foreground">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              {item.price > 0 && <span className="font-bold text-sm text-[#E8701A] mt-1 block">₹{item.price}</span>}
            </div>
            <button onClick={() => onDelete(idx)} className="p-2 text-muted-foreground hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Catalog Page Router ──────────────────────────────────────────────────
export default function CatalogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        const products = res.data.listing_products?.map((p: any) => ({ ...p, type: "product" })) || [];
        const services = res.data.listing_services?.map((s: any) => ({ ...s, type: "service" })) || [];
        setItems([...products, ...services]);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  const handleAdd = async (itemData: any) => {
    setItems((prev) => [itemData, ...prev]);
    // Optionally call TrueDialAPI.addProduct / addService in background
  };

  const handleDelete = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  const roles: string[] = rawRoles.map((r: any) => (typeof r === "string" ? r : r?.slug || r?.name || ""));

  const isMedical = roles.some((r) => ["doctor", "hospital", "clinic", "dentist"].includes(r));
  const isRestaurant = roles.some((r) => ["restaurant", "cafe", "bakery", "food"].includes(r));
  const isService = roles.some((r) => ["worker", "skilled_worker", "plumber", "electrician", "mechanic", "cleaner"].includes(r));
  const isRealEstate = roles.some((r) => ["builder", "architect", "interior_designer", "contractor", "supplier", "material_supplier"].includes(r));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isMedical) return <MedicalCatalogView items={items} onAdd={handleAdd} onDelete={handleDelete} loading={loading} />;
  if (isRestaurant) return <RestaurantMenuView items={items} onAdd={handleAdd} onDelete={handleDelete} loading={loading} />;
  if (isRealEstate) return <RealEstatePortfolioView items={items} onAdd={handleAdd} onDelete={handleDelete} loading={loading} />;
  if (isService) return <ServiceRateCardView items={items} onAdd={handleAdd} onDelete={handleDelete} loading={loading} />;
  return <GenericCatalogView items={items} onAdd={handleAdd} onDelete={handleDelete} loading={loading} />;
}
