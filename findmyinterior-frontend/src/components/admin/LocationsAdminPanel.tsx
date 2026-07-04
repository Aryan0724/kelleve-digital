"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

export function LocationsAdminPanel() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/locations");
      setLocations(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCity.trim()) return;
    try {
      await api.post("/admin/locations", { name: newCity.trim(), is_active: true });
      setNewCity("");
      fetchLocations();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to add location");
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/admin/locations/${id}`, { is_active: !currentStatus });
      fetchLocations();
    } catch (e) {
      console.error("Failed to toggle");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    try {
      await api.delete(`/admin/locations/${id}`);
      fetchLocations();
    } catch (e) {
      console.error("Failed to delete");
    }
  };

  if (loading) return <div className="text-center p-8">Loading locations...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Service Locations</CardTitle>
          <CardDescription>Add new cities that appear in search dropdowns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Input 
              placeholder="City name (e.g. Delhi)" 
              value={newCity} 
              onChange={(e) => setNewCity(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>Add City</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Active in Dropdowns</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.name}</TableCell>
                  <TableCell>{loc.slug}</TableCell>
                  <TableCell>
                    <Checkbox 
                      checked={loc.is_active} 
                      onCheckedChange={() => handleToggle(loc.id, loc.is_active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(loc.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {locations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-6">
                    No locations added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
