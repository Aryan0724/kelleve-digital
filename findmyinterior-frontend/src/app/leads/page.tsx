import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building, Calendar, IndianRupee } from "lucide-react";

function locationName(value: any) {
  return typeof value === "string" ? value : value?.name || "Location not set";
}

async function getLeads(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    if (searchParams.city && searchParams.city !== "All Cities") {
      cleanParams.district = searchParams.city; // The API accepts district
    }
    if (searchParams.search && searchParams.search !== "All Services") {
      // Map search text to category slug
      cleanParams.category = searchParams.search.toLowerCase().replace(/ /g, '-');
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/requirements?${params}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { current_page: 1, last_page: 1 } };
  }
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: leads, meta } = await getLeads(resolvedSearchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Search Available Leads</h1>
        <p className="text-slate-500 text-lg mb-8">Find verified project requirements from homeowners across Bihar and grow your business.</p>
        
        <form className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border max-w-2xl mx-auto">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="city" defaultValue={resolvedSearchParams.city} placeholder="Enter City..." className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <div className="w-px bg-slate-200 hidden md:block" />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="search" defaultValue={resolvedSearchParams.search} placeholder="e.g. Interior Designer..." className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-lg bg-orange-600 hover:bg-orange-700">Search</Button>
        </form>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto space-y-4">
        {leads.length > 0 ? leads.map((req: any) => (
          <Card key={req.id} className="hover:shadow-md transition-shadow border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-xl">{req.title}</h3>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 text-sm shrink-0">
                      <IndianRupee className="w-3 h-3 inline mr-1" />
                      {req.budget_min} - {req.budget_max}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-sm text-slate-500 mt-2 mb-3 gap-3">
                    {req.city && (
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {locationName(req.city)}</span>
                    )}
                    {req.category?.name && (
                      <span className="capitalize px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                        {req.category.name}
                      </span>
                    )}
                    {req.project_type && (
                      <span className="flex items-center"><Building className="w-4 h-4 mr-1" /> {req.project_type}</span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 line-clamp-2">{req.description}</p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[140px] md:items-center justify-center">
                  <Link href={`/requirements/${req.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                  <Link href={`/dashboard`} className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Unlock Lead</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="py-20 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Leads Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              There are no new leads matching your search criteria right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
