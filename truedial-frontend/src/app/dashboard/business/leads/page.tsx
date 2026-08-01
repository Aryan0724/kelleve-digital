"use client";

import { useState } from "react";
import { Users, Phone, Mail, Clock, MessageSquare, CheckCircle2, Send, Search, Filter, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    { 
      id: 1, 
      name: "Arjun Mehta", 
      phone: "+91 9876543210", 
      email: "arjun.m@example.com", 
      message: "Hi, I am looking to book an interior consultation for a 3BHK apartment in Mumbai. Need quotation for complete woodwork and kitchen.", 
      status: "New", 
      date: "10 mins ago",
      budget: "₹5L - ₹10L",
      projectType: "Residential"
    },
    { 
      id: 2, 
      name: "Sneha Kapoor", 
      phone: "+91 9123456789", 
      email: "sneha.k@example.com", 
      message: "Can you share your latest catalog and material specifications for commercial office renovation?", 
      status: "Contacted", 
      date: "2 hours ago",
      budget: "₹10L+",
      projectType: "Commercial"
    },
    { 
      id: 3, 
      name: "Rahul Verma", 
      phone: "+91 9988776655", 
      email: "rahul.v@example.com", 
      message: "Need emergency quotation for false ceiling and lighting in Delhi showroom.", 
      status: "Converted", 
      date: "1 day ago",
      budget: "₹2L - ₹5L",
      projectType: "Commercial"
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.phone.includes(searchQuery) ||
                          lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setToastMessage(`Lead #${id} status updated to ${newStatus}`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    setTimeout(() => {
      setSendingReply(false);
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Contacted" } : l));
      setToastMessage(`Reply sent to ${selectedLead.name} via SMS & In-App Message!`);
      setSelectedLead(null);
      setReplyMessage("");
      setTimeout(() => setToastMessage(""), 3500);
    }, 800);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    converted: leads.filter(l => l.status === "Converted").length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Leads & Customer Inquiries</h1>
          <p className="text-muted-foreground text-sm">Two-way messaging with clients who contacted your TrueDial listing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/40 text-sm py-1.5 px-3">
            Total: {stats.total}
          </Badge>
          <Badge className="bg-red-500/20 text-red-500 border-red-500/40 text-sm py-1.5 px-3">
            New: {stats.new}
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/40 text-sm py-1.5 px-3">
            Contacted: {stats.contacted}
          </Badge>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/40 text-sm py-1.5 px-3">
            Converted: {stats.converted}
          </Badge>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="premium-card p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10" 
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          {["All", "New", "Contacted", "Converted", "Closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.length === 0 ? (
          <div className="premium-card p-12 text-center text-muted-foreground rounded-xl">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No inquiries found matching your filters.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className={`premium-card p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start transition hover:border-primary/40 ${
                lead.status === "New" ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex-1 w-full">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {lead.name}
                        <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                          {lead.projectType}
                        </span>
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary transition">
                          <Phone className="w-3.5 h-3.5"/> {lead.phone}
                        </a>
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary transition">
                          <Mail className="w-3.5 h-3.5"/> {lead.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold">
                      Budget: {lead.budget}
                    </Badge>
                    {lead.status === "New" && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                    {lead.status === "Contacted" && <Badge className="bg-blue-500/20 text-blue-600 border-blue-200">Contacted</Badge>}
                    {lead.status === "Converted" && <Badge className="bg-green-500/20 text-green-600 border-green-200">Converted</Badge>}
                    {lead.status === "Closed" && <Badge className="bg-muted text-muted-foreground">Closed</Badge>}
                  </div>
                </div>

                <div className="mt-3 p-4 bg-muted/40 rounded-xl text-sm text-foreground border border-border/50">
                  <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    Client Inquiry:
                  </span>
                  "{lead.message}"
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5 w-full md:w-52 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <div className="text-xs text-muted-foreground flex items-center gap-1 md:justify-end mb-1">
                  <Clock className="w-3.5 h-3.5" /> {lead.date}
                </div>
                
                <Button 
                  onClick={() => setSelectedLead(lead)} 
                  className="w-full flex items-center justify-center gap-2 shadow-sm font-semibold"
                >
                  <MessageSquare className="w-4 h-4" /> Reply / Message
                </Button>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {lead.status !== "Contacted" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(lead.id, "Contacted")}
                      className="text-xs font-medium"
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {lead.status !== "Converted" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(lead.id, "Converted")}
                      className="text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      Convert Lead
                    </Button>
                  )}
                  {lead.status !== "Closed" && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStatusChange(lead.id, "Closed")}
                      className="text-xs font-medium text-muted-foreground col-span-2"
                    >
                      Close Lead
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply to Lead Dialog Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Reply to {selectedLead.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedLead.phone} • {selectedLead.email}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-muted/40 p-3 rounded-lg mb-4 text-xs text-muted-foreground border border-border">
              <span className="font-semibold text-foreground">Original Message: </span>
              "{selectedLead.message}"
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Your Reply Message (SMS + Email + In-App Notification)
                </label>
                <Textarea 
                  rows={4} 
                  placeholder="Hi Arjun, thanks for reaching out to us on TrueDial! We would love to schedule a site visit and share an estimate..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="bg-background text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2.5 rounded-lg border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Your reply is delivered instantly via verified TrueDial business routing.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedLead(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={sendingReply}
                  className="flex items-center gap-2"
                >
                  {sendingReply ? "Sending..." : "Send Reply"}
                  {!sendingReply && <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
