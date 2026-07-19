"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, Building, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, token, _hasHydrated } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [listing, setListing] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    tagline: "",
    description: "",
    cover_image: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    city: "",
    district: "",
    address: "",
    years_experience: "",
    team_size: ""
  });

  const [newImage, setNewImage] = useState({ url: "", caption: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !_hasHydrated) return;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch sequentially to prevent PHP built-in server from hanging on concurrent requests
        const catRes = await api.get("/categories");
        const cityRes = await api.get("/cities");
        const profileRes = await api.get("/user/listings").catch(() => ({ data: { data: [] } }));
        
        setCategories(catRes.data);
        setCities(cityRes.data);
        
        const listings = profileRes.data.data;
        if (listings && listings.length > 0) {
          const mainListing = listings[0];
          setListing(mainListing);
          setGalleryImages(mainListing.gallery || []);
          
          setFormData({
            category_id: mainListing.category_id?.toString() || "",
            title: mainListing.title || "",
            tagline: mainListing.tagline || "",
            description: mainListing.description || "",
            cover_image: mainListing.cover_image || "",
            phone: mainListing.phone || "",
            whatsapp: mainListing.whatsapp || "",
            email: mainListing.email || "",
            website: mainListing.website || "",
            city: mainListing.city || "",
            district: mainListing.district || "",
            address: mainListing.address || "",
            years_experience: mainListing.years_experience?.toString() || "",
            team_size: mainListing.team_size?.toString() || ""
          });
        } else if (user) {
          // prefill from user
          setFormData(prev => ({
            ...prev,
            title: user.name || "",
            phone: user.phone || "",
            email: user.email || ""
          }));
        }
      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router, user, mounted, _hasHydrated]);

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        team_size: formData.team_size ? parseInt(formData.team_size) : null,
      };

      if (listing) {
        await api.put(`/user/listings/${listing.id}`, payload);
        alert("Profile updated successfully!");
      } else {
        const res = await api.post("/user/listings", payload);
        setListing(res.data.data);
        alert("Business profile created successfully!");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    if (!newImage.url) {
      alert("Please provide an image URL");
      return;
    }
    
    setUploadingImage(true);
    try {
      await api.post(`/user/listings/${listing.id}/gallery`, {
        images: [newImage]
      });
      alert("Image added to portfolio!");
      setNewImage({ url: "", caption: "" });
      
      // refresh gallery
      const res = await api.get("/user/listings");
      if (res.data.data && res.data.data.length > 0) {
        setGalleryImages(res.data.data[0].gallery || []);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!listing || !confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/user/listings/${listing.id}/gallery/${imageId}`);
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading profile...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Link href="/dashboard" className="text-orange-600 hover:text-orange-700">← Dashboard</Link>
            <span className="text-slate-300">/</span>
            My Professional Profile
          </div>
          {listing && listing.slug && (
            <Link href={`/professionals/${listing.slug}`} target="_blank" className="text-sm font-semibold text-blue-600 hover:underline">
              View Public Profile →
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-600" />
                    Business Listing Details
                  </CardTitle>
                  <CardDescription>
                    Complete your profile to build trust and rank higher.
                  </CardDescription>
                </div>
                {listing && listing.is_verified && (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified Professional
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveListing} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Business / Professional Name</Label>
                    <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Acme Interiors" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      required 
                      className="w-full border-slate-200 rounded-md text-sm p-2 border focus:ring-orange-600 focus:border-orange-600"
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tagline / Short Description</Label>
                  <Input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Transforming spaces into dreams" />
                </div>

                <div className="space-y-2">
                  <Label>Detailed Description</Label>
                  <Textarea required className="min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your services, expertise, and what makes you unique..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Patna" />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="e.g. Patna" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input type="number" value={formData.years_experience} onChange={e => setFormData({...formData, years_experience: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Team Size</Label>
                    <Input type="number" value={formData.team_size} onChange={e => setFormData({...formData, team_size: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image URL</Label>
                  <Input type="url" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} placeholder="https://example.com/cover.jpg" />
                  <p className="text-xs text-slate-500">Provide a direct URL to your cover photo.</p>
                </div>

                <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto">
                  {saving ? "Saving..." : (listing ? "Update Profile" : "Create Profile")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {listing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  Portfolio Gallery
                </CardTitle>
                <CardDescription>
                  Upload past project images to build trust and showcase your work to customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddImage} className="flex gap-4 items-end mb-8 bg-slate-50 p-4 rounded-lg border">
                  <div className="flex-1 space-y-2">
                    <Label>Image URL (Temporary placeholder for direct upload)</Label>
                    <Input required type="url" placeholder="https://example.com/project-image.jpg" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Caption (Optional)</Label>
                    <Input placeholder="e.g. Modern living room renovation" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} />
                  </div>
                  <Button type="submit" disabled={uploadingImage} className="bg-slate-800 hover:bg-slate-900">
                    {uploadingImage ? "Adding..." : "Add to Portfolio"}
                  </Button>
                </form>

                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map(img => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border">
                        <img src={img.image_url} alt={img.caption || "Portfolio image"} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id)}>Delete</Button>
                        </div>
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-1 truncate text-center">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Your portfolio is empty. Add images to attract more customers.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
