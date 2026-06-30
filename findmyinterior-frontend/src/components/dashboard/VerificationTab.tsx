import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldAlert, ShieldCheck, UploadCloud, XCircle, AlertCircle, ArrowRight, Lock, Check } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

const getRequiredDocsForRole = (role: string) => {
  switch (role) {
    case 'interior_designer':
    case 'interior_company':
      return [
        { id: "gst_certificate", label: "GST Certificate" },
        { id: "pan_card", label: "PAN Card" },
        { id: "owner_photo", label: "Owner Photograph" },
        { id: "office_image", label: "Office Photograph" },
      ];
    case 'contractor':
      return [
        { id: "gst_certificate", label: "GST Certificate" },
        { id: "pan_card", label: "PAN Card" },
        { id: "owner_photo", label: "Owner Photograph" },
        { id: "office_image", label: "Office Images" },
        { id: "business_registration", label: "Business Registration" },
      ];
    case 'architect':
      return [
        { id: "registration_certificate", label: "Registration Certificate" },
        { id: "owner_photo", label: "Identity Document" },
        { id: "office_image", label: "Office Images" },
      ];
    case 'builder':
      return [
        { id: "gst_certificate", label: "GST Certificate" },
        { id: "company_registration", label: "Company Registration" },
        { id: "owner_photo", label: "Owner Identity" },
        { id: "office_image", label: "Office Images" },
      ];
    case 'supplier':
    case 'material_supplier':
      return [
        { id: "gst_certificate", label: "GST Certificate" },
        { id: "business_registration", label: "Business Registration" },
        { id: "owner_photo", label: "Owner Identity" },
        { id: "warehouse_image", label: "Warehouse Images" },
      ];
    case 'worker':
    case 'skilled_worker':
      return [
        { id: "aadhaar", label: "Aadhaar Card" },
        { id: "self_photo", label: "Self Photograph" },
        { id: "skill_photo", label: "Skill Photograph" },
      ];
    default:
      return [
        { id: "gst_certificate", label: "GST Certificate" },
        { id: "pan_card", label: "PAN Card" },
        { id: "business_image", label: "Office/Business Image" },
      ];
  }
};

const OPTIONAL_DOCS = [
  { id: "portfolio_document", label: "Portfolio (PDF)", requiredFor: "Trusted" },
];

