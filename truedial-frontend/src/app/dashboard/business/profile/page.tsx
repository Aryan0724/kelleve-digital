"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Globe, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/shared/MediaUploader";

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/truedial/vendor/my-business`, {
          headers: {
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`,
            'Accept': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
        } else {
          setProfile({ title: '', description: '', phone: '', address: '', website: '', category_id: 1, city_id: 1, district: '', state: '' });
        }
      } catch (err) {
        console.error(err);
        setProfile({ title: '', description: '', phone: '', address: '', website: '', category_id: 1, city_id: 1, district: '', state: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const isUpdate = !!profile.id;
    const url = isUpdate 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/truedial/vendor/businesses/${profile.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/truedial/vendor/businesses`;
      
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        alert('Profile saved successfully!');
        setProfile(data.data);
      } else {
        alert(data.message || 'Error saving profile');
      }
    } catch (err) {
      alert('Network error');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">Business Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your business details and directory listing.</p>
      </div>

      <div className="premium-card p-6 rounded-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input 
                type="text" 
                value={profile.title} 
                onChange={e => setProfile({...profile, title: e.target.value})} 
                className="pl-9 bg-background focus:ring-primary" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Description</label>
            <textarea 
              value={profile.description} 
              onChange={e => setProfile({...profile, description: e.target.value})} 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="tel" 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})} 
                  className="pl-9 bg-background focus:ring-primary" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Website (Optional)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="url" 
                  value={profile.website || ''} 
                  onChange={e => setProfile({...profile, website: e.target.value})} 
                  className="pl-9 bg-background focus:ring-primary" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Full Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input 
                type="text" 
                value={profile.address} 
                onChange={e => setProfile({...profile, address: e.target.value})} 
                className="pl-9 bg-background focus:ring-primary" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">District</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={profile.district || ''} 
                  onChange={e => setProfile({...profile, district: e.target.value})} 
                  className="pl-9 bg-background focus:ring-primary" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={profile.state || ''} 
                  onChange={e => setProfile({...profile, state: e.target.value})} 
                  className="pl-9 bg-background focus:ring-primary" 
                  required 
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full mt-6 flex items-center gap-2 h-12 shadow-md shadow-primary/20">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>

      {profile?.id && (
        <div className="premium-card p-6 rounded-xl mt-6">
          <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Gallery Images</h2>
          <MediaUploader
            modelType="listing"
            modelId={profile.id}
            collectionName="gallery"
            initialMedia={profile.media || []}
          />
        </div>
      )}
    </div>
  );
}
