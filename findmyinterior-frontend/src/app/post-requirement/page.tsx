"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Suspense } from "react";

const OPPORTUNITY_TYPES = [
  { id: "interior_design", label: "Interior Design", type: "projects" },
  { id: "construction", label: "Construction", type: "projects" },
  { id: "architect", label: "Architecture", type: "projects" },
  { id: "renovation", label: "Renovation", type: "projects" },
  { id: "furniture", label: "Furniture", type: "projects" },
  { id: "materials", label: "Materials", type: "rfqs" },
  { id: "workers", label: "Workers", type: "worker-jobs" },
  { id: "builder_project", label: "Builder Project", type: "builder-projects" },
];

function PostRequirementContent() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const editType = searchParams?.get("type") || "project";
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [selectedType, setSelectedType] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "Patna",
    district: "Patna",
    budget: "",
    
    // Project specific
    property_type: "",
    area: "",
    timeline: "",
    style_preferences: "",
    plot_size: "",
    construction_stage: "",
    
    // RFQ specific
    material_type: "",
    quantity: "",
    required_date: "",
    
    // Job specific
    skill_required: "",
    number_of_workers: "",
    duration: "",

    // Builder specific
    project_name: "",
    project_scale: "",
    project_location: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    
    if (editId) {
      setLoading(true);
      let fetchEndpoint = `/projects/${editId}`;
      if (editType === 'rfq') fetchEndpoint = `/rfqs/${editId}`;
      if (editType === 'job') fetchEndpoint = `/worker-jobs/${editId}`;

      api.get(fetchEndpoint).then(res => {
        const data = res.data.data;
        let typeVal = "";
        
        if (editType === 'rfq') {
          typeVal = "materials";
          setFormData(prev => ({
            ...prev,
            title: data.title || "",
            description: data.description?.split("\n\n[Details]")[0] || data.description || "",
            city: data.city || "",
            district: data.district || "",
            material_type: data.category || "",
            quantity: data.quantity || "",
            required_date: data.expected_delivery_date || "",
          }));
        } else if (editType === 'job') {
          typeVal = "workers";
          setFormData(prev => ({
            ...prev,
            title: data.title || "",
            description: data.description?.split("\n\n[Details]")[0] || data.description || "",
            city: data.city || "",
            district: data.district || "",
            skill_required: data.skills_required || "",
            duration: data.duration || "",
          }));
        } else {
          // Projects
          typeVal = data.requirement_type ? data.requirement_type.toLowerCase() : "interior_design";
          if (typeVal === 'builder_project') {
             setFormData(prev => ({
              ...prev,
              title: data.title || "",
              description: data.description?.split("\n\n[Details]")[0] || data.description || "",
              city: data.city || "",
              district: data.district || "",
              budget: data.budget || "",
              project_name: data.project_name || "",
              project_scale: data.project_scale || "",
              project_location: data.project_location || "",
              timeline: data.possession_timeline || "",
            }));
          } else if (typeVal === 'construction') {
            setFormData(prev => ({
              ...prev,
              title: data.title || "",
              description: data.description?.split("\n\n[Details]")[0] || data.description || "",
              city: data.city || "",
              district: data.district || "",
              budget: data.budget || "",
              plot_size: data.area || "",
              construction_stage: data.site_condition || "",
              timeline: data.possession_timeline || "",
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              title: data.title || "",
              description: data.description?.split("\n\n[Details]")[0] || data.description || "",
              city: data.city || "",
              district: data.district || "",
              budget: data.budget || "",
              property_type: data.project_category || "",
              area: data.area || "",
              timeline: data.possession_timeline || "",
              style_preferences: data.design_style || "",
            }));
          }
        }
        
        setSelectedType(typeVal);
        setStep(2);
      }).catch(err => {
        console.error("Failed to load requirement", err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [editId, editType]);

  const handleNext = () => {
    if (!selectedType) {
      setError("Please select what you need first.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!mounted) return;
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const oppDef = OPPORTUNITY_TYPES.find(t => t.id === selectedType);
      if (!oppDef) throw new Error("Invalid selection");

      let payload: any = {
        title: formData.title || `${oppDef.label} Request`,
        description: formData.description,
        city: formData.city,
        district: formData.district,
      };

      // Map wizard fields to the generic JSON meta column 'details' or direct columns 
      payload.opportunity_type = oppDef.type === "projects" ? "PROJECT" : (oppDef.type === "rfqs" ? "RFQ" : (oppDef.type === "builder-projects" ? "BUILDER_PROJECT" : "JOB"));
      payload.requirement_type = selectedType.toUpperCase();
      
      let detailsText = "";
      if (['interior_design', 'renovation', 'architect', 'furniture'].includes(selectedType)) {
        detailsText = `Property Type: ${formData.property_type}\nArea: ${formData.area}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nStyle: ${formData.style_preferences}`;
        payload.project_category = formData.property_type;
        payload.project_type = formData.property_type;
        payload.area = formData.area;
        payload.budget = formData.budget;
        payload.possession_timeline = formData.timeline;
        payload.design_style = formData.style_preferences;
      } else if (selectedType === 'construction') {
        detailsText = `Plot Size: ${formData.plot_size}\nStage: ${formData.construction_stage}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}`;
        payload.project_category = 'construction';
        payload.project_type = 'construction';
        payload.area = formData.plot_size;
        payload.budget = formData.budget;
        payload.site_condition = formData.construction_stage;
        payload.possession_timeline = formData.timeline;
      } else if (selectedType === 'materials') {
        detailsText = `Material Type: ${formData.material_type}\nQuantity: ${formData.quantity}\nRequired Date: ${formData.required_date}`;
        payload.category = formData.material_type;
        payload.quantity = formData.quantity;
        payload.expected_delivery_date = formData.required_date;
      } else if (selectedType === 'workers') {
        detailsText = `Skill Required: ${formData.skill_required}\nNumber of Workers: ${formData.number_of_workers}\nDuration: ${formData.duration}`;
        payload.skills_required = formData.skill_required;
        payload.duration = formData.duration;
      } else if (selectedType === 'builder_project') {
        detailsText = `Project Name: ${formData.project_name}\nScale: ${formData.project_scale}\nLocation: ${formData.project_location}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}`;
        payload.project_category = 'builder_project';
        payload.project_type = 'builder_project';
        payload.budget = formData.budget;
      }
      
      payload.description = `${formData.description}\n\n[Details]\n${detailsText}`;

      let endpoint = `/projects`;
      if (oppDef.type === 'rfqs') endpoint = `/rfqs`;
      if (oppDef.type === 'worker-jobs') endpoint = `/worker-jobs`;

      const formDataPayload = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== null) {
          formDataPayload.append(key, payload[key]);
        }
      });

      if (imageFile) {
        formDataPayload.append('image', imageFile);
      }

      if (editId) {
        formDataPayload.append('_method', 'PUT');
        await api.post(`${endpoint}/${editId}`, formDataPayload, {
          headers: { 'Content-Type': undefined },
        });
      } else {
        await api.post(endpoint, formDataPayload, {
          headers: { 'Content-Type': undefined },
        });
      }
      setLoading(false);
      // Hard navigate so dashboard re-mounts and fetches fresh data
      window.location.href = '/dashboard';

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post opportunity");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (success) {
    return null; // Should not reach here
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Smart Opportunity Creation</CardTitle>
          <CardDescription>
            Step {step} of 2 - {step === 1 ? 'What do you need?' : 'Details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPPORTUNITY_TYPES.map((opp) => (
                <div 
                  key={opp.id}
                  onClick={() => setSelectedType(opp.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedType === opp.id ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-100' : 'hover:border-slate-300 bg-white'}`}
                >
                  <h3 className="font-semibold text-lg">{opp.label}</h3>
                  <p className="text-sm text-slate-500">Post a request for {opp.label.toLowerCase()}</p>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input required id="title" placeholder="A short title for your request" 
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              {/* Context Aware Fields */}
              {['interior_design', 'renovation', 'architect', 'furniture'].includes(selectedType) && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, property_type: val})}>
                        <SelectTrigger><SelectValue placeholder="e.g. 3BHK Apartment" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1BHK">1BHK</SelectItem>
                          <SelectItem value="2BHK">2BHK</SelectItem>
                          <SelectItem value="3BHK">3BHK</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Commercial">Commercial/Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Total Area (sq ft)</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, area: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under 500 sq ft">Under 500 sq ft</SelectItem>
                          <SelectItem value="500 - 1000 sq ft">500 - 1000 sq ft</SelectItem>
                          <SelectItem value="1000 - 2000 sq ft">1000 - 2000 sq ft</SelectItem>
                          <SelectItem value="2000 - 5000 sq ft">2000 - 5000 sq ft</SelectItem>
                          <SelectItem value="Above 5000 sq ft">Above 5000 sq ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, budget: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under ₹1 Lakh">Under ₹1 Lakh</SelectItem>
                          <SelectItem value="₹1 - ₹5 Lakhs">₹1 - ₹5 Lakhs</SelectItem>
                          <SelectItem value="₹5 - ₹10 Lakhs">₹5 - ₹10 Lakhs</SelectItem>
                          <SelectItem value="₹10 - ₹25 Lakhs">₹10 - ₹25 Lakhs</SelectItem>
                          <SelectItem value="₹25 - ₹50 Lakhs">₹25 - ₹50 Lakhs</SelectItem>
                          <SelectItem value="Above ₹50 Lakhs">Above ₹50 Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, timeline: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Timeline" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                          <SelectItem value="Within 3 Months">Within 3 Months</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style">Style Preferences</Label>
                    <Input id="style" placeholder="e.g. Modern, Minimalist, Traditional" value={formData.style_preferences} onChange={(e) => setFormData({...formData, style_preferences: e.target.value})} />
                  </div>
                </>
              )}

              {selectedType === 'construction' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plot_size">Plot Size</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, plot_size: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Plot Size" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20x30">20x30</SelectItem>
                          <SelectItem value="30x40">30x40</SelectItem>
                          <SelectItem value="40x60">40x60</SelectItem>
                          <SelectItem value="50x80">50x80</SelectItem>
                          <SelectItem value="Other/Larger">Other/Larger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="construction_stage">Current Stage</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, construction_stage: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Stage" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Empty Plot">Empty Plot</SelectItem>
                          <SelectItem value="Excavation">Excavation</SelectItem>
                          <SelectItem value="Foundation">Foundation</SelectItem>
                          <SelectItem value="Structure/Framing">Structure/Framing</SelectItem>
                          <SelectItem value="Finishing">Finishing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, budget: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under ₹10 Lakhs">Under ₹10 Lakhs</SelectItem>
                          <SelectItem value="₹10 - ₹25 Lakhs">₹10 - ₹25 Lakhs</SelectItem>
                          <SelectItem value="₹25 - ₹50 Lakhs">₹25 - ₹50 Lakhs</SelectItem>
                          <SelectItem value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</SelectItem>
                          <SelectItem value="Above ₹1 Crore">Above ₹1 Crore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, timeline: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Timeline" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                          <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                          <SelectItem value="6-12 Months">6-12 Months</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {selectedType === 'materials' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material_type">Material Type</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, material_type: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Material" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cement">Cement</SelectItem>
                          <SelectItem value="Steel/TMT">Steel/TMT Bars</SelectItem>
                          <SelectItem value="Bricks/Blocks">Bricks/Blocks</SelectItem>
                          <SelectItem value="Sand/Aggregate">Sand/Aggregate</SelectItem>
                          <SelectItem value="Tiles/Marble">Tiles/Marble</SelectItem>
                          <SelectItem value="Plywood/Wood">Plywood/Wood</SelectItem>
                          <SelectItem value="Electricals">Electricals</SelectItem>
                          <SelectItem value="Plumbing">Plumbing</SelectItem>
                          <SelectItem value="Paint">Paint</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Required</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, quantity: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Quantity" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small/Sample">Small/Sample</SelectItem>
                          <SelectItem value="Medium (Part of Project)">Medium (Part of Project)</SelectItem>
                          <SelectItem value="Large (Full Project)">Large (Full Project)</SelectItem>
                          <SelectItem value="Bulk/Wholesale">Bulk/Wholesale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="required_date">Required By</Label>
                    <Select onValueChange={(val: any) => setFormData({...formData, required_date: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Timeline" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="Within a Week">Within a Week</SelectItem>
                          <SelectItem value="Within a Month">Within a Month</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedType === 'workers' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill_required">Skill Required</Label>
                      <Select value={formData.skill_required || ""} onValueChange={(v) => setFormData({...formData, skill_required: v || ""})}>
                        <SelectTrigger id="skill_required">
                          <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electrician">Electrician</SelectItem>
                          <SelectItem value="Plumber">Plumber</SelectItem>
                          <SelectItem value="Carpenter">Carpenter</SelectItem>
                          <SelectItem value="Painter">Painter</SelectItem>
                          <SelectItem value="Mason">Mason</SelectItem>
                          <SelectItem value="HVAC Technician">HVAC Technician</SelectItem>
                          <SelectItem value="Welder">Welder</SelectItem>
                          <SelectItem value="Tiler">Tiler</SelectItem>
                          <SelectItem value="General Helper">General Helper</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number_of_workers">Number of Workers</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, number_of_workers: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Number" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 - 2 Workers">1 - 2 Workers</SelectItem>
                          <SelectItem value="3 - 5 Workers">3 - 5 Workers</SelectItem>
                          <SelectItem value="5 - 10 Workers">5 - 10 Workers</SelectItem>
                          <SelectItem value="10+ Workers">10+ Workers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Select onValueChange={(val: any) => setFormData({...formData, duration: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Duration" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 - 3 Days">1 - 3 Days</SelectItem>
                          <SelectItem value="1 Week">1 Week</SelectItem>
                          <SelectItem value="2 - 3 Weeks">2 - 3 Weeks</SelectItem>
                          <SelectItem value="1 Month+">1 Month+</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedType === 'builder_project' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input id="project_name" placeholder="e.g. Sunrise Apartments" value={formData.project_name} onChange={(e) => setFormData({...formData, project_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_scale">Project Scale</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, project_scale: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Scale" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under 10 Units">Under 10 Units</SelectItem>
                          <SelectItem value="10 - 50 Units">10 - 50 Units</SelectItem>
                          <SelectItem value="50 - 100 Units">50 - 100 Units</SelectItem>
                          <SelectItem value="100+ Units">100+ Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project_location">Location Details</Label>
                      <Input id="project_location" placeholder="e.g. Main Road, Block B" value={formData.project_location} onChange={(e) => setFormData({...formData, project_location: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, budget: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under ₹1 Crore">Under ₹1 Crore</SelectItem>
                          <SelectItem value="₹1 - ₹5 Crores">₹1 - ₹5 Crores</SelectItem>
                          <SelectItem value="₹5 - ₹10 Crores">₹5 - ₹10 Crores</SelectItem>
                          <SelectItem value="Above ₹10 Crores">Above ₹10 Crores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select onValueChange={(val: any) => setFormData({...formData, timeline: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Timeline" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under 6 Months">Under 6 Months</SelectItem>
                          <SelectItem value="6 - 12 Months">6 - 12 Months</SelectItem>
                          <SelectItem value="1 - 2 Years">1 - 2 Years</SelectItem>
                          <SelectItem value="2+ Years">2+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea id="description" className="h-24" placeholder="Any other specific requirements..." 
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input required id="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District / Area</Label>
                  <Input required id="district" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} />
                </div>
              </div>

              {/* Image Upload for all types */}
              <div className="space-y-2 mt-6 p-4 border rounded-lg bg-slate-50">
                <Label htmlFor="image" className="font-semibold text-slate-700 block mb-1">Add a Photo (Optional)</Label>
                <span className="text-sm text-slate-500 block mb-2">Upload a photo to give professionals a better idea of what you need.</span>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }} 
                />
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {step === 1 ? (
            <>
              <div />
              <Button onClick={handleNext} disabled={!selectedType} className="bg-[#0a1c3a] hover:bg-[#1a2c4a]">
                Next Step
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? (editId ? "Updating..." : "Posting...") : (editId ? "Update Opportunity" : "Post Opportunity")}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PostRequirementPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-slate-500">Loading form...</div>}>
      <PostRequirementContent />
    </Suspense>
  );
}
