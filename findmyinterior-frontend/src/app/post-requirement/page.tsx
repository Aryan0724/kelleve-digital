"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PostRequirementPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "1", // Hardcoded default or fetched later
    city: "Patna",
    district: "Patna",
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: any) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    
    if (!mounted) return;
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: Record<string, any> = { ...formData };
      if (!payload.email) delete payload.email;
      await api.post("/requirements", payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post requirement");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Requirement Posted!</CardTitle>
            <CardDescription>
              Your project requirement has been posted. Relevant professionals will contact you soon.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push("/dashboard")} className="bg-orange-600 hover:bg-orange-700">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a Requirement</CardTitle>
          <CardDescription>
            Tell us what you need. We'll connect you with the best professionals in Bihar.
          </CardDescription>
        </CardHeader>
        <div className="space-y-4 pt-6">
          <CardContent className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="title">Requirement Title</Label>
              <Input required id="title" placeholder="e.g. Need an interior designer for 3BHK" 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea required id="description" className="h-32" placeholder="Describe your project, timeline, and expectations..." 
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input required id="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input required id="district" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input required id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input required type="tel" id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleSubmit} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
              {loading ? "Posting..." : "Post Requirement"}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
