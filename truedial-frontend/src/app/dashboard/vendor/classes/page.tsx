"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, Users, Plus, Edit2, 
  Trash2, UserCheck, PlayCircle, Flame, X, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const INITIAL_CLASSES = [
  {
    id: 1,
    name: "Morning HIIT",
    instructor: "Vikram S.",
    time: "06:00 AM - 07:00 AM",
    capacity: 20,
    enrolled: 18,
    status: "Active",
    type: "Cardio"
  },
  {
    id: 2,
    name: "Power Yoga",
    instructor: "Anjali M.",
    time: "07:30 AM - 08:30 AM",
    capacity: 15,
    enrolled: 15,
    status: "Full",
    type: "Yoga"
  },
  {
    id: 3,
    name: "Strength Training",
    instructor: "Rahul D.",
    time: "05:00 PM - 06:30 PM",
    capacity: 25,
    enrolled: 12,
    status: "Upcoming",
    type: "Weights"
  },
  {
    id: 4,
    name: "Zumba Dance",
    instructor: "Priya K.",
    time: "07:00 PM - 08:00 PM",
    capacity: 30,
    enrolled: 28,
    status: "Upcoming",
    type: "Cardio"
  }
];

export default function ClassSchedulePage() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    instructor: "",
    time: "06:00 AM - 07:00 AM",
    capacity: 20,
    enrolled: 0,
    type: "Cardio",
    status: "Active"
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("truedial_vendor_classes");
      if (saved) {
        setClasses(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenCreate = () => {
    setEditingClass(null);
    setForm({
      name: "",
      instructor: "",
      time: "06:00 AM - 07:00 AM",
      capacity: 20,
      enrolled: 0,
      type: "Cardio",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingClass(item);
    setForm({
      name: item.name,
      instructor: item.instructor,
      time: item.time,
      capacity: item.capacity,
      enrolled: item.enrolled,
      type: item.type,
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    let updatedList;
    if (editingClass) {
      updatedList = classes.map(c => c.id === editingClass.id ? { ...c, ...form } : c);
      showToast(`Class "${form.name}" updated!`);
    } else {
      const newClass = {
        id: Date.now(),
        ...form,
        enrolled: Number(form.enrolled) || 0,
        capacity: Number(form.capacity) || 20
      };
      updatedList = [newClass, ...classes];
      showToast(`New class "${form.name}" added to schedule!`);
    }

    setClasses(updatedList);
    localStorage.setItem("truedial_vendor_classes", JSON.stringify(updatedList));
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this class/batch?")) {
      const updatedList = classes.filter(c => c.id !== id);
      setClasses(updatedList);
      localStorage.setItem("truedial_vendor_classes", JSON.stringify(updatedList));
      showToast("Class removed from schedule.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Full': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            Class & Batch Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your daily fitness classes, training batches, instructors, and capacity.
          </p>
        </div>
        <div className="flex gap-2">
          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-40 bg-white dark:bg-slate-900 text-xs" />
          <Button 
            onClick={handleOpenCreate}
            className="bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Class
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-black text-orange-500">{classes.length}</div>
          <div className="text-xs text-slate-500 font-bold mt-1 uppercase">Classes Today</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-black text-blue-500">
            {classes.reduce((sum, c) => sum + Number(c.enrolled || 0), 0)}
          </div>
          <div className="text-xs text-slate-500 font-bold mt-1 uppercase">Total Bookings</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm md:col-span-2 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Now
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {classes.find(c => c.status === "Active")?.name || "Morning HIIT"}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {classes.find(c => c.status === "Active")?.enrolled || 18}/{classes.find(c => c.status === "Active")?.capacity || 20}
            </span>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Attendance</div>
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const pct = Math.round((Number(cls.enrolled) / Number(cls.capacity)) * 100) || 0;
          return (
            <div 
              key={cls.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(cls.status)}`}>
                      {cls.status}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
                      {cls.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">{cls.type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Class"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cls.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete Class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Instructor: <strong className="text-slate-900 dark:text-white font-bold">{cls.instructor}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Booked Slots</span>
                  <span className="text-slate-900 dark:text-white font-black">{cls.enrolled} / {cls.capacity} ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-rose-500" : pct >= 75 ? "bg-orange-500" : "bg-emerald-500"}`} 
                    style={{ width: `${Math.min(pct, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CLASS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingClass ? "Edit Class / Batch" : "Create New Class / Batch"}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Class / Batch Name *
                </label>
                <Input 
                  placeholder="e.g. Evening Crossfit & Conditioning"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Instructor Name *
                  </label>
                  <Input 
                    placeholder="e.g. Vikram S."
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Category / Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Weights">Weights & Strength</option>
                    <option value="Zumba">Zumba & Dance</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Crossfit">Crossfit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Time Slot (Schedule) *
                </label>
                <Input 
                  placeholder="e.g. 06:00 PM - 07:30 PM"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Total Capacity
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Enrolled
                  </label>
                  <Input 
                    type="number"
                    min="0"
                    value={form.enrolled}
                    onChange={(e) => setForm({ ...form, enrolled: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-[#E05A1B] hover:bg-[#c94d13] text-white text-xs font-bold"
                >
                  {editingClass ? "Update Class" : "Save Class"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
