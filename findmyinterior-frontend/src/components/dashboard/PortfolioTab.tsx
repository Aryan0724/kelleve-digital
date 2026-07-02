"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Loader2, UploadCloud, X, PlusCircle } from "lucide-react";

export function PortfolioTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/professional-profile");
      if (res.data?.data) {
        setProfileId(res.data.data.id);
        setImages(res.data.data.gallery || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profileId) {
      alert("Please complete your profile first before uploading portfolio images.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        await api.post(`/listings/${profileId}/gallery`, {
          images: [
            {
              data: base64Data,
              caption: file.name
            }
          ]
        });
        alert("Image uploaded successfully!");
        fetchGallery();
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!profileId) return;
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await api.delete(`/listings/${profileId}/gallery/${imageId}`);
      fetchGallery();
    } catch (e) {
      console.error(e);
      alert("Failed to delete image.");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Portfolio</CardTitle>
        <CardDescription>Upload photos of your previous work. A complete portfolio increases your chances of winning bids by 3x!</CardDescription>
      </CardHeader>
      <CardContent>
        {!profileId ? (
          <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-slate-50">
            <Paintbrush className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Complete Profile Required</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-4">
              Please go to the Profile tab and save your basic information before uploading your portfolio.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {images.map((img: any) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border group bg-slate-100">
                  <img src={img.image_url} alt={img.caption || "Portfolio item"} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id)}>
                      <X className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Upload Button */}
              <div className="relative aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                    <span className="text-sm font-medium text-indigo-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600">Add Image</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
