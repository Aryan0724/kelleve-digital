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
  const [editIsBeforeAfter, setEditIsBeforeAfter] = useState(false);

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
        caption: editCaption,
        is_before_after: editIsBeforeAfter
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
      <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
           {/* Decorational pattern */}
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 w-full absolute top-0 z-10"></div>
        <CardContent className="p-8 md:p-16 flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/20 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/10 rotate-3 transform hover:rotate-6 transition-transform">
            <Paintbrush className="w-12 h-12 text-orange-600 dark:text-orange-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Activate Your Portfolio</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-lg mb-10 leading-relaxed">
            Your portfolio is your storefront. Complete your basic profile first, then start uploading beautiful photos and videos to win <span className="font-bold text-slate-900 dark:text-white">3x more clients.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button variant="default" size="lg" className="rounded-full px-10 py-6 text-base shadow-xl shadow-orange-500/20 bg-orange-600 hover:bg-orange-700 transition-all hover:-translate-y-1">
              Complete Profile
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 py-6 text-base bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all">
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-60 grayscale">
             {/* Fake mockups of photos */}
             <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl -rotate-6 border border-white/20"></div>
             <div className="w-24 h-24 bg-slate-300 dark:bg-slate-700 rounded-xl z-10 shadow-lg border border-white/20"></div>
             <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl rotate-6 border border-white/20"></div>
          </div>
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
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="is-before-after" 
                  checked={editIsBeforeAfter}
                  onChange={(e) => setEditIsBeforeAfter(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="is-before-after" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mark as "Before & After" Photo
                </label>
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
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="text-center py-24 px-4 relative z-10">
            <div className="relative inline-flex mb-8">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center relative border border-slate-100 dark:border-slate-700">
                <UploadCloud className="h-10 w-10 text-orange-500" />
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Your Portfolio is Empty</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
              Upload your first project photo or YouTube video. High-quality portfolios receive <strong className="text-slate-700 dark:text-slate-200">up to 5x more clicks</strong> from clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative inline-block w-full sm:w-auto">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button variant="default" size="lg" className="w-full rounded-full px-8 shadow-xl shadow-orange-500/20 bg-orange-600 hover:bg-orange-700 transition-all hover:-translate-y-0.5" disabled={uploading}>
                  {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-2" />} 
                  Upload Photo
                </Button>
              </div>
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-sm border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" onClick={() => setShowVideoModal(true)} disabled={uploading}>
                <Video className="w-5 h-5 mr-2 text-indigo-500" /> 
                Add Video Link
              </Button>
            </div>
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
                    setEditIsBeforeAfter(img.is_before_after || false);
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
              
              {img.is_before_after && (
                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-md z-10">
                  Before & After
                </div>
              )}
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
