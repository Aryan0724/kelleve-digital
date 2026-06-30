"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function SettingsTab() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/user/profile", formData);
      updateUser(res.data.data);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.put("/user/change-password", passwordData);
      alert("Password updated successfully!");
      setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Profile</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
            <div>
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={user?.email || ""} 
                disabled 
                title="Email cannot be changed"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
            <div>
              <Label>Current Password</Label>
              <Input 
                type="password"
                value={passwordData.current_password} 
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input 
                type="password"
                value={passwordData.new_password} 
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input 
                type="password"
                value={passwordData.new_password_confirmation} 
                onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})} 
                required 
              />
            </div>
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
