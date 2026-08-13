"use client";

import React, { useState } from "react";
import { 
  Plane, Map, Users, Calendar, Clock, 
  MapPin, Phone, MessageCircle, Sun, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_TOURS = [
  {
    id: "TR-5021",
    name: "Golden Triangle Highlights",
    destination: "Delhi - Agra - Jaipur",
    startDate: "15 Aug 2026",
    endDate: "20 Aug 2026",
    pax: 12,
    guide: "Ravi Kumar",
    status: "Ongoing",
    nextStop: "Taj Mahal (Tomorrow, 6 AM)"
  },
  {
    id: "TR-5022",
    name: "Kerala Backwaters Retreat",
    destination: "Kochi - Alleppey - Munnar",
    startDate: "22 Aug 2026",
    endDate: "28 Aug 2026",
    pax: 8,
    guide: "Sneha Nair",
    status: "Upcoming",
    nextStop: "Arrival at Kochi Airport"
  },
  {
    id: "TR-5023",
    name: "Manali Adventure Trip",
    destination: "Chandigarh - Manali - Rohtang",
    startDate: "05 Aug 2026",
    endDate: "12 Aug 2026",
    pax: 15,
    guide: "Amit Singh",
    status: "Completed",
    nextStop: "-"
  }
];

export default function ActiveToursPage() {
  const [tours] = useState(MOCK_TOURS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Upcoming': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Completed': return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Plane className="w-8 h-8 text-sky-500" />
            Active Tours & Operations
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor ongoing trips, upcoming departures, and on-ground logistics.
          </p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-10 px-6">
          Create Itinerary
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-500">{tours.filter(t => t.status === 'Ongoing').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Live Tours</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-500">{tours.filter(t => t.status === 'Upcoming').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Upcoming</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-amber-500">
            {tours.filter(t => t.status !== 'Completed').reduce((sum, t) => sum + t.pax, 0)}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Guests on Ground</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Guides Deployed</div>
        </div>
      </div>

      <div className="space-y-4">
        {tours.map(tour => (
          <div key={tour.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-sky-200 transition flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`px-2 py-0.5 border-0 ${getStatusColor(tour.status)}`}>
                      {tour.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                      {tour.status}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">{tour.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tour.name}</h3>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-sky-500" /> {tour.destination}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Start Date</div>
                  <div className="font-bold text-slate-900 dark:text-white">{tour.startDate}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> End Date</div>
                  <div className="font-bold text-slate-900 dark:text-white">{tour.endDate}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> Passengers</div>
                  <div className="font-bold text-slate-900 dark:text-white">{tour.pax} Pax</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center"><Map className="w-3.5 h-3.5 mr-1" /> Tour Guide</div>
                  <div className="font-bold text-slate-900 dark:text-white">{tour.guide}</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-64 flex flex-col gap-3 shrink-0 pt-4 md:pt-0 md:pl-6 md:border-l border-slate-100 dark:border-slate-800">
              {tour.status !== 'Completed' && (
                <div className="bg-sky-50 dark:bg-sky-900/10 rounded-lg p-3 border border-sky-100 dark:border-sky-900/20 mb-2">
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider mb-1">Next Action / Stop</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{tour.nextStop}</div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" /> Chat
                </Button>
                <Button className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" /> Call Guide
                </Button>
              </div>
              
              <Button variant="ghost" className="w-full text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/10">
                View Full Itinerary
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
