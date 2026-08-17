"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Phone, Clock, CheckCircle, XCircle, CalendarDays, Users,
  MapPin, IndianRupee, Utensils, Wrench, Briefcase, Stethoscope,
  Filter, Search, ChevronDown, ArrowRight, MessageSquare,
  Power, ShoppingBag, Truck, Flame, AlertCircle,
  KanbanSquare, List, Plus, MoreVertical
} from "lucide-react";
import { Loader2, ChevronRight, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";

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

const MOCK_DELIVERY_ORDERS = [
  { id: 101, name: "Varun Sharma", items: "2x Paneer Tikka Masala, 4x Butter Naan", total: "₹780", status: "Preparing", phone: "9800011111", time: "10 mins ago" },
  { id: 102, name: "Pooja Hegde", items: "1x Veg Biryani, 1x Raita, 1x Gulab Jamun", total: "₹420", status: "Out for Delivery", phone: "9800022222", time: "25 mins ago" },
  { id: 103, name: "Rohan Das", items: "1x Family Meal Combo (4 persons)", total: "₹1,450", status: "New Order", phone: "9800033333", time: "Just now" },
];

const MOCK_SERVICE_REQUESTS = [
  { id: 1, name: "Rohit Kumar", service: "AC Repair", address: "Andheri West, Mumbai", date: "Tomorrow, 10 AM", status: "Accepted", phone: "9876500001" },
  { id: 2, name: "Priya Verma", service: "Plumbing Issue", address: "Bandra East, Mumbai", date: "Today, 4 PM", status: "Pending", phone: "9876500002" },
  { id: 3, name: "Sandeep Nair", service: "Electrical Wiring", address: "Juhu, Mumbai", date: "This Weekend", status: "Completed", phone: "9876500003" },
  { id: 4, name: "Divya Pillai", service: "Pest Control", address: "Malad West, Mumbai", date: "Next Week", status: "Pending", phone: "9876500004" },
];

const MOCK_LEADS = [
  { id: 1, name: "Rajesh Kumar", project: "Digital Marketing Package", budget: "₹25,000/mo", date: "2 hrs ago", stage: "New Lead", phone: "9812345678" },
  { id: 2, name: "Sunita Gupta", project: "Corporate Catering Contract", budget: "₹1.5L/month", date: "5 hrs ago", stage: "Visit Scheduled", phone: "9812345679" },
  { id: 3, name: "Kunal Shah", project: "Website & SEO Package", budget: "₹40,000", date: "Yesterday", stage: "Quotation Sent", phone: "9812345680" },
  { id: 4, name: "Farida Malik", project: "Premium Branding Service", budget: "₹60,000", date: "2 days ago", stage: "Follow-up Needed", phone: "9812345681" },
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
    "New Order": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Follow-up Needed": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Confirmed": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Accepted": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Preparing": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Visit Scheduled": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Priority": "bg-red-500/10 text-red-600 border-red-500/20",
    "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Closed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Delivered": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Out for Delivery": "bg-purple-500/10 text-purple-600 border-purple-500/20",
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
  const [isClinicOpen, setIsClinicOpen] = useState(true);
  const todayCount = items.filter(i => i.date === "Today").length;
  const priorityCount = items.filter(i => i.status === "Priority").length;

  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Clinic Hours & Live Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isClinicOpen ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full animate-pulse ${isClinicOpen ? "bg-emerald-500" : "bg-red-500"}`} />
          <div>
            <h3 className="font-bold text-foreground text-sm">
              {isClinicOpen ? "Clinic is Currently OPEN" : "Clinic is Currently CLOSED"}
            </h3>
            <p className="text-xs text-muted-foreground">Standard timing: Today • 9:00 AM – 8:00 PM</p>
          </div>
        </div>
        <Button
          onClick={() => setIsClinicOpen(!isClinicOpen)}
          variant="outline"
          className="text-xs font-bold h-9"
        >
          {isClinicOpen ? "Pause Walk-in Check-ins" : "Resume Walk-in Check-ins"}
        </Button>
      </div>

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

// ─── Reservations & Delivery Orders View (Restaurant) ─────────────────────────
function ReservationsView() {
  const [tab, setTab] = useState<"reservations" | "delivery">("reservations");
  const [items, setItems] = useState(MOCK_RESERVATIONS);
  const [orders, setOrders] = useState(MOCK_DELIVERY_ORDERS);

  const todayCovers = items.filter(i => i.date === "Today").reduce((sum, r) => sum + r.guests, 0);
  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));
  const updateOrder = (id: number, status: string) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-tab switch: Table Reservations vs Delivery Orders */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setTab("reservations")}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            tab === "reservations" ? "border-[#E8701A] text-[#E8701A]" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Utensils className="w-4 h-4" /> Table Reservations ({items.filter(i => i.status === "Pending").length})
        </button>
        <button
          onClick={() => setTab("delivery")}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            tab === "delivery" ? "border-[#E8701A] text-[#E8701A]" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Truck className="w-4 h-4" /> Direct Delivery Orders ({orders.filter(o => o.status === "New Order").length})
        </button>
      </div>

      {tab === "reservations" ? (
        <>
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
        </>
      ) : (
        /* Delivery Orders Tracking View */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground flex items-center gap-2"><Truck className="w-4 h-4 text-[#E8701A]" /> Direct Commission-Free Orders</h2>
            <span className="text-xs text-muted-foreground font-semibold">0% platform fee</span>
          </div>
          <div className="divide-y divide-border">
            {orders.map(order => (
              <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Order #{order.id} • {order.name}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{order.items}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>Total: <strong className="text-[#E8701A]">{order.total}</strong></span>
                    <span>•</span>
                    <span>Ordered {order.time}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "New Order" && (
                    <button onClick={() => updateOrder(order.id, "Preparing")} className="px-3 py-1.5 text-xs font-bold bg-[#E8701A] text-white rounded-lg hover:bg-[#E8701A]/90 transition">Accept & Prepare</button>
                  )}
                  {order.status === "Preparing" && (
                    <button onClick={() => updateOrder(order.id, "Out for Delivery")} className="px-3 py-1.5 text-xs font-bold bg-purple-500/10 text-purple-600 rounded-lg border border-purple-500/20 transition">Out for Delivery</button>
                  )}
                  {order.status === "Out for Delivery" && (
                    <button onClick={() => updateOrder(order.id, "Delivered")} className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20 transition">Mark Delivered</button>
                  )}
                  <a href={`tel:${order.phone}`} className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white transition">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Service Requests View with "Accepting Jobs" Toggle (Home Services) ────────
function ServiceRequestsView() {
  const [items, setItems] = useState(MOCK_SERVICE_REQUESTS);
  const [acceptingJobs, setAcceptingJobs] = useState(true);
  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Prominent "Accepting Jobs" Online/Offline Toggle Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors ${
        acceptingJobs
          ? "bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-background border-emerald-500/30"
          : "bg-muted/50 border-border"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            acceptingJobs ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-muted-foreground/20 text-muted-foreground"
          }`}>
            <Power className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-base">
                {acceptingJobs ? "You are ONLINE & Accepting Service Jobs" : "You are currently OFFLINE"}
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                acceptingJobs ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {acceptingJobs ? "Live" : "Paused"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {acceptingJobs
                ? "Customers in your 15km radius can see your profile and request service instantly."
                : "Your profile is hidden from instant booking searches until you go back online."
              }
            </p>
          </div>
        </div>
        <Button
          onClick={() => setAcceptingJobs(!acceptingJobs)}
          className={`h-11 px-6 rounded-xl font-bold transition shadow-sm ${
            acceptingJobs
              ? "bg-card border border-border text-foreground hover:bg-muted"
              : "bg-[#E8701A] hover:bg-[#E8701A]/90 text-white"
          }`}
        >
          {acceptingJobs ? "Go Offline (Pause Jobs)" : "Go Online (Accept Jobs)"}
        </Button>
      </div>

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
const STAGES = ["New Lead", "Contacted", "Visit Scheduled", "Quotation Sent", "Won", "Lost"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-blue-500",
  "Contacted": "bg-amber-500",
  "Visit Scheduled": "bg-purple-500",
  "Quotation Sent": "bg-indigo-500",
  "Won": "bg-emerald-500",
  "Lost": "bg-red-500"
};

function LeadsPipelineView() {
  const [items, setItems] = useState(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-primary" /> CRM & Leads Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">Manage your inquiries and convert them into customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-muted transition shadow-sm">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search leads..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-80 pl-9 pr-4 py-2 bg-background border-border rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="flex bg-background border border-border rounded-lg overflow-hidden">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 transition ${viewMode === 'kanban' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <KanbanSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 transition ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {STAGES.filter(s => s !== "Lost").map(stage => (
            <div key={stage} className="min-w-[300px] w-[300px] shrink-0 snap-center flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <div className={`w-2.5 h-2.5 rounded-full ${STAGE_COLORS[stage]}`}></div>
                  {stage}
                </h3>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {filtered.filter(l => l.stage === stage).length}
                </span>
              </div>
              <div className="space-y-3 flex-1 bg-muted/30 rounded-xl p-3 border border-border/50">
                {filtered.filter(l => l.stage === stage).map(lead => (
                  <div key={lead.id} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${STAGE_COLORS[stage]}`}></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-foreground">{lead.name}</h4>
                      <button className="text-muted-foreground hover:text-primary transition opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-medium text-primary mb-1">{lead.project}</p>
                    <p className="text-[10px] text-muted-foreground mb-3 font-medium bg-muted inline-block px-2 py-0.5 rounded border border-border/50">Budget: {lead.budget}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border border-dashed">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {lead.date}
                      </span>
                      <div className="flex gap-1.5 items-center">
                        <button onClick={() => moveStage(lead.id, -1)} className="w-6 h-6 bg-muted text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition flex items-center justify-center font-bold">◀</button>
                        <button onClick={() => moveStage(lead.id, 1)} className="w-6 h-6 bg-muted text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition flex items-center justify-center font-bold">▶</button>
                        <a href={`tel:${lead.phone}`} className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition ml-1">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.filter(l => l.stage === stage).length === 0 && (
                  <div className="h-24 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center text-muted-foreground text-xs font-medium">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Interest</th>
                  <th className="px-6 py-4 font-medium">Budget</th>
                  <th className="px-6 py-4 font-medium">Added On</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-muted/30 transition">
                    <td className="px-6 py-4 font-semibold text-foreground">{lead.name}</td>
                    <td className="px-6 py-4 font-medium text-primary">{lead.project}</td>
                    <td className="px-6 py-4 text-muted-foreground flex items-center gap-1 mt-1"><IndianRupee className="w-3 h-3" /> {lead.budget}</td>
                    <td className="px-6 py-4 text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {lead.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.stage} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => moveStage(lead.id, -1)} className="px-2 py-1.5 text-xs font-bold bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition border border-border">◀</button>
                        <button onClick={() => moveStage(lead.id, 1)} className="px-2 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition border border-primary/20">▶</button>
                        <a href={`tel:${lead.phone}`} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition ml-2">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Generic Inquiries View ────────────────────────────────────────────────────
function InquiriesView() {
  const [items, setItems] = useState(MOCK_INQUIRIES);
  const updateStatus = (id: number, status: string) => setItems(items.map(i => i.id === id ? { ...i, status } : i));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/crm/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/crm/leads/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      
      // Update local state
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-yellow-500 text-white';
      case 'interested': return 'bg-[#E8701A] text-white';
      case 'converted': return 'bg-green-500 text-white';
      case 'lost': return 'bg-slate-500 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const statuses = ['new', 'contacted', 'interested', 'converted', 'lost'];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CRM & Leads</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer pipeline and incoming inquiries.
        </p>
      </div>

      {/* Kanban Board View */}
      <div className="flex overflow-x-auto pb-8 space-x-6">
        {statuses.map(status => {
          const statusLeads = leads.filter(l => l.status === status);
          return (
            <div key={status} className="flex-shrink-0 w-80 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white capitalize">{status}</h3>
                <Badge variant="secondary" className="bg-white dark:bg-slate-800 text-slate-500">{statusLeads.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {statusLeads.map(lead => (
                  <Card key={lead.id} className="border-0 shadow-sm bg-white dark:bg-[#0a1c3a]/70 dark:border dark:border-white/10 hover:shadow-md transition-shadow cursor-grab">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="h-8 w-8 text-slate-400" />
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white text-sm">{lead.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <Badge variant="outline" className="text-[10px] py-0">{lead.source}</Badge>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Status Action Buttons (Quick move to next) */}
                      <div className="mt-4 flex gap-1 justify-end border-t border-slate-100 dark:border-slate-800 pt-2">
                        <select 
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-[#E8701A]"
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statusLeads.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
