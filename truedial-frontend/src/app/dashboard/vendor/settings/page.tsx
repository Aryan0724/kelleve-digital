"use client";

import { Save, Bell, Shield, Smartphone } from "lucide-react";

export default function VendorSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your business preferences and notifications.</p>
        </div>
        <button className="btn-primary rounded-full px-6 py-2 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-secondary/50 rounded-xl font-medium text-foreground flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </div>
          <div className="p-4 hover:bg-secondary/30 rounded-xl font-medium text-muted-foreground flex items-center gap-3 cursor-pointer transition">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </div>
          <div className="p-4 hover:bg-secondary/30 rounded-xl font-medium text-muted-foreground flex items-center gap-3 cursor-pointer transition">
            <Smartphone className="w-5 h-5" />
            Connected Devices
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Leads</div>
                  <div className="text-sm text-muted-foreground">Receive an email when a new customer contacts you.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Reviews</div>
                  <div className="text-sm text-muted-foreground">Get notified when someone leaves a review.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Updates</div>
                  <div className="text-sm text-muted-foreground">Receive tips and offers from TrueDial.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="premium-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Instant Lead Alerts</div>
                  <div className="text-sm text-muted-foreground">Get an SMS instantly for hot leads.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
