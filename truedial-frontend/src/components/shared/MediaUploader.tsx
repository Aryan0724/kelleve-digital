"use client";

import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, X, Star, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api"; // Assuming axios instance is configured here

export interface Media {
  id: number;
  url: string; // The URL to the image (we might need to map it if local)
  file_name: string;
  is_cover: boolean;
  sort_order: number;
}

interface MediaUploaderProps {
  modelType: string;
  modelId: number;
  collectionName?: string;
  initialMedia?: Media[];
  onUploadSuccess?: (media: Media[]) => void;
}

export function MediaUploader({
  modelType,
  modelId,
  collectionName = "gallery",
  initialMedia = [],
  onUploadSuccess,
}: MediaUploaderProps) {
  const [mediaList, setMediaList] = useState<Media[]>(initialMedia);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("model_type", modelType);
    formData.append("model_id", String(modelId));
    formData.append("collection_name", collectionName);
    files.forEach((file) => formData.append("files[]", file));

    try {
      const response = await api.post("/v1/truedial/vendor/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data?.data) {
        setMediaList((prev) => [...prev, ...response.data.data]);
        onUploadSuccess?.(response.data.data);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/v1/truedial/vendor/media/${id}`);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleSetCover = async (id: number) => {
    try {
      await api.put(`/v1/truedial/vendor/media/${id}/cover`);
      setMediaList((prev) =>
        prev.map((m) => ({ ...m, is_cover: m.id === id }))
      );
    } catch (error) {
      console.error("Set cover failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          {isUploading ? "Uploading..." : "Click or drag images to upload"}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>

      {mediaList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {mediaList.map((media) => (
            <div
              key={media.id}
              className="relative group rounded-lg overflow-hidden border bg-gray-100 aspect-square"
            >
              {/* Note: since using local public disk, url needs to point to backend, e.g. /storage/media/... */}
              <img
                src={media.url || `${process.env.NEXT_PUBLIC_API_URL}/storage/media/${media.file_name}`}
                alt="Uploaded media"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <button
                    onClick={() => handleSetCover(media.id)}
                    title="Set as Cover"
                    className={`p-1 rounded-full ${
                      media.is_cover ? "text-yellow-400 bg-black/50" : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Star className="h-4 w-4" fill={media.is_cover ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleDelete(media.id)}
                    className="p-1 text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Drag Handle Placeholder for Future DND implementation */}
                <div className="flex justify-center text-white/50">
                  <GripVertical className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
