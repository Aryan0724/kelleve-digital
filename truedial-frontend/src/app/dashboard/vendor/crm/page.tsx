"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Phone, Clock, CheckCircle, XCircle, CalendarDays, Users,
  MapPin, IndianRupee, Utensils, Wrench, Briefcase, Stethoscope,
  Filter, Search, ChevronDown, ArrowRight, MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Mock Data per category ────────────────────────────────────────────────────
const MOCK_APPOINTMENTS = [
  { id: 1, name: "Suresh Menon", type: "First Visit", date: "Today", time: "11:30 AM", reason: "Fever & Cold", status: "Waiting", phone: "9876543210" },
  { id: 2, name: "Meera Reddy", type: "Follow-up", date: "Today", time: "12:15 PM", reason: "BP Check", status: "Confirmed", phone: "9123456789" },
  { id: 3, name: "Kiran Rao", type: "Emergency", date: "Today", time: "1:00 PM", reason: "Chest pain", status: "Priority", phone: "9999900000" },
  { id: 4, name: "Anita Shah", type: "First Visit", date: "Tomorrow", time: "10:00 AM", reason: "Skin rash", status: "Pending", phone: "9800012345" },
];

const MOCK_RESERVATIONS = [
  { id: 1, name: "Amit Singh", guests: 4, date: "Today", time: "8:00 PM", requests: "Window seat", status: "Confirmed" },
  { id: 2, name: "Sneha Patil", guests: 2, date: "Today", time: "9:30 PM", requests: "Anniversary cake", status: "Pending" },
  { id: 3, name: "Karan Mehta", guests: 10, date: "Tomorrow", time: "7:30 PM", requests: "Banquet setup", status: "Confirmed" },
  { id: 4, name: "Riya Joshi", guests: 3, date: "This Weekend", time: "1:00 PM", requests: "—", status: "Pending" },
];

const MOCK_SERVICE_REQUESTS = [
  { id: 1, name: "Rohit Kumar", service: "AC Repair", address: "Andheri West, Mumbai", date: "Tomorrow, 10 AM", status: "Accepted", phone: "9876500001" },
  { id: 2, name: "Priya Verma", service: "Plumbing Issue", address: "Bandra East, Mumbai", date: "Today, 4 PM", status: "Pending", phone: "9876500002" },
  { id: 3, name: "Sandeep Nair", service: "Electrical Wiring", address: "Juhu, Mumbai", date: "This Weekend", status: "Completed", phone: "9876500003" },
  { id: 4, name: "Divya Pillai", service: "Pest Control", address: "Malad West, Mumbai", date: "Next Week", status: "Pending", phone: "9876500004" },
];

const MOCK_LEADS = [
  { id: 1, name: "Rajesh Kumar", project: "3BHK Full Interior", budget: "₹15L – ₹20L", date: "2 hrs ago", stage: "New Lead", phone: "9812345678" },
  { id: 2, name: "Sunita Gupta", project: "Office Renovation", budget: "₹50L+", date: "5 hrs ago", stage: "Site Visit Scheduled", phone: "9812345679" },
  { id: 3, name: "Kunal Shah", project: "Modular Kitchen", budget: "₹5L – ₹8L", date: "Yesterday", stage: "Quotation Sent", phone: "9812345680" },
  { id: 4, name: "Farida Malik", project: "2BHK Interior", budget: "₹10L – ₹15L", date: "2 days ago", stage: "Follow-up Needed", phone: "9812345681" },
];

const MOCK_INQUIRIES = [
  { id: 1, name: "Ananya Iyer", inquiry: "Product Pricing", date: "2 hrs ago", status: "New", phone: "9800000001" },
  { id: 2, name: "Vikram Mehta", inquiry: "Store Timings", date: "5 hrs ago", status: "Contacted", phone: "9800000002" },
  { id: 3, name: "Pooja Sharma", inquiry: "Delivery Options", date: "Yesterday", status: "Closed", phone: "9800000003" },
];