export function VerificationTab({ onSwitchTab, profileData }: { onSwitchTab?: (tab: string) => void, profileData?: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const { user } = useAuthStore();
  const currentRole = user?.role || 'homeowner';
  const isBusiness = ['interior_designer', 'interior_company', 'contractor', 'architect', 'supplier', 'material_supplier', 'builder', 'business'].includes(currentRole);
  const isWorker = ['worker', 'skilled_worker'].includes(currentRole);

  const [profileCompletion, setProfileCompletion] = useState(0);

  const fetchStatus = async () => {
    try {
      const [verifRes, profileRes] = await Promise.all([
        api.get("/verification/status"),
        api.get("/user/professional-profile").catch(() => ({ data: { data: null } }))
      ]);
      setData(verifRes.data?.data);

      const pData = profileRes.data?.data;

      let fieldsToCheck = [user?.phone];
      if (pData) {
        fieldsToCheck = [user?.phone || pData.phone, pData.city, pData.district, pData.address];
        if (isBusiness) {
          fieldsToCheck.push(pData.title || pData.company_name, pData.description || pData.tagline);
        }
        if (isWorker) {
          fieldsToCheck.push(pData.skill, pData.experience_years, pData.daily_rate);
        }
      }
      
      const filledFields = fieldsToCheck.filter((v) => v && String(v).trim().length > 0).length;
      const score = fieldsToCheck.length === 0 ? 100 : Math.min(100, Math.round((filledFields / fieldsToCheck.length) * 100));
      setProfileCompletion(score);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(docType);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docType);

    try {
      await api.post("/verification/upload", formData);
      alert("Document uploaded successfully and is pending review.");
      fetchStatus();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  if (loading) return <div className="py-10 text-center text-slate-500">Loading Application Status...</div>;

  const docs = data?.documents || [];
  const getDocStatus = (type: string) => docs.find((d: any) => d.document_type === type);

  // Profile Validation Check
  const completionPercentage = profileCompletion;
  const isProfileComplete = completionPercentage >= 50;

  const role = user?.role || 'homeowner';
  const requiredDocs = getRequiredDocsForRole(role);
  const requiredDocsSubmitted = requiredDocs.every(doc => {
    const status = getDocStatus(doc.id)?.status;
    return status === 'pending' || status === 'approved';
  });

  const isVerifiedBusiness = data?.verification_level === 'verified_business' || data?.verification_level === 'trusted_professional' || data?.verification_level === 'elite_professional';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center bg-gradient-to-br from-[#0a1c3a] to-indigo-900 rounded-xl p-8 text-white shadow-lg">
        <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-green-400" />
        <h2 className="text-3xl font-bold mb-2">
          {isBusiness ? "Formal Business Verification" : "Professional Verification"}
        </h2>
        <p className="text-indigo-100 max-w-xl mx-auto">
          Applying for verification is the best way to build trust with customers. 
          {isBusiness ? " Verified businesses" : " Verified professionals"} rank higher in search results and receive a dedicated badge.
        </p>
        
        <div className="mt-6 flex justify-center gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-xs text-indigo-200 uppercase font-bold">Current Status</div>
            <div className="text-lg font-bold capitalize">
              {data?.verification_level?.replace("_", " ") || "Basic Member"}
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-xs text-indigo-200 uppercase font-bold">Trust Score</div>
            <div className="text-lg font-bold">{data?.trust_score || 0} / 100</div>
          </div>
        </div>
      </div>

      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 pb-10">
        
        {/* Step 1: Profile */}
        <div className="relative">
          <div className={`absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-white shadow-sm transition-colors ${isProfileComplete ? 'bg-green-500' : 'bg-indigo-600'}`}>
            {isProfileComplete ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <Card className={isProfileComplete ? "border-green-100 bg-green-50/30" : "border-indigo-200 shadow-md"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Profile Completion ({Math.round(completionPercentage)}%)</span>
                {isProfileComplete && <Badge className="bg-green-500">Completed</Badge>}
              </CardTitle>
              <CardDescription>We need basic details about your business before you can apply.</CardDescription>
            </CardHeader>
            <CardContent>
              {!isProfileComplete ? (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-900 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Action Required</h4>
                    <p className="text-sm text-orange-800 mt-1">Your profile is incomplete. Please add your Phone, Location, and other details in the Profile tab.</p>
                  </div>
                  {onSwitchTab && (
                    <Button onClick={() => onSwitchTab('profile')} className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap">
                      Complete Profile <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-green-700 flex items-center font-medium bg-green-50 p-3 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Your core business profile is ready.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Document Upload */}
        <div className="relative">
          <div className={`absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-white shadow-sm transition-colors ${!isProfileComplete ? 'bg-slate-300' : requiredDocsSubmitted ? 'bg-green-500' : 'bg-indigo-600'}`}>
            {requiredDocsSubmitted ? <Check className="w-5 h-5" /> : "2"}
          </div>
          <Card className={!isProfileComplete ? "opacity-50 pointer-events-none" : requiredDocsSubmitted ? "border-green-100 bg-green-50/30" : "border-indigo-200 shadow-md"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Submit Official Documents</CardTitle>
              <CardDescription>Upload the following documents for our admin team to review.</CardDescription>
            </CardHeader>
            <CardContent>
              
              {!isProfileComplete && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 rounded-lg backdrop-blur-[1px]">
                  <div className="bg-white px-6 py-3 rounded-full shadow border flex items-center text-slate-500 font-medium">
                    <Lock className="w-4 h-4 mr-2" /> Complete Step 1 First
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocs.map(doc => {
                  const currentDoc = getDocStatus(doc.id);
                  return (
                    <div key={doc.id} className={`border rounded-lg p-4 flex flex-col justify-between ${currentDoc?.status === 'approved' ? 'bg-green-50/50 border-green-200' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-900">{doc.label}</h4>
                          <Badge variant="outline" className="text-xs mt-1 text-slate-500 border-slate-200">Required</Badge>
                        </div>
                        {currentDoc?.status === "approved" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                        {currentDoc?.status === "pending" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                        {currentDoc?.status === "rejected" && <XCircle className="h-6 w-6 text-red-500" />}
                        {!currentDoc && <ShieldAlert className="h-6 w-6 text-slate-300" />}
                      </div>

                      {currentDoc?.status === "rejected" && (
                        <div className="bg-red-50 text-red-700 p-2 text-xs rounded-md mb-3 border border-red-100">
                          <strong>Rejected:</strong> {currentDoc.rejection_reason}
                        </div>
                      )}

                      <div className="mt-auto">
                        {currentDoc?.status === "approved" ? (
                          <div className="text-sm text-green-600 font-medium flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Document Verified
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, doc.id)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              disabled={uploading === doc.id || currentDoc?.status === 'pending'}
                            />
                            <Button 
                              variant={currentDoc?.status === 'rejected' ? 'destructive' : 'outline'} 
                              className={`w-full ${!currentDoc ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' : ''}`}
                              disabled={uploading === doc.id || currentDoc?.status === 'pending'}
                            >
                              {uploading === doc.id ? (
                                "Uploading..."
                              ) : currentDoc?.status === 'pending' ? (
                                "Pending Admin Review"
                              ) : (
                                <><UploadCloud className="h-4 w-4 mr-2" /> {currentDoc?.status === 'rejected' ? 'Re-upload Document' : 'Upload File'}</>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Trusted Docs */}
              <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-2">Optional: Become a Trusted Professional</h4>
                <p className="text-sm text-slate-500 mb-4">Upload your portfolio to unlock the Trusted badge and rank even higher.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OPTIONAL_DOCS.map(doc => {
                    const currentDoc = getDocStatus(doc.id);
                    return (
                      <div key={doc.id} className="border rounded-lg p-4 flex flex-col justify-between bg-slate-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">{doc.label}</h4>
                            <Badge variant="outline" className="text-xs mt-1 bg-white">Optional</Badge>
                          </div>
                          {currentDoc?.status === "approved" && <CheckCircle2 className="h-6 w-6 text-blue-500" />}
                          {currentDoc?.status === "pending" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                        </div>
                        <div className="mt-auto">
                          {currentDoc?.status === "approved" ? (
                            <div className="text-sm text-blue-600 font-medium flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Verified
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(e, doc.id)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                disabled={uploading === doc.id || currentDoc?.status === 'pending'}
                              />
                              <Button variant="outline" className="w-full bg-white" disabled={uploading === doc.id || currentDoc?.status === 'pending'}>
                                {currentDoc?.status === 'pending' ? "Pending Review" : "Upload Portfolio"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Application Status */}
        <div className="relative">
          <div className={`absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-white shadow-sm transition-colors ${!requiredDocsSubmitted ? 'bg-slate-300' : isVerifiedBusiness ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {isVerifiedBusiness ? <Check className="w-5 h-5" /> : "3"}
          </div>
          <Card className={!requiredDocsSubmitted ? "opacity-50 pointer-events-none" : isVerifiedBusiness ? "bg-green-50 border-green-200 shadow-md" : "bg-yellow-50 border-yellow-200 shadow-md"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              {!requiredDocsSubmitted ? (
                <div className="text-slate-500 flex items-center font-medium">
                  Submit all required documents to apply.
                </div>
              ) : isVerifiedBusiness ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Application Approved!</h3>
                    <p className="text-green-700 mt-1">
                      Congratulations! You are a Verified Business. Your profile now features a verification badge and ranks higher in search results.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-800">Application Under Review</h3>
                    <p className="text-yellow-700 mt-1">
                      Your documents have been submitted and are currently being reviewed by our Admin team. We will notify you once your application is processed.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
