"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

export function ContactMessagesPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/contact-messages");
      setMessages(res.data.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/admin/contact-messages/${id}/status`, { status: newStatus });
      fetchMessages();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const handleViewMessage = async (msg: any) => {
    setSelectedMessage(msg);
    // Automatically mark as read if it's new
    if (msg.status === 'new') {
      await handleStatusChange(msg.id, 'read');
      // Update local state to immediately reflect
      setSelectedMessage({ ...msg, status: 'read' });
    }
  };

  if (loading && !messages.length) return <div className="text-center p-8">Loading Contact Messages...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Messages and queries from the public contact page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email/Phone</TableHead>
                  <TableHead className="whitespace-nowrap">Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[150px] whitespace-nowrap">Status</TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id} className={msg.status === 'new' ? 'bg-orange-50/50' : ''}>
                    <TableCell className="whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{msg.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <div className="text-sm truncate" title={msg.email}>{msg.email}</div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">{msg.phone}</div>
                    </TableCell>
                    <TableCell className="font-semibold max-w-[200px] truncate" title={msg.subject}>{msg.subject || "-"}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-slate-600 line-clamp-1" title={msg.message}>{msg.message}</div>
                    </TableCell>
                  <TableCell>
                    <Select value={msg.status} onValueChange={(val) => handleStatusChange(msg.id, val)}>
                      <SelectTrigger className={`h-8 text-xs ${msg.status === 'new' ? 'bg-orange-100 text-orange-800' : msg.status === 'read' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewMessage(msg)} className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                    No contact messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || "Contact Message"}</DialogTitle>
            <DialogDescription>
              Sent on {selectedMessage ? new Date(selectedMessage.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4 text-sm">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <span className="text-slate-500 block text-xs font-semibold mb-1">Name</span>
                <span className="font-medium">{selectedMessage?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold mb-1">Email</span>
                <span>{selectedMessage?.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold mb-1">Phone</span>
                <span>{selectedMessage?.phone || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold mb-1">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${selectedMessage?.status === 'new' ? 'bg-orange-100 text-orange-800' : selectedMessage?.status === 'read' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {selectedMessage?.status?.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-slate-700 block font-semibold mb-2 text-base">Message:</span>
              <div className="bg-white border p-4 rounded-lg whitespace-pre-wrap text-slate-800 leading-relaxed shadow-sm">
                {selectedMessage?.message}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
            {selectedMessage?.status !== 'resolved' && (
              <Button onClick={() => {
                handleStatusChange(selectedMessage.id, 'resolved');
                setSelectedMessage({ ...selectedMessage, status: 'resolved' });
              }}>
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
