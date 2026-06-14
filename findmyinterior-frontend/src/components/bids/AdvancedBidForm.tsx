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
    company_name: user?.name || "",
    contact_person: user?.name || "",
    category: "Interior Design",
    experience: "5",
    amount: "",
    timeline_days: "",
    warranty_months: "",
    material_included: false,
    labour_included: false,
    design_included: false,
    supervision_included: false,
    previous_projects_count: "",
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
        previous_projects_count: Number(formData.previous_projects_count) || 0,
        proposal_message: formData.proposal_message,
        company_name: formData.company_name,
        contact_person: formData.contact_person,
        category: formData.category,
        experience_years: Number(formData.experience) || 0,
      };

      const bidResponse = await api.post("/bids", bidPayload);
      const bidId = bidResponse.data.data.id;

      // Upload portfolio files if provided
      if (portfolioFiles.length > 0) {
        const formDataWithFiles = new FormData();
        portfolioFiles.forEach((file) => {
          formDataWithFiles.append('images[]', file);
        });

        try {
          await api.post(`/user/listings/${bidId}/gallery`, formDataWithFiles, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (uploadErr) {
          console.warn("Portfolio upload failed (bid still created):", uploadErr);
        }
      }

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
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input name="company_name" value={formData.company_name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Contact Person</Label>
          <Input name="contact_person" value={formData.contact_person} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Experience (Years)</Label>
          <Input type="number" name="experience" value={formData.experience} onChange={handleChange} required />
        </div>
      </div>

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
        <div className="space-y-2">
          <Label>Projects Completed</Label>
          <Input 
            type="number" 
            name="previous_projects_count"
            min="0"
            value={formData.previous_projects_count}
            onChange={handleChange}
            placeholder="e.g. 50"
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
        <Label>Portfolio Upload</Label>
        <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
          <input 
            type="file" 
            multiple 
            accept="image/*,.pdf" 
            onChange={handlePortfolioUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-slate-600">Click to upload portfolio PDF/Images</span>
          <span className="text-xs text-slate-400 mt-1">Max 5MB per file</span>
        </label>
        {portfolioPreview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            {portfolioPreview.map((preview, idx) => (
              <div key={idx} className="relative border rounded p-2 bg-slate-50">
                {typeof preview === 'string' && preview.startsWith('data:') ? (
                  <img src={preview} alt={`Preview ${idx}`} className="w-full h-20 object-cover rounded" />
                ) : (
                  <div className="w-full h-20 flex items-center justify-center text-xs font-medium text-slate-600">{preview}</div>
                )}
                <button 
                  type="button"
                  onClick={() => removePortfolioFile(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
