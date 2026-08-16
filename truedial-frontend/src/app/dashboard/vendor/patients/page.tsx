"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Search, Plus, Filter, FileText, Clock, 
  Activity, Phone, Stethoscope, FilePlus, ChevronRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrueDialAPI } from "@/lib/api";

export default function PatientRecords() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // New Patient Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", age: "", gender: "", condition: "", blood_group: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const res = await TrueDialAPI.getPatients();
    if (res.success && Array.isArray(res.data)) {
      setPatients(res.data);
      if (res.data.length > 0) setSelectedPatient(res.data[0]);
    } else if (Array.isArray(res)) {
      // In case the structure is slightly different
      setPatients(res);
      if (res.length > 0) setSelectedPatient(res[0]);
    }
    setLoading(false);
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...formData, age: formData.age ? parseInt(formData.age) : null };
    const res = await TrueDialAPI.createPatient(payload);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsAddOpen(false);
      setFormData({ name: "", phone: "", age: "", gender: "", condition: "", blood_group: "" });
      fetchPatients(); // Reload
    } else {
      alert("Failed to add patient");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.phone && p.phone.includes(search)) ||
    (p.patient_identifier && p.patient_identifier.toLowerCase().includes(search.toLowerCase()))
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
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-6 rounded-md flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Add New Patient
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPatient} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <Input placeholder="e.g. O+" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <Input placeholder="Primary condition" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Patient
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
            ) : filteredPatients.map(patient => (
              <button 
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group
                  ${selectedPatient?.id === patient.id 
                    ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"}
                `}
              >
                <div>
                  <h3 className={`font-bold text-sm ${selectedPatient?.id === patient.id ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{patient.patient_identifier || `ID-${patient.id}`}</span>
                    <span>•</span>
                    <span>{patient.age ? `${patient.age}y` : '--'} {patient.gender ? patient.gender.charAt(0) : ''}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedPatient?.id === patient.id ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`} />
              </button>
            ))}
            {!loading && filteredPatients.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No patients found
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Selected Patient Details */}
        <div className="md:col-span-3 space-y-6 h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar pr-2">
          {selectedPatient ? (
            <>
              {/* Patient Header Card */}
              <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10"></div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold shrink-0">
                      {selectedPatient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedPatient.name}</h2>
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">{selectedPatient.status || 'Active'}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex items-center"><span className="font-semibold mr-1">ID:</span> {selectedPatient.patient_identifier || `ID-${selectedPatient.id}`}</span>
                        <span className="flex items-center"><span className="font-semibold mr-1">Age:</span> {selectedPatient.age ? `${selectedPatient.age} yrs` : 'N/A'}</span>
                        <span className="flex items-center"><span className="font-semibold mr-1">Gender:</span> {selectedPatient.gender || 'N/A'}</span>
                        <span className="flex items-center"><span className="font-semibold mr-1">Blood:</span> {selectedPatient.blood_group || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPatient.phone && (
                      <Button variant="outline" className="h-9 px-3 border-slate-200 dark:border-slate-700">
                        <Phone className="w-4 h-4 mr-2" /> Call
                      </Button>
                    )}
                    <Button className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                      <FilePlus className="w-4 h-4 mr-2" /> New Consultation
                    </Button>
                  </div>
                </div>
                
                {/* Quick Stats/Vitals Bar */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Last Visit</div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 
                      {selectedPatient.last_visit_at ? new Date(selectedPatient.last_visit_at).toLocaleDateString() : 'New'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Primary Condition</div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center">
                      <Activity className="w-3.5 h-3.5 mr-1.5 text-red-500" /> 
                      {selectedPatient.condition || 'None stated'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Allergies</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedPatient.allergies || 'None known'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Phone</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedPatient.phone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Timeline & Medical History */}
              <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" /> Medical History & Timeline
                </h3>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                  
                  {/* Timeline Item 1 - Mock entry to preserve design */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a1c3a] bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 dark:text-white">Profile Created</div>
                        <time className="text-xs font-semibold text-blue-500">
                          {selectedPatient.created_at ? new Date(selectedPatient.created_at).toLocaleDateString() : 'Today'}
                        </time>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-2">
                        <p>Patient record was created successfully in the TrueDial EHR system.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
              <div className="text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Patient Selected</h3>
                <p className="text-slate-500 mt-1 max-w-sm">Select a patient from the sidebar or add a new one to view their medical history.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
