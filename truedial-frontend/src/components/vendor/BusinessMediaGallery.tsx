"use client";

import React, { useState } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Loader2, Star, Image as ImageIcon } from "lucide-react";

export function BusinessMediaGallery({ business, onUpdate }: { business: any, onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, collection: 'cover' | 'gallery' = 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("collection", collection);
    formData.append("listing_id", business.id.toString());

    try {
      const res = await TrueDialAPI.uploadMedia(formData);
      if (res.success) {
        onUpdate(); // Trigger refresh
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await TrueDialAPI.deleteMedia(mediaId);
      if (res.success) {
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetCover = async (mediaId: number) => {
    try {
      const res = await TrueDialAPI.setMediaCover(mediaId);
      if (res.success) {
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const galleryImages = business?.gallery || [];
  const coverImage = business?.cover_image || null;

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
          <ImageIcon className="mr-2 h-5 w-5 text-[#E8701A]" />
          Media Gallery
        </CardTitle>
        <CardDescription>Manage your business cover photo and image gallery.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Cover Photo Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Cover Photo</h4>
          <div className="relative group w-full h-48 sm:h-64 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-500">
                <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <span className="text-sm">No cover photo uploaded</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center">
                <ImagePlus className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Cover"}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Gallery Images</h4>
            <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center">
              <ImagePlus className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Add Image"}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} disabled={uploading} />
            </label>
          </div>

          {galleryImages.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-sm text-slate-500">No images in your gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((img: any, idx: number) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <img src={img.url || img} alt="Gallery" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {img.id && (
                      <>
                        <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => handleSetCover(img.id)}>
                          <Star className="mr-1 h-3 w-3" /> Set Cover
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => handleDelete(img.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
