"use client";

import React, { useState } from "react";
import { 
  Car, Wrench, Clock, CheckCircle2, AlertTriangle, 
  Settings2, Plus, PenTool, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_VEHICLES = [
  {
    id: "JC-1045",
    vehicle: "Honda City (MH02AB1234)",
    customer: "Amit Desai",
    service: "Full Paid Service",
    status: "In Bay",
    estimatedCompletion: "Today, 4:00 PM",
    mechanic: "Suresh"
  },
  {
    id: "JC-1046",
    vehicle: "Hyundai Creta (MH47XYZ987)",
    customer: "Priya Singh",
    service: "Brake Pad Replacement",
    status: "Waiting for Parts",
    estimatedCompletion: "Tomorrow, 2:00 PM",
    mechanic: "Ramesh"
  },
  {
    id: "JC-1047",
    vehicle: "Maruti Swift (MH01CD5678)",
    customer: "Karan Johar",
    service: "AC Gas Top-up",
    status: "Completed",
    estimatedCompletion: "Today, 1:00 PM",
    mechanic: "Suresh"
  }
];

export default function GarageManagerPage() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Bay': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Waiting for Parts': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Bay': return <Wrench className="w-4 h-4 mr-1.5" />;
      case 'Waiting for Parts': return <AlertTriangle className="w-4 h-4 mr-1.5" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Car className="w-8 h-8 text-rose-500" />
            Vehicles in Garage
          </h1>
          <p className="text-muted-foreground mt-2">
            Track vehicles currently on the floor and manage repair bays.
          </p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-10 px-6">
          <Plus className="w-4 h-4 mr-2" /> New Job Card
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{vehicles.length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Vehicles</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-500">{vehicles.filter(v => v.status === 'In Bay').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">In Bay (Active)</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-amber-500">{vehicles.filter(v => v.status === 'Waiting for Parts').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Waiting on Parts</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-500">{vehicles.filter(v => v.status === 'Completed').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Ready for Delivery</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-rose-200 transition flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{vehicle.vehicle}</h3>
                <div className="text-sm font-semibold text-slate-500 mt-1">{vehicle.customer}</div>
              </div>
              <Badge variant="outline" className="font-mono bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800">
                {vehicle.id}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Service Requested</div>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-rose-500" /> {vehicle.service}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">Status</div>
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${getStatusColor(vehicle.status)}`}>
                  {getStatusIcon(vehicle.status)} {vehicle.status}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">Mechanic</div>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <PenTool className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {vehicle.mechanic}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">Estimated Delivery</div>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {vehicle.estimatedCompletion}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-2">
              {vehicle.status === 'In Bay' && (
                <>
                  <Button onClick={() => updateStatus(vehicle.id, 'Waiting for Parts')} variant="outline" className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50">
                    Need Parts
                  </Button>
                  <Button onClick={() => updateStatus(vehicle.id, 'Completed')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                    Mark Done
                  </Button>
                </>
              )}
              {vehicle.status === 'Waiting for Parts' && (
                <Button onClick={() => updateStatus(vehicle.id, 'In Bay')} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Resume Work
                </Button>
              )}
              {vehicle.status === 'Completed' && (
                <div className="w-full h-10 flex items-center justify-center font-bold text-emerald-600 bg-emerald-500/10 rounded-md">
                  <CheckCircle className="w-5 h-5 mr-2" /> Vehicle Ready
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
