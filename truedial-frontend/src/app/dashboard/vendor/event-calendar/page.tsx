"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, MapPin, Users, Clock, 
  ChevronLeft, ChevronRight, Plus, Camera, Music, Video, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_EVENTS = [
  {
    id: "EV-100",
    title: "Sharma Wedding Reception",
    type: "Wedding",
    date: "15 Aug 2026",
    time: "18:00 - 23:00",
    location: "Taj Lands End, Bandra",
    status: "Confirmed",
    team: 4
  },
  {
    id: "EV-101",
    title: "Corporate Annual Gala",
    type: "Corporate",
    date: "18 Aug 2026",
    time: "19:00 - 22:00",
    location: "JW Marriott, Juhu",
    status: "Confirmed",
    team: 3
  },
  {
    id: "EV-102",
    title: "Pre-wedding Shoot (Rahul & Sneha)",
    type: "Photoshoot",
    date: "22 Aug 2026",
    time: "06:00 - 10:00",
    location: "Sanjay Gandhi National Park",
    status: "Tentative",
    team: 2
  }
];

export default function EventCalendarPage() {
  const [events] = useState(MOCK_EVENTS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Tentative': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Completed': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Wedding': return <Star className="w-4 h-4" />;
      case 'Photoshoot': return <Camera className="w-4 h-4" />;
      case 'Corporate': return <Users className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-pink-500" />
            Event Calendar & Planner
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your event bookings, team assignments, and schedules.
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold h-10 px-6 shadow-md shadow-pink-500/20">
          <Plus className="w-4 h-4 mr-2" /> New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">August 2026</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-semibold text-slate-400 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasEvent = events.some(e => e.date.includes(`${day} Aug`));
              return (
                <div 
                  key={day} 
                  className={`
                    h-10 rounded-lg flex items-center justify-center text-sm transition cursor-pointer
                    ${hasEvent ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Quick Stats</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Upcoming Events</span>
              <span className="font-bold text-slate-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Pending Approvals</span>
              <span className="font-bold text-amber-500">3</span>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Upcoming Bookings</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-200">All</Badge>
              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent">Weddings</Badge>
              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent">Corporate</Badge>
            </div>
          </div>

          {events.map(event => (
            <div key={event.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border-l-4 border-l-pink-500 border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`px-2 py-0.5 border-0 text-[10px] uppercase tracking-wider ${getStatusColor(event.status)}`}>{event.status}</Badge>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{event.type}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-pink-500 transition">{event.title}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-slate-400" /> <span className="font-medium">{event.date}</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> {event.time}</div>
                    <div className="flex items-start sm:col-span-2"><MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5" /> {event.location}</div>
                  </div>
                </div>
                
                <div className="md:w-48 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-4">
                  <div className="mb-4">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 md:text-right">Assigned Team</div>
                    <div className="flex -space-x-2 md:justify-end">
                      {Array.from({ length: event.team }).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-[#0a1c3a] flex items-center justify-center text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full text-pink-600 border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-900/10">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
