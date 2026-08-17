"use client";

import React, { useState } from "react";
import { 
  Calendar, Clock, Users, Plus, Edit2, 
  Trash2, UserCheck, PlayCircle, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MOCK_CLASSES = [
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
  const [classes, setClasses] = useState(MOCK_CLASSES);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            Class & Batch Schedule
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your daily fitness classes, instructors, and capacity.
          </p>
        </div>
        <div className="flex gap-2">
          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-40 bg-white dark:bg-slate-900" />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Class
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-orange-500">{classes.length}</div>
          <div className="text-sm text-slate-500 font-medium">Classes Today</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-blue-500">
            {classes.reduce((sum, c) => sum + c.enrolled, 0)}
          </div>
          <div className="text-sm text-slate-500 font-medium">Total Bookings</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm md:col-span-2 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Active Now</div>
            <div className="text-orange-500 font-semibold mt-1 flex items-center">
              <PlayCircle className="w-4 h-4 mr-1 animate-pulse" /> Morning HIIT
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">18/20</div>
            <div className="text-xs text-slate-500">Attendance</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge className={`mb-2 border-0 ${getStatusBadge(cls.status)}`}>{cls.status}</Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cls.name}</h3>
                <div className="text-sm font-semibold text-slate-500 mt-1">{cls.type}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500"><Edit2 className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 mr-3 text-slate-400" />
                <span className="font-medium">{cls.time}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <UserCheck className="w-4 h-4 mr-3 text-slate-400" />
                <span>Instructor: <strong className="text-slate-900 dark:text-white">{cls.instructor}</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium flex items-center"><Users className="w-4 h-4 mr-1" /> Booked</span>
                <span className="font-bold text-slate-900 dark:text-white">{cls.enrolled} / {cls.capacity}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${cls.enrolled >= cls.capacity ? 'bg-red-500' : 'bg-orange-500'}`} 
                  style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
