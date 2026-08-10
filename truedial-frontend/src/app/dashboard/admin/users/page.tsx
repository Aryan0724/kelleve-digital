"use client";

import { useState } from "react";
import { Search, UserCheck, UserX, UserRoundCog, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, name: "Admin System", email: "admin@truedial.in", role: "Super Admin", status: "active", joined: "Jan 1, 2026" },
    { id: 2, name: "Aryan Sharma", email: "aryan@example.com", role: "Business", status: "active", joined: "Feb 15, 2026" },
    { id: 3, name: "Regular User", email: "user@example.com", role: "User", status: "active", joined: "Mar 10, 2026" },
    { id: 4, name: "Suspended Vendor", email: "bad@vendor.com", role: "Business", status: "suspended", joined: "Apr 5, 2026" },
  ]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all users across the TrueDial platform.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="premium-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserRoundCog className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">12,450</div>
            <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Total Users</div>
          </div>
        </div>
        <div className="premium-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">3,890</div>
            <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Vendors</div>
          </div>
        </div>
        <div className="premium-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">15</div>
            <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Admins</div>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-secondary/20 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary text-foreground px-2 py-1 rounded text-xs font-medium border border-border">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline text-xs font-medium">Edit</button>
                    <span className="mx-2 text-border">|</span>
                    {user.status === 'active' ? (
                      <button className="text-red-500 hover:underline text-xs font-medium">Suspend</button>
                    ) : (
                      <button className="text-green-500 hover:underline text-xs font-medium">Activate</button>
                    )}
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
