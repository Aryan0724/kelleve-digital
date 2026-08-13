"use client";

import React, { useState } from "react";
import { 
  Users, Search, Plus, Filter, FileText, Clock, 
  Activity, Phone, Stethoscope, FilePlus, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_PATIENTS = [
  {
    id: "P-10021",
    name: "Suresh Menon",
    age: 45,
    gender: "Male",
    phone: "9876543210",
    lastVisit: "Today",
    condition: "Hypertension",
    bloodGroup: "O+",
    status: "In Treatment"
  },
  {
    id: "P-10022",
    name: "Meera Reddy",
    age: 32,
    gender: "Female",
    phone: "9123456789",
    lastVisit: "12 Aug 2026",
    condition: "Migraine",
    bloodGroup: "A+",
    status: "Follow-up"
  },
  {
    id: "P-10023",
    name: "Kiran Rao",
    age: 58,
    gender: "Male",
    phone: "9999900000",
    lastVisit: "05 Aug 2026",
    condition: "Type 2 Diabetes",
    bloodGroup: "B-",
    status: "Stable"
  },
  {
    id: "P-10024",
    name: "Anita Shah",
    age: 28,
    gender: "Female",
    phone: "9800012345",
    lastVisit: "22 Jul 2026",
    condition: "Routine Checkup",
    bloodGroup: "O-",
    status: "Completed"
  }
];

export default function PatientRecords() {
  const [search, setSearch] = useState("");
  const [patients] = useState(MOCK_PATIENTS);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Patient Health Records (EHR)
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage patient histories, prescriptions, and consultation notes securely.
          </p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar: Patient List */}
        <div className="md:col-span-1 bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-200px)]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search name, phone, ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>{filteredPatients.length} Patients</span>
              <button className="flex items-center hover:text-blue-500 transition">
                <Filter className="w-3 h-3 mr-1" /> Sort
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredPatients.map(patient => (
              <button 
                key={patient.id}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group
                  ${patient.id === "P-10021" 
                    ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"}
                `}
              >
                <div>
                  <h3 className={`font-bold text-sm ${patient.id === "P-10021" ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{patient.id}</span>
                    <span>•</span>
                    <span>{patient.age}y {patient.gender.charAt(0)}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${patient.id === "P-10021" ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`} />
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No patients found
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Selected Patient Details */}
        <div className="md:col-span-3 space-y-6 h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar pr-2">
          {/* Patient Header Card */}
          <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10"></div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold shrink-0">
                  SM
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Suresh Menon</h2>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">In Treatment</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex items-center"><span className="font-semibold mr-1">ID:</span> P-10021</span>
                    <span className="flex items-center"><span className="font-semibold mr-1">Age:</span> 45 yrs</span>
                    <span className="flex items-center"><span className="font-semibold mr-1">Gender:</span> Male</span>
                    <span className="flex items-center"><span className="font-semibold mr-1">Blood:</span> O+</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-9 px-3 border-slate-200 dark:border-slate-700">
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
                <Button className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                  <FilePlus className="w-4 h-4 mr-2" /> New Consultation
                </Button>
              </div>
            </div>
            
            {/* Quick Stats/Vitals Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Last Visit</div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Today (11:30 AM)</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Primary Condition</div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center"><Activity className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Hypertension</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Allergies</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Penicillin</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Total Visits</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">4 this year</div>
              </div>
            </div>
          </div>

          {/* Timeline & Medical History */}
          <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> Medical History & Timeline
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              
              {/* Timeline Item 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a1c3a] bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 dark:text-white">Consultation (Follow-up)</div>
                    <time className="text-xs font-semibold text-blue-500">Today, 11:30 AM</time>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-2">
                    <p><span className="font-semibold">Vitals:</span> BP: 130/85, HR: 72, Temp: 98.6°F</p>
                    <p><span className="font-semibold">Notes:</span> Patient reports mild headaches in the morning. BP is slightly elevated but better than last visit. Continuing current medication with lifestyle adjustments.</p>
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                      <Badge variant="outline" className="bg-white dark:bg-slate-800 text-xs py-0">Rx: Telmisartan 40mg</Badge>
                      <Badge variant="outline" className="bg-white dark:bg-slate-800 text-xs py-0">Lab Report Attached</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a1c3a] bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 dark:text-white">Initial Assessment</div>
                    <time className="text-xs font-medium text-slate-500">15 Jul 2026</time>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-2">
                    <p><span className="font-semibold">Vitals:</span> BP: 150/95, HR: 80, Wt: 82kg</p>
                    <p><span className="font-semibold">Diagnosis:</span> Stage 1 Hypertension. Advised dietary changes (low sodium) and prescribed starter medication.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
