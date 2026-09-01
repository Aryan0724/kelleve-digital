"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Settings, ShieldAlert, Zap } from "lucide-react";

const SETTINGS_SCHEMA = {
  general: {
    title: "General Settings",
    icon: <Settings className="w-5 h-5 text-indigo-500" />,
    description: "Basic platform configuration and contact details.",
    items: [
      { key: "platform_name", label: "Platform Name", type: "text", defaultValue: "Find My Interior" },
      { key: "contact_email", label: "Contact Email", type: "text", defaultValue: "support@findmyinterior.com" },
      { key: "support_phone", label: "Support Phone", type: "text", defaultValue: "+91 98765 43210" },
      { key: "maintenance_mode", label: "Maintenance Mode", type: "boolean", defaultValue: "false" },
    ]
  },
  fees: {
    title: "Fees & Global Pricing",
    icon: <ShieldAlert className="w-5 h-5 text-green-500" />,
    description: "Configure global contact unlock pricing, platform fees, and thresholds.",
    items: [
      { key: "contact_unlock_fee", label: "Default Contact / Lead Unlock Fee (₹)", type: "number", defaultValue: "49" },
      { key: "commission_rate", label: "Base Commission Rate (%)", type: "number", defaultValue: "10" },
      { key: "minimum_withdrawal", label: "Min. Withdrawal Amount (₹)", type: "number", defaultValue: "1000" },
    ]
  },
  features: {
    title: "Feature Flags",
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    description: "Toggle experimental or premium platform features.",
    items: [
      { key: "enable_ai_search", label: "Enable AI Smart Search", type: "boolean", defaultValue: "true" },
      { key: "require_phone_verification", label: "Require Phone Verification", type: "boolean", defaultValue: "true" },
      { key: "allow_guest_browsing", label: "Allow Guest Browsing", type: "boolean", defaultValue: "true" },
    ]
  }
};

export function SettingsAdminPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [customKeys, setCustomKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // For adding new custom setting
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/settings");
      const dbSettings = res.data.data || [];
      const dbMap = dbSettings.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});
      
      const merged: Record<string, string> = {};
      const schemaKeys = new Set<string>();
      
      // Initialize with defaults, then override with DB
      Object.values(SETTINGS_SCHEMA).forEach(group => {
        group.items.forEach(item => {
          schemaKeys.add(item.key);
          merged[item.key] = dbMap[item.key] !== undefined ? dbMap[item.key] : item.defaultValue;
        });
      });
      
      // Add custom settings from DB that are not in schema
      const custom: string[] = [];
      dbSettings.forEach((s: any) => {
        if (!schemaKeys.has(s.key)) {
          merged[s.key] = s.value;
          custom.push(s.key);
        }
      });
      
      setCustomKeys(custom);
      setSettings(merged);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.keys(settings).map(key => ({
        key,
        value: settings[key]
      }));

      try {
        await api.put("/admin/settings", { settings: payload });
      } catch (err) {
        await api.post("/admin/settings", { settings: payload });
      }
      alert("Settings saved successfully.");
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddCustom = () => {
    if (!newKey.trim()) return;
    const formattedKey = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (settings[formattedKey] !== undefined) {
      alert("This setting key already exists.");
      return;
    }
    setSettings(prev => ({ ...prev, [formattedKey]: newValue }));
    setCustomKeys(prev => [...prev, formattedKey]);
    setNewKey("");
    setNewValue("");
    setShowAddCustom(false);
  };

  const removeCustomSetting = (keyToRemove: string) => {
    setCustomKeys(prev => prev.filter(k => k !== keyToRemove));
    setSettings(prev => {
      const newSettings = { ...prev };
      delete newSettings[keyToRemove];
      return newSettings;
    });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h2>
        <p className="text-slate-500 mt-1">Manage core application configurations, feature flags, and business logic.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(SETTINGS_SCHEMA).map(([groupKey, group]) => (
          <Card key={groupKey} className="flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center gap-2 mb-1">
                {group.icon}
                <CardTitle className="text-lg">{group.title}</CardTitle>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-5 pt-6">
              {group.items.map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <Label htmlFor={item.key} className="text-slate-700 font-medium">{item.label}</Label>
                  
                  {item.type === 'boolean' ? (
                    <Select value={settings[item.key]} onValueChange={(val) => updateSetting(item.key, val as string)}>
                      <SelectTrigger id={item.key} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id={item.key}
                      type={item.type === 'number' ? 'number' : 'text'}
                      value={settings[item.key] || ""}
                      onChange={(e) => updateSetting(item.key, e.target.value)}
                      className="bg-white"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Custom Configurations</CardTitle>
            <CardDescription>Dynamic settings added beyond the core schema.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddCustom(!showAddCustom)}>
            {showAddCustom ? "Cancel" : "Add Custom Setting"}
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {showAddCustom && (
            <div className="flex items-end gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
              <div className="flex-1 space-y-1.5">
                <Label>Setting Key (e.g. promo_banner_text)</Label>
                <Input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="new_setting_key" className="bg-white" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label>Value</Label>
                <Input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value..." className="bg-white" />
              </div>
              <Button onClick={handleAddCustom}>Add</Button>
            </div>
          )}
          
          {customKeys.length === 0 ? (
            <div className="text-center text-slate-500 py-6 border-2 border-dashed rounded-lg">
              No custom settings added yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {customKeys.map(key => (
                <div key={key} className="space-y-1.5 flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-slate-700 font-medium">{key}</Label>
                    <Input 
                      value={settings[key] || ""}
                      onChange={(e) => updateSetting(key, e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeCustomSetting(key)} title="Remove Setting">
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={saving} size="lg" className="px-8 shadow-sm">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
