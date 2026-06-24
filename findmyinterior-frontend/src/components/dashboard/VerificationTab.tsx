"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ShieldAlert, ShieldCheck, UploadCloud, XCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api";

const REQUIRED_DOCS = [
  { id: "gst_certificate", label: "GST Certificate", requiredFor: "Business" },
  { id: "pan_card", label: "PAN Card", requiredFor: "Business" },
  { id: "business_logo", label: "Business Logo", requiredFor: "Business" },
  { id: "business_image", label: "Office/Business Image", requiredFor: "Business" },
  { id: "owner_photo", label: "Owner/Proprietor Photo", requiredFor: "Business" },
  { id: "portfolio_document", label: "Portfolio (PDF)", requiredFor: "Trusted" },
];

export function VerificationTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/verification/status");
      setData(res.data.data);
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
      await api.post("/verification/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded successfully and is pending review.");
      fetchStatus();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  if (loading) return <div>Loading Verification Status...</div>;

  const docs = data?.documents || [];
  const getDocStatus = (type: string) => docs.find((d: any) => d.document_type === type);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              Verification Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 capitalize">
              {data?.verification_level?.replace("_", " ") || "Basic Member"}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Higher verification levels boost your ranking in search results.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Trust Score</span>
              <span className={`font-bold text-lg ${data?.trust_score > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                {data?.trust_score || 0}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={data?.trust_score || 0} className="h-3 mb-2" />
            <p className="text-xs text-slate-500">
              Determined by Profile Completion, Verification Level, Reviews, and Projects.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Profile Completion</span>
              <span className="font-bold text-lg text-indigo-600">{data?.profile_completion_score || 0}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={data?.profile_completion_score || 0} className="h-3 mb-2" />
            <p className="text-xs text-slate-500">
              A 100% complete profile guarantees higher visibility and more leads.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload your documents to unlock higher verification tiers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED_DOCS.map(doc => {
              const currentDoc = getDocStatus(doc.id);
              
              return (
                <div key={doc.id} className="border rounded-lg p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{doc.label}</h4>
                      <Badge variant="outline" className="text-xs mt-1">For {doc.requiredFor}</Badge>
                    </div>
                    {currentDoc?.status === "approved" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                    {currentDoc?.status === "pending" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                    {currentDoc?.status === "rejected" && <XCircle className="h-6 w-6 text-red-500" />}
                    {!currentDoc && <ShieldAlert className="h-6 w-6 text-slate-300" />}
                  </div>

                  {currentDoc?.status === "rejected" && (
                    <div className="bg-red-50 text-red-700 p-2 text-xs rounded-md mb-3">
                      <strong>Rejected:</strong> {currentDoc.rejection_reason}
                    </div>
                  )}

                  <div className="mt-auto">
                    {currentDoc?.status === "approved" ? (
                      <div className="text-sm text-green-600 font-medium flex items-center">
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
                        <Button 
                          variant={currentDoc?.status === 'rejected' ? 'destructive' : 'outline'} 
                          className="w-full"
                          disabled={uploading === doc.id || currentDoc?.status === 'pending'}
                        >
                          {uploading === doc.id ? (
                            "Uploading..."
                          ) : currentDoc?.status === 'pending' ? (
                            "Pending Review"
                          ) : (
                            <><UploadCloud className="h-4 w-4 mr-2" /> {currentDoc?.status === 'rejected' ? 'Re-upload' : 'Upload File'}</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
