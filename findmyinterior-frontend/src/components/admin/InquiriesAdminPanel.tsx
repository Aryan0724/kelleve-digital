"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

export function InquiriesAdminPanel() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/inquiries");
      setInquiries(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleResolve = async (id: number) => {
    try {
      await api.patch(`/admin/inquiries/${id}/resolve`);
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, is_read: true });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to resolve inquiry");
    }
  };

  if (loading && !inquiries.length) return <div className="text-center p-8">Loading Inquiries...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lead Inquiries</CardTitle>
          <CardDescription>
            Manage lead inquiries (leads) sent by users to professionals, listings, or projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Customer</TableHead>
                <TableHead className="whitespace-nowrap">Target Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px] whitespace-nowrap">Status</TableHead>
                <TableHead className="w-[100px] whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((item) => (
                <TableRow key={item.id} className={!item.is_read ? 'bg-orange-50/50' : ''}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-slate-500 text-sm">{item.email}</div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-xs text-slate-600">
                    {item.inquirable_type?.split('\\').pop() || "Unknown"} #{item.inquirable_id}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate text-sm text-slate-600" title={item.message}>{item.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_read ? 'default' : 'secondary'} className={!item.is_read ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                      {item.is_read ? 'READ' : 'NEW'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(item)} className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {inquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                    No lead inquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Inquiry</DialogTitle>
            <DialogDescription>
              Submitted by {selectedInquiry?.name} ({selectedInquiry?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <Badge variant={selectedInquiry?.is_read ? 'default' : 'secondary'} className={!selectedInquiry?.is_read ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                {selectedInquiry?.is_read ? 'READ' : 'NEW'}
              </Badge>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between border">
               <span className="text-slate-600 font-medium">Inquiry Target:</span>
               <span className="font-bold text-slate-900">{selectedInquiry?.inquirable_type?.split('\\').pop()} #{selectedInquiry?.inquirable_id}</span>
            </div>
            <div>
              <span className="text-slate-700 block font-semibold mb-2 text-base">Message:</span>
              <div className="bg-white border p-4 rounded-lg whitespace-pre-wrap text-slate-800 leading-relaxed shadow-sm">
                {selectedInquiry?.message}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close</Button>
            {!selectedInquiry?.is_read && (
              <Button onClick={() => handleResolve(selectedInquiry.id)}>
                Mark as Read
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
