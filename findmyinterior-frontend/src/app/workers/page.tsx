import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getWorkers(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === 'string') {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://find-my-interior-1.onrender.com/api/v1'}/workers?${params}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { current_page: 1, last_page: 1 } };
  }
}

export default async function WorkersPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: workers, meta } = await getWorkers(resolvedSearchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Skilled Local Workforce</h1>
        <p className="text-slate-500 text-lg mb-8">Hire verified carpenters, plumbers, electricians, painters, and masons directly. Zero commission.</p>
        
        <form className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Wrench className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <select name="skill" defaultValue={resolvedSearchParams.skill} className="w-full h-12 pl-10 pr-4 bg-transparent border-0 focus:ring-0 text-base text-slate-600 appearance-none">
              <option value="">Select Skill...</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Painter">Painter</option>
              <option value="Mason">Mason</option>
              <option value="Welder">Welder</option>
            </select>
          </div>
          <div className="w-px bg-slate-200 hidden md:block" />
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="city" defaultValue={resolvedSearchParams.city} placeholder="City..." className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-lg bg-orange-600 hover:bg-orange-700">Find Workers</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workers.length > 0 ? workers.map((worker: any) => (
          <Link key={worker.id} href={`/workers/${worker.slug}`}>
            <Card className="h-full flex flex-col hover:border-orange-500 hover:shadow-md transition-all group pt-6">
              <CardContent className="flex-1 flex flex-col items-center text-center px-6 pb-6">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl font-bold">{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {worker.is_verified && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                      <ShieldCheck className="h-6 w-6 text-green-500 fill-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors">{worker.name}</h3>
                <p className="text-orange-600 font-medium mb-2">{worker.skill}</p>
                
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {worker.city} • {worker.experience_years} yrs exp
                </div>

                <div className="w-full bg-slate-50 rounded-lg p-3 mb-4 flex justify-between items-center text-sm">
                  <div className="flex flex-col items-start">
                    <span className="text-slate-400 text-xs uppercase font-semibold">Daily Rate</span>
                    <span className="font-bold text-slate-900">{worker.daily_rate_formatted || 'Negotiable'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-xs uppercase font-semibold">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                      <span className="font-bold text-slate-900">{worker.avg_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {worker.is_available ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 mb-4"><CheckCircle2 className="w-3 h-3 mr-1"/> Available Now</Badge>
                ) : (
                  <Badge variant="secondary" className="mb-4">Currently Busy</Badge>
                )}

                <Button variant="outline" className="w-full mt-auto group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Link>
        )) : (
           <div className="col-span-full py-20 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed">
            No workers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
