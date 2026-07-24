import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileText, ExternalLink, RefreshCw } from "lucide-react";
import api from "@/lib/api";

export function VerificationAdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/verifications?filter=${filter}`);
      setUsers(res.data.data?.data || []);
    } catch (e: any) {
      console.error(e);
      alert("Error fetching verifications: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const handleApproveDoc = async (id: number) => {
    try {
      await api.patch(`/admin/verifications/documents/${id}/approve`);
      fetchVerifications();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const handleRejectDoc = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await api.patch(`/admin/verifications/documents/${id}/reject`, { rejection_reason: reason });
      fetchVerifications();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const handleApproveBusiness = async (id: number) => {
    if (!confirm("Force approve this user as Verified Business?")) return;
    try {
      await api.patch(`/admin/verifications/users/${id}/approve-business`);
      fetchVerifications();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const handleRevokeBusiness = async (id: number) => {
    if (!confirm("Revoke Verified Business status?")) return;
    try {
      await api.patch(`/admin/verifications/users/${id}/revoke-business`);
      fetchVerifications();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const handleViewDoc = async (id: number) => {
    setLoadingDocId(id);
    try {
      const res = await api.get(`/admin/verifications/documents/${id}`);
      const docData = res.data.data;
      if (docData && docData.file_path) {
        setViewingDoc(docData.file_path);
      } else {
        alert("Document not found.");
      }
    } catch (e: any) {
      alert("Error loading document: " + e.message);
    } finally {
      setLoadingDocId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-4 overflow-x-auto">
        <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>Pending Docs</Button>
        <Button variant={filter === "verified" ? "default" : "outline"} onClick={() => setFilter("verified")}>Verified Businesses</Button>
        <Button variant={filter === "rejected" ? "default" : "outline"} onClick={() => setFilter("rejected")}>Rejected Docs</Button>
        <Button variant={filter === "elite" ? "default" : "outline"} onClick={() => setFilter("elite")}>Elite Pros</Button>
        <Button variant={filter === "low_trust" ? "default" : "outline"} onClick={() => setFilter("low_trust")}>Low Trust (&lt;30)</Button>
        <Button variant="ghost" onClick={fetchVerifications}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500">Loading verifications...</div>
      ) : users.length === 0 ? (
        <div className="p-10 text-center text-slate-500">No records found for this filter.</div>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{user.name} <span className="text-sm font-normal text-slate-500">({user.email})</span></h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">Level: {user.verification_level?.replace("_", " ")}</Badge>
                      <Badge variant={user.trust_score > 70 ? "default" : "secondary"}>Trust: {user.trust_score}/100</Badge>
                      <Badge variant="outline">Profile: {user.profile_completion_score}%</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.is_verified_business ? (
                      <Button size="sm" onClick={() => handleApproveBusiness(user.id)} className="bg-blue-600 hover:bg-blue-700">Force Business Verify</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleRevokeBusiness(user.id)} className="text-red-600">Revoke Business</Button>
                    )}
                  </div>
                </div>

                {user.documents && user.documents.length > 0 ? (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-slate-700">Uploaded Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {user.documents.map((doc: any) => (
                        <div key={doc.id} className="border bg-white p-3 rounded-md shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm capitalize">{doc.document_type.replace(/_/g, " ")}</span>
                            <Badge variant={doc.status === "approved" ? "default" : doc.status === "rejected" ? "destructive" : "secondary"}>
                              {doc.status}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <div className="flex-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full" 
                                onClick={() => handleViewDoc(doc.id)}
                                disabled={loadingDocId === doc.id}
                              >
                                {loadingDocId === doc.id ? (
                                  <><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Loading...</>
                                ) : (
                                  <><ExternalLink className="h-3 w-3 mr-1" /> View</>
                                )}
                              </Button>
                            </div>
                            {doc.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 px-2" onClick={() => handleApproveDoc(doc.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" className="px-2" onClick={() => handleRejectDoc(doc.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                          {doc.rejection_reason && (
                            <div className="text-xs text-red-600 mt-2 bg-red-50 p-1 rounded">Reason: {doc.rejection_reason}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">No documents uploaded yet.</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setViewingDoc(null)}>
          <div className="relative max-w-full max-h-full">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-slate-300 bg-slate-800/50 rounded-full p-1 transition-colors" 
              onClick={() => setViewingDoc(null)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={viewingDoc} 
              alt="Verification Document" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl bg-white" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
