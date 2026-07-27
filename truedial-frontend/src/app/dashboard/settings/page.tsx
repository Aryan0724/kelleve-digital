"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Lock, Bell, Mail, Smartphone, Key, CheckCircle2, Save, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications">("account");
  const [toastMessage, setToastMessage] = useState("");

  const [accountForm, setAccountForm] = useState({
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 9876543210",
    language: "English (India)",
    timeZone: "(GMT+05:30) India Standard Time - Kolkata, Mumbai, New Delhi"
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: true
  });

  const [notificationsForm, setNotificationsForm] = useState({
    emailLeads: true,
    smsLeads: true,
    inAppReviews: true,
    marketingNewsletters: false,
    privilegeCardClaims: true
  });

  const [saving, setSaving] = useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage("Account settings updated successfully!");
      setTimeout(() => setToastMessage(""), 3500);
    }, 600);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSecurityForm({ ...securityForm, currentPassword: "", newPassword: "", confirmPassword: "" });
      setToastMessage("Security & Password settings saved!");
      setTimeout(() => setToastMessage(""), 3500);
    }, 600);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage("Notification preferences saved successfully!");
      setTimeout(() => setToastMessage(""), 3500);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Account & Security Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your TrueDial login credentials, notification preferences, and two-factor authentication.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Verified TrueDial Account
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "account"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" /> Account Details
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Passwords
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {/* ACCOUNT DETAILS TAB */}
      {activeTab === "account" && (
        <form onSubmit={handleSaveAccount} className="premium-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-lg text-foreground">Personal Information</h3>
              <p className="text-xs text-muted-foreground">This information is used for TrueDial verification and customer invoicing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Full Name *
              </label>
              <Input 
                value={accountForm.name} 
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Registered Email *
              </label>
              <Input 
                type="email" 
                value={accountForm.email} 
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Primary Phone / Mobile *
              </label>
              <Input 
                value={accountForm.phone} 
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Language Preference
              </label>
              <select
                value={accountForm.language}
                onChange={(e) => setAccountForm({ ...accountForm, language: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="English (India)">English (India)</option>
                <option value="Hindi (India)">Hindi (India)</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Time Zone
              </label>
              <Input 
                value={accountForm.timeZone} 
                disabled 
                className="bg-muted/50 text-muted-foreground" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" disabled={saving} className="font-semibold px-8 h-11">
              {saving ? "Saving..." : "Save Account Details"}
              {!saving && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveSecurity} className="premium-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-lg text-foreground">Change Password</h3>
              <p className="text-xs text-muted-foreground">Use a strong password to protect your verified business dashboard.</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Current Password
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={securityForm.currentPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                New Password
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Confirm New Password
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={securityForm.confirmPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* TWO-FACTOR AUTHENTICATION TOGGLE */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-muted-foreground">Receive an SMS verification code whenever logging in from a new device.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={securityForm.twoFactor} 
                onChange={(e) => setSecurityForm({ ...securityForm, twoFactor: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving} className="font-semibold px-8 h-11">
              {saving ? "Updating..." : "Update Security Settings"}
              {!saving && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSaveNotifications} className="premium-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-lg text-foreground">Notification Preferences</h3>
              <p className="text-xs text-muted-foreground">Choose which alerts you want to receive via Email and SMS.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-bold text-sm text-foreground">Email Alerts for New Leads</h4>
                <p className="text-xs text-muted-foreground">Get an email notification instantly when a customer submits an inquiry.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsForm.emailLeads} 
                onChange={(e) => setNotificationsForm({ ...notificationsForm, emailLeads: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-bold text-sm text-foreground">SMS Alerts for Urgent Inquiries</h4>
                <p className="text-xs text-muted-foreground">Receive an SMS message when a Privilege Card VIP member contacts you.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsForm.smsLeads} 
                onChange={(e) => setNotificationsForm({ ...notificationsForm, smsLeads: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-bold text-sm text-foreground">Customer Reviews & Ratings</h4>
                <p className="text-xs text-muted-foreground">Be notified when a verified client leaves a star rating or review.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsForm.inAppReviews} 
                onChange={(e) => setNotificationsForm({ ...notificationsForm, inAppReviews: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-bold text-sm text-foreground">Privilege Card Offer Redemptions</h4>
                <p className="text-xs text-muted-foreground">Receive updates on coupon code usage and customer VIP claims.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsForm.privilegeCardClaims} 
                onChange={(e) => setNotificationsForm({ ...notificationsForm, privilegeCardClaims: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-bold text-sm text-foreground">TrueDial Newsletter & Product Updates</h4>
                <p className="text-xs text-muted-foreground">Receive tips on SEO ranking, promotional campaigns, and platform releases.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsForm.marketingNewsletters} 
                onChange={(e) => setNotificationsForm({ ...notificationsForm, marketingNewsletters: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer rounded" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" disabled={saving} className="font-semibold px-8 h-11">
              {saving ? "Saving..." : "Save Notification Preferences"}
              {!saving && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