// ─── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Waiting": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Pending": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Follow-up Needed": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Confirmed": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Accepted": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Site Visit Scheduled": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Priority": "bg-red-500/10 text-red-600 border-red-500/20",
    "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Closed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "New": "bg-primary/10 text-primary border-primary/20",
    "New Lead": "bg-primary/10 text-primary border-primary/20",
    "Quotation Sent": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "Contacted": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${map[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

// ─── Appointments View (Medical) ───────────────────────────────────────────────
function AppointmentsView() {
  const [items, setItems] = useState(MOCK_APPOINTMENTS);
  const todayCount = items.filter(i => i.date === "Today").length;
  const priorityCount = items.filter(i => i.status === "Priority").length;

  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: todayCount, color: "text-blue-500" },
          { label: "Priority Cases", value: priorityCount, color: "text-red-500" },
          { label: "Pending Confirmations", value: items.filter(i => i.status === "Pending").length, color: "text-amber-500" },
          { label: "Completed Today", value: items.filter(i => i.status === "Completed").length, color: "text-emerald-500" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground flex items-center gap-2"><Stethoscope className="w-4 h-4 text-primary" /> Patient Schedule</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map(appt => (
            <div key={appt.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition ${appt.status === "Priority" ? "bg-red-500/5" : ""}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{appt.name}</span>
                  {appt.status === "Priority" && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full uppercase">URGENT</span>}
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-sm text-muted-foreground">{appt.type} • {appt.reason}</p>
                <p className="text-xs font-medium text-primary mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.date} at {appt.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {appt.status !== "Completed" && appt.status !== "Confirmed" && (
                  <button onClick={() => updateStatus(appt.id, "Confirmed")} className="px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition">Confirm</button>
                )}
                {appt.status !== "Completed" && (
                  <button onClick={() => updateStatus(appt.id, "Completed")} className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition">Mark Done</button>
                )}
                <a href={`tel:${appt.phone}`} className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reservations View (Restaurant) ───────────────────────────────────────────
function ReservationsView() {
  const [items, setItems] = useState(MOCK_RESERVATIONS);
  const todayCovers = items.filter(i => i.date === "Today").reduce((sum, r) => sum + r.guests, 0);

  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-emerald-500">{todayCovers}</div>
          <div className="text-xs text-muted-foreground mt-1">Today's Total Covers</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-amber-500">{items.filter(i => i.status === "Pending").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Awaiting Approval</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-500">{items.filter(i => i.status === "Confirmed").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Confirmed Bookings</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-foreground flex items-center gap-2"><Utensils className="w-4 h-4 text-primary" /> Upcoming Reservations</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map(res => (
            <div key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{res.name}</span>
                  <span className="px-2 py-0.5 text-xs bg-muted text-foreground rounded-full font-bold">{res.guests} Guests</span>
                  <StatusBadge status={res.status} />
                </div>
                <p className="text-xs text-muted-foreground">{res.date} at {res.time}</p>
                {res.requests !== "—" && <p className="text-xs italic text-muted-foreground mt-0.5">📝 {res.requests}</p>}
              </div>
              <div className="flex items-center gap-2">
                {res.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(res.id, "Confirmed")} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Approve</button>
                    <button onClick={() => updateStatus(res.id, "Rejected")} className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition">Decline</button>
                  </>
                )}
                {res.status === "Confirmed" && (
                  <button onClick={() => updateStatus(res.id, "Completed")} className="px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition">Mark Arrived</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Service Requests View (Home Services) ─────────────────────────────────────
function ServiceRequestsView() {
  const [items, setItems] = useState(MOCK_SERVICE_REQUESTS);
  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-amber-500">{items.filter(i => i.status === "Pending").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Pending Requests</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-500">{items.filter(i => i.status === "Accepted").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Accepted Jobs</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-emerald-500">{items.filter(i => i.status === "Completed").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Completed Jobs</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-foreground flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /> Service Requests</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map(req => (
            <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{req.name}</span>
                  <span className="text-xs font-bold text-primary">{req.service}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.address}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {req.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {req.status === "Pending" && (
                  <button onClick={() => updateStatus(req.id, "Accepted")} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Accept Job</button>
                )}
                {req.status === "Accepted" && (
                  <button onClick={() => updateStatus(req.id, "Completed")} className="px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition">Mark Complete</button>
                )}
                <a href={`tel:${req.phone}`} className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Leads Pipeline View (Real Estate) ────────────────────────────────────────
const STAGES = ["New Lead", "Contacted", "Site Visit Scheduled", "Quotation Sent", "Won", "Lost"];

function LeadsPipelineView() {
  const [items, setItems] = useState(MOCK_LEADS);
  const [search, setSearch] = useState("");

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.project.toLowerCase().includes(search.toLowerCase()));

  const moveStage = (id: number, direction: number) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const idx = STAGES.indexOf(item.stage);
      const newIdx = Math.max(0, Math.min(STAGES.length - 1, idx + direction));
      return { ...item, stage: STAGES[newIdx] };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "New Leads", value: items.filter(i => i.stage === "New Lead").length, color: "text-primary" },
          { label: "Site Visits", value: items.filter(i => i.stage === "Site Visit Scheduled").length, color: "text-blue-500" },
          { label: "Quotations Sent", value: items.filter(i => i.stage === "Quotation Sent").length, color: "text-amber-500" },
          { label: "Won Projects", value: items.filter(i => i.stage === "Won").length, color: "text-emerald-500" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <h2 className="font-bold text-foreground flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Leads Pipeline</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(lead => (
            <div key={lead.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{lead.name}</span>
                  <StatusBadge status={lead.stage} />
                </div>
                <p className="text-sm font-medium text-primary">{lead.project}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {lead.budget}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveStage(lead.id, -1)} className="px-2 py-1.5 text-xs font-bold bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition border border-border">◀ Back</button>
                <button onClick={() => moveStage(lead.id, 1)} className="px-2 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition border border-primary/20">Next ▶</button>
                <a href={`tel:${lead.phone}`} className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Generic Inquiries View ────────────────────────────────────────────────────
function InquiriesView() {
  const [items, setItems] = useState(MOCK_INQUIRIES);
  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-foreground flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Leads & Inquiries</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map(inq => (
            <div key={inq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{inq.name}</span>
                  <StatusBadge status={inq.status} />
                </div>
                <p className="text-sm text-muted-foreground">{inq.inquiry}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{inq.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {inq.status === "New" && (
                  <button onClick={() => updateStatus(inq.id, "Contacted")} className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition">Mark Contacted</button>
                )}
                {inq.status === "Contacted" && (
                  <button onClick={() => updateStatus(inq.id, "Closed")} className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition">Mark Closed</button>
                )}
                <a href={`tel:${inq.phone}`} className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main CRM Page ─────────────────────────────────────────────────────────────
export default function CrmPage() {
  const { user } = useAuth();

  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  const roles: string[] = rawRoles.map((r: any) => typeof r === "string" ? r : r?.slug || r?.name || "");

  const isMedical = roles.some(r => ["doctor", "hospital", "clinic", "dentist"].includes(r));
  const isRestaurant = roles.some(r => ["restaurant", "cafe", "bakery", "food"].includes(r));
  const isService = roles.some(r => ["worker", "skilled_worker", "plumber", "electrician", "mechanic", "cleaner"].includes(r));
  const isRealEstate = roles.some(r => ["builder", "architect", "interior_designer", "contractor", "supplier", "material_supplier"].includes(r));

  if (isMedical) return <AppointmentsView />;
  if (isRestaurant) return <ReservationsView />;
  if (isService) return <ServiceRequestsView />;
  if (isRealEstate) return <LeadsPipelineView />;
  return <InquiriesView />;
}
