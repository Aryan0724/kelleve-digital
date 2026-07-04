"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ContactMessagesPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading && !messages.length) return <div className="text-center p-8">Loading Contact Messages...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>Messages and queries from the public contact page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email/Phone</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className={msg.status === 'new' ? 'bg-orange-50/50' : ''}>
                <TableCell className="whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{msg.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{msg.email}</div>
                  <div className="text-xs text-slate-500">{msg.phone}</div>
                </TableCell>
                <TableCell className="font-semibold">{msg.subject || "-"}</TableCell>
                <TableCell className="max-w-md">
                  <div className="text-sm text-slate-600 line-clamp-3" title={msg.message}>{msg.message}</div>
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
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-6">
                  No contact messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
