"use client";

import React, { useState } from "react";
import { 
  GraduationCap, CalendarDays, BookOpen, Users, 
  Plus, Video, Clock, CheckCircle2, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_BATCHES = [
  {
    id: "B-101",
    name: "JEE Advanced Target Batch",
    subject: "Physics",
    instructor: "Dr. Sharma",
    mode: "Hybrid",
    time: "09:00 AM - 11:00 AM",
    students: 45,
    status: "Ongoing"
  },
  {
    id: "B-102",
    name: "Foundation Course (Class 10)",
    subject: "Mathematics",
    instructor: "Mr. Gupta",
    mode: "Offline",
    time: "04:00 PM - 05:30 PM",
    students: 30,
    status: "Upcoming"
  },
  {
    id: "B-103",
    name: "Crash Course NEET",
    subject: "Biology",
    instructor: "Mrs. Verma",
    mode: "Online",
    time: "06:00 PM - 08:00 PM",
    students: 120,
    status: "Upcoming"
  }
];

export default function BatchSchedulePage() {
  const [batches] = useState(MOCK_BATCHES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
            Batch & Course Schedule
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your daily classes, online meeting links, and student attendance.
          </p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-10 px-6 shadow-md shadow-indigo-500/20">
          <Plus className="w-4 h-4 mr-2" /> Create Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center mb-4">
              <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" /> Today's Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">3</div>
                <div className="text-sm text-slate-500 font-medium">Classes Scheduled</div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">195</div>
                <div className="text-sm text-slate-500 font-medium">Students Expected</div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full justify-start h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Users className="w-4 h-4 mr-2 text-slate-400" /> Manage Students
          </Button>
          <Button variant="outline" className="w-full justify-start h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <BookOpen className="w-4 h-4 mr-2 text-slate-400" /> Study Materials
          </Button>
        </div>

        <div className="md:col-span-3 space-y-4">
          {batches.map(batch => (
            <div key={batch.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col md:flex-row gap-6 hover:border-indigo-200 transition">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 mb-1">
                  <Badge className={`
                    ${batch.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0'}
                  `}>
                    {batch.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                    {batch.status}
                  </Badge>
                  <span className="font-mono text-sm font-semibold text-slate-400">{batch.id}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{batch.name}</h3>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center font-medium"><BookOpen className="w-4 h-4 mr-1.5 text-indigo-400" /> {batch.subject}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-slate-400" /> By {batch.instructor}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {batch.time}</span>
                  <span className="flex items-center font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full mr-1.5 bg-blue-500"></span> {batch.mode}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center justify-center gap-3 shrink-0 md:pl-6 md:border-l border-slate-100 dark:border-slate-800 w-full md:w-auto">
                <div className="text-center w-full md:w-auto md:mb-2">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{batch.students}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</div>
                </div>
                
                {(batch.mode === 'Online' || batch.mode === 'Hybrid') ? (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold whitespace-nowrap">
                    <Video className="w-4 h-4 mr-2" /> Start Class
                  </Button>
                ) : (
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Take Attendance
                  </Button>
                )}
                
                {(batch.mode === 'Online' || batch.mode === 'Hybrid') && (
                  <Button variant="outline" className="w-full text-slate-500 hidden md:flex">
                    <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
