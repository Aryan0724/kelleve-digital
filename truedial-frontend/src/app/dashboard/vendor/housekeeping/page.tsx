"use client";

import React, { useState } from "react";
import { 
  Bed, Droplets, CheckCircle, Clock, Search, 
  Filter, Wind, Sparkles, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MOCK_ROOMS = [
  {
    roomNumber: "101",
    type: "Deluxe",
    status: "Dirty",
    occupancy: "Checked Out",
    assignedTo: "Ramesh",
    priority: "High" // Needs cleaning for next check-in
  },
  {
    roomNumber: "102",
    type: "Standard",
    status: "Clean",
    occupancy: "Vacant",
    assignedTo: "-",
    priority: "Low"
  },
  {
    roomNumber: "105",
    type: "Suite",
    status: "Cleaning in Progress",
    occupancy: "Checked Out",
    assignedTo: "Suresh",
    priority: "Medium"
  },
  {
    roomNumber: "201",
    type: "Deluxe",
    status: "Dirty",
    occupancy: "Occupied", // Daily cleaning
    assignedTo: "Ramesh",
    priority: "Medium"
  },
  {
    roomNumber: "204",
    type: "Standard",
    status: "Clean",
    occupancy: "Occupied",
    assignedTo: "-",
    priority: "Low"
  }
];

export default function HousekeepingPage() {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter(r => r.roomNumber.includes(search));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clean': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Dirty': return "bg-red-500/10 text-red-600 border-red-500/20";
      case 'Cleaning in Progress': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clean': return <Sparkles className="w-4 h-4 mr-1.5" />;
      case 'Dirty': return <Droplets className="w-4 h-4 mr-1.5" />;
      case 'Cleaning in Progress': return <Wind className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const updateStatus = (roomNumber: string, newStatus: string) => {
    setRooms(prev => prev.map(r => r.roomNumber === roomNumber ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Bed className="w-8 h-8 text-cyan-500" />
            Housekeeping Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track room cleaning statuses, staff assignments, and room turnover.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-48">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Room No..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{rooms.length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Rooms</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-red-500">{rooms.filter(r => r.status === 'Dirty').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Dirty</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-500">{rooms.filter(r => r.status === 'Cleaning in Progress').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">In Progress</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-500">{rooms.filter(r => r.status === 'Clean').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Clean & Ready</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map(room => (
          <div 
            key={room.roomNumber}
            className={`bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border-2 transition-all p-5 shadow-sm flex flex-col
              ${room.status === 'Dirty' && room.priority === 'High' ? 'border-red-500 shadow-red-500/10' : 'border-slate-200 dark:border-slate-800'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{room.roomNumber}</h3>
                <div className="text-sm font-semibold text-slate-500">{room.type}</div>
              </div>
              <Badge variant="outline" className={`border-0 bg-slate-100 dark:bg-slate-800 text-xs ${room.occupancy === 'Occupied' ? 'text-blue-500' : 'text-slate-500'}`}>
                {room.occupancy}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(room.status)}`}>
                {getStatusIcon(room.status)}
                {room.status}
              </div>
              
              {room.priority === 'High' && room.status === 'Dirty' && (
                <div className="flex items-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 p-2 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2" /> Urgent: Guest check-in at 2 PM
                </div>
              )}
              
              <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                <span className="text-slate-400 w-20">Assigned:</span> 
                <span className="font-semibold">{room.assignedTo}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-2">
              {room.status === 'Dirty' && (
                <Button 
                  onClick={() => updateStatus(room.roomNumber, 'Cleaning in Progress')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
                >
                  <Wind className="w-4 h-4 mr-2" /> Start Cleaning
                </Button>
              )}
              {room.status === 'Cleaning in Progress' && (
                <Button 
                  onClick={() => updateStatus(room.roomNumber, 'Clean')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Clean
                </Button>
              )}
              {room.status === 'Clean' && (
                <div className="w-full h-10 flex items-center justify-center font-bold text-emerald-600 bg-emerald-500/10 rounded-md">
                  Ready for Guest
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
