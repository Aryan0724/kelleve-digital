"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export function AdvancedBidForm({ requirementId, onSuccess }: { requirementId: number, onSuccess: () => void }) {
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioPreview, setPortfolioPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    timeline_days: "",
    warranty_months: "",
    material_included: false,
    labour_included: false,
    design_included: false,
    supervision_included: false,
    proposal_message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (files.length !== validFiles.length) {
      alert("Some files exceeded 5MB limit and were skipped.");
    }

    setPortfolioFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPortfolioPreview(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        setPortfolioPreview(prev => [...prev, `📄 ${file.name}`]);
      }
    });
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles(prev => prev.filter((_, i) => i !== index));
    setPortfolioPreview(prev => prev.filter((_, i) => i !== index));
  };

  const submitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);
    try {
      const bidPayload = {
        requirement_id: requirementId,
        estimated_cost: Number(formData.amount),
        timeline_days: Number(formData.timeline_days),
        warranty_months: Number(formData.warranty_months) || 0,
        material_included: formData.material_included,
        labour_included: formData.labour_included,
        design_included: formData.design_included,
        supervision_included: formData.supervision_included,
        proposal_message: formData.proposal_message,
      };

      const bidResponse = await api.post("/bids", bidPayload);
      const bidId = bidResponse.data.data.id;

      // Upload portfolio files if provided - Removed since backend doesn't support bid attachments yet

      alert("Bid submitted successfully!");
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 422) {
        alert("Validation Error: " + JSON.stringify(err.response.data.errors));
      } else {
        alert(err.response?.data?.message || "Failed to submit bid.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitBid} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estimated Cost (₹) *</Label>
          <Input 
            type="number" 
            name="amount"
            required 
            min="1"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 500000"
          />
        </div>
        <div className="space-y-2">
          <Label>Timeline (Days) *</Label>
          <Input 
            type="number" 
            name="timeline_days"
            required 
            min="1"
            value={formData.timeline_days}
            onChange={handleChange}
            placeholder="e.g. 45"
          />
        </div>
        <div className="space-y-2">
          <Label>Warranty (Months)</Label>
          <Input 
            type="number" 
            name="warranty_months"
            min="0"
            value={formData.warranty_months}
            onChange={handleChange}
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Inclusions</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="material_included" checked={formData.material_included} onCheckedChange={(c) => handleToggle("material_included", c === true)} />
            <Label htmlFor="material_included" className="font-normal text-sm">Material Included</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="labour_included" checked={formData.labour_included} onCheckedChange={(c) => handleToggle("labour_included", c === true)} />
            <Label htmlFor="labour_included" className="font-normal text-sm">Labour Included</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="design_included" checked={formData.design_included} onCheckedChange={(c) => handleToggle("design_included", c === true)} />
            <Label htmlFor="design_included" className="font-normal text-sm">Design Included</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="supervision_included" checked={formData.supervision_included} onCheckedChange={(c) => handleToggle("supervision_included", c === true)} />
            <Label htmlFor="supervision_included" className="font-normal text-sm">Supervision Included</Label>
          </div>
        </div>
      </div>



      <div className="space-y-2">
        <Label>Detailed Proposal *</Label>
        <Textarea 
          name="proposal_message"
          required
          value={formData.proposal_message}
          onChange={handleChange}
          className="min-h-[120px]" 
          placeholder="Why should the client choose you? Describe your approach, quality of materials, etc."
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#ff6b00] hover:bg-[#ea580c] text-white font-bold h-12 text-base">
        {loading ? "Submitting..." : "Submit Formal Bid"}
      </Button>
    </form>
  );
}
