"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Loader2, UploadCloud, X, PlusCircle, Video, Image as ImageIcon, Trash2, CheckCircle2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PortfolioTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  
  // Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCaption, setVideoCaption] = useState("");

  // Edit Modal State
  const [editingImage, setEditingImage] = useState<any>(null);
  const [editCaption, setEditCaption] = useState("");

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
    if (!profileId) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        await api.post(`/user/listings/${profileId}/gallery`, {
          images: [
            {
              data: base64Data,
              caption: file.name
            }
          ]
        });
        fetchGallery();
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to upload image.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = async () => {
    if (!videoUrl || !profileId) return;

    setUploading(true);
    try {
      await api.post(`/user/listings/${profileId}/gallery`, {
        images: [{ type: 'video', data: videoUrl, caption: videoCaption || "Video Project" }]
      });
      setShowVideoModal(false);
      setVideoUrl("");
      setVideoCaption("");
      fetchGallery();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add video.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!profileId) return;
    if (!confirm("Are you sure you want to delete this media?")) return;
    
    try {
      await api.delete(`/user/listings/${profileId}/gallery/${imageId}`);
      fetchGallery();
    } catch (e) {
      console.error(e);
      alert("Failed to delete image.");
    }
  };

  const handleUpdateCaption = async () => {
    if (!profileId || !editingImage) return;
    setUploading(true);
    try {
      await api.put(`/user/listings/${profileId}/gallery/${editingImage.id}`, {
        caption: editCaption
      });
      setEditingImage(null);
      setEditCaption("");
      fetchGallery();
    } catch (e) {
      console.error(e);
      alert("Failed to update caption.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!profileId) {
    return (
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2"></div>
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
            <Paintbrush className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Activate Your Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
            Please complete your basic profile information first. Once activated, you can upload unlimited photos and videos of your best work.
          </p>
          <Button variant="default" size="lg" className="rounded-full shadow-lg">
            Go to Profile Tab
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Showcase your best work to win 3x more bids.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none border-dashed border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => setShowVideoModal(true)}
            disabled={uploading}
          >
            <Video className="w-4 h-4 mr-2 text-indigo-500" /> Add Video
          </Button>
          
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button className="w-full" disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              Upload Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add YouTube / Vimeo Link</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Video URL</label>
                <Input 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Caption (Optional)</label>
                <Input 
                  placeholder="e.g. Modern Kitchen Reno" 
                  value={videoCaption}
                  onChange={(e) => setVideoCaption(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowVideoModal(false)}>Cancel</Button>
              <Button onClick={handleAddVideo} disabled={!videoUrl || uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Video"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Caption</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Caption</label>
                <Input 
                  placeholder="e.g. Modern Kitchen Reno" 
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditingImage(null)}>Cancel</Button>
              <Button onClick={handleUpdateCaption} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
          <UploadCloud className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Your portfolio is empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Upload your first project photo or video to start building trust with clients.
          </p>
          <div className="relative inline-block">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button variant="secondary" className="rounded-full px-8 shadow-sm">
              <ImageIcon className="w-4 h-4 mr-2" /> Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              
              {img.type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                    <Video className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 mb-1">
                    {img.caption || "Video Project"}
                  </p>
                  <a href={img.video_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate w-full">
                    {img.video_url}
                  </a>
                </div>
              ) : (
                <img 
                  src={img.image_url} 
                  alt={img.caption || "Portfolio item"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full w-10 h-10 shadow-xl scale-90 group-hover:scale-100 transition-transform bg-white/90 hover:bg-white text-slate-700" 
                  onClick={() => {
                    setEditingImage(img);
                    setEditCaption(img.caption || "");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full w-10 h-10 shadow-xl scale-90 group-hover:scale-100 transition-transform" 
                  onClick={() => handleDelete(img.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Add More Tile */}
          <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
              <PlusCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Add Photo</p>
          </div>
        </div>
      )}
    </div>
  );
}
