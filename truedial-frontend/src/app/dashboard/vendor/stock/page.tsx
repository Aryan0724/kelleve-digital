"use client";

import React, { useState } from "react";
import { 
  Package, AlertTriangle, ArrowDown, ShoppingCart, 
  Search, Filter, CheckCircle2, TrendingUp, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_STOCK = [
  {
    id: "SKU-1092",
    name: "Samsung 55-inch 4K Smart TV",
    category: "Electronics",
    currentStock: 2,
    reorderLevel: 5,
    status: "Critical",
    lastRestocked: "15 Jul 2026",
    supplier: "Samsung Distributors India"
  },
  {
    id: "SKU-3314",
    name: "Apple iPhone 15 Pro (256GB)",
    category: "Smartphones",
    currentStock: 4,
    reorderLevel: 10,
    status: "Low",
    lastRestocked: "01 Aug 2026",
    supplier: "TechWholesale Hub"
  },
  {
    id: "SKU-8821",
    name: "Sony WH-1000XM5 Headphones",
    category: "Audio",
    currentStock: 0,
    reorderLevel: 8,
    status: "Out of Stock",
    lastRestocked: "10 Jun 2026",
    supplier: "AudioTech Suppliers"
  },
  {
    id: "SKU-4412",
    name: "LG 1.5 Ton Inverter AC",
    category: "Home Appliances",
    currentStock: 8,
    reorderLevel: 5,
    status: "Normal",
    lastRestocked: "20 Jul 2026",
    supplier: "LG Distributors"
  }
];

export default function StockAlertsManager() {
  const [items, setItems] = useState(MOCK_STOCK);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Low': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Critical': return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case 'Out of Stock': return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const reorderItem = (id: string) => {
    alert(`Reorder request generated for ${id} and sent to supplier!`);
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Reordered (Pending)' } : i));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-500" />
            Stock Alerts & Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor low inventory levels and quickly reorder from suppliers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <History className="w-4 h-4 mr-2" /> Order History
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-10 px-6">
            <ShoppingCart className="w-4 h-4 mr-2" /> Bulk Reorder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{items.filter(i => i.status === "Out of Stock").length}</div>
            <div className="text-sm font-medium text-slate-500">Out of Stock</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{items.filter(i => i.status === "Critical" || i.status === "Low").length}</div>
            <div className="text-sm font-medium text-slate-500">Low Inventory</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4 md:col-span-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Fastest Moving Category</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 text-white border-0">Smartphones</Badge>
              <span className="text-xs text-slate-500">Reorder thresholds might need adjustment based on recent sales velocity.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-bold text-slate-900 dark:text-white">Action Required Items</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search SKU or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Header Row */}
          <div className="p-4 grid grid-cols-12 gap-4 items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
            <div className="col-span-4">Product Details</div>
            <div className="col-span-2 text-center">Current Stock</div>
            <div className="col-span-2 text-center">Reorder Level</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {filteredItems.map(item => (
            <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
              <div className="col-span-4">
                <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                <div className="text-xs text-slate-500 flex items-center mt-1 gap-2">
                  <span className="font-mono text-indigo-500">{item.id}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
              </div>
              
              <div className="col-span-2 text-center">
                <div className={`text-xl font-bold ${item.currentStock === 0 ? 'text-red-500' : item.currentStock <= item.reorderLevel ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>
                  {item.currentStock}
                </div>
              </div>
              
              <div className="col-span-2 text-center">
                <div className="text-lg font-medium text-slate-500">{item.reorderLevel}</div>
              </div>
              
              <div className="col-span-2 flex justify-center">
                <Badge className={`px-2.5 py-1 ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </div>
              
              <div className="col-span-2 flex justify-end">
                {item.status !== 'Normal' && !item.status.includes('Pending') ? (
                  <Button size="sm" onClick={() => reorderItem(item.id)} className="h-8 text-xs bg-indigo-500 hover:bg-indigo-600 text-white w-full">
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Reorder Now
                  </Button>
                ) : item.status.includes('Pending') ? (
                  <span className="text-xs font-semibold text-indigo-500 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Order Placed
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Stock OK</span>
                )}
              </div>
              
              {item.status !== 'Normal' && (
                <div className="col-span-12 mt-2">
                  <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded flex justify-between border border-slate-100 dark:border-slate-800">
                    <span><strong className="text-slate-700 dark:text-slate-300">Supplier:</strong> {item.supplier}</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Last Restocked:</strong> {item.lastRestocked}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No inventory items found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
