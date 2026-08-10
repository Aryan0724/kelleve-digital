"use client";

import { useState } from "react";
import { Users, Mail, Plus, UserPlus, MoreVertical, Trash2 } from "lucide-react";

export default function VendorStaffPage() {
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Manager", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Staff", status: "invited" },
  ]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage team members and their access levels.</p>
        </div>
        <button className="btn-primary rounded-full px-4 py-2 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Staff
        </button>
      </div>

      <div className="premium-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="border-t border-border hover:bg-secondary/20 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{staff.name}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {staff.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
