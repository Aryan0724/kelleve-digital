"use client";

import React, { useState } from "react";
import { 
  Users, Mail, Plus, UserPlus, Trash2, 
  Scissors, Briefcase, CalendarCheck, Star, Clock, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVendorType } from "@/hooks/useVendorType";

const MOCK_STAFF = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Manager", status: "active", rating: 4.8, jobsCompleted: 142 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Specialist", status: "invited", rating: 4.5, jobsCompleted: 89 },
  { id: 3, name: "Rahul Verma", email: "rahul@example.com", role: "Junior Staff", status: "active", rating: 4.2, jobsCompleted: 34 },
];

export default function VendorStaffPage() {
  const [staffMembers, setStaffMembers] = useState(MOCK_STAFF);
  const config = useVendorType();

  const isBeauty = config.archetype === 'beauty';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            {isBeauty ? <Scissors className="w-8 h-8 text-pink-500" /> : <Users className="w-8 h-8 text-blue-500" />}
            {isBeauty ? "Stylists & Staff Management" : "Staff Management"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members, their roles, and track their performance.
          </p>
        </div>
        <Button className={`${isBeauty ? 'bg-pink-500 hover:bg-pink-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold h-10 px-6`}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${isBeauty ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center`}>
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{staffMembers.length}</div>
            <div className="text-sm font-medium text-slate-500">Total Team Members</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">24</div>
            <div className="text-sm font-medium text-slate-500">Appointments Today</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">4.5</div>
            <div className="text-sm font-medium text-slate-500">Average Team Rating</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Performance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isBeauty ? 'bg-pink-500' : 'bg-blue-500'}`}>
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{staff.name}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {staff.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-0 text-slate-600 dark:text-slate-300">
                      {isBeauty && staff.role === 'Specialist' ? 'Senior Stylist' : staff.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {staff.rating}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{staff.jobsCompleted} {isBeauty ? 'clients' : 'jobs'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`border-0 ${
                      staff.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-600' 
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
