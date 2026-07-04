"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SettingsAdminPanel() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/settings");
      setSettings(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", {
        settings: settings.map(s => ({ key: s.key, value: s.value }))
      });
      alert("Settings saved successfully.");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Platform Settings</CardTitle>
          <CardDescription>Configure global variables like bidding fees and platform commissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting, idx) => (
            <div key={setting.key} className="flex flex-col space-y-1.5">
              <Label htmlFor={setting.key}>{setting.description || setting.key}</Label>
              <Input 
                id={setting.key}
                value={setting.value || ""}
                onChange={(e) => {
                  const newSettings = [...settings];
                  newSettings[idx].value = e.target.value;
                  setSettings(newSettings);
                }}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
