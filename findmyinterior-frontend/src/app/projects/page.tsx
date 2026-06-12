import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building, Calendar } from "lucide-react";

async function getProjects(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === 'string') {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/builder-projects?${params}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { current_page: 1, last_page: 1 } };
  }
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: projects, meta } = await getProjects(resolvedSearchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">New Real Estate Projects</h1>
        <p className="text-slate-500 text-lg mb-8">Discover under-construction and possession-ready flats, villas, and commercial spaces across Bihar.</p>
        
        <form className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border max-w-2xl mx-auto">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="city" defaultValue={resolvedSearchParams.city} placeholder="Enter City..." className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <div className="w-px bg-slate-200 hidden md:block" />
          <div className="relative flex-1">
            <Building className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <select name="type" defaultValue={resolvedSearchParams.type} className="w-full h-12 pl-10 pr-4 bg-transparent border-0 focus:ring-0 text-base text-slate-600 appearance-none">
              <option value="">All Property Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Villa">Villa/Independent House</option>
            </select>
          </div>
          <Button type="submit" className="h-12 px-8 rounded-lg bg-orange-600 hover:bg-orange-700">Search</Button>
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.length > 0 ? projects.map((project: any) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-slate-200 group">
              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                {project.cover_image ? (
                  <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">No Image</div>
                )}
                {project.is_possession_ready && (
                  <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 text-white border-0">Ready to Move</Badge>
                )}
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="text-orange-600 font-bold text-xl mb-1">{project.formatted_price}</div>
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors mb-2">
                  {project.title}
                </h3>
                
                <div className="text-sm text-slate-500 mb-4 line-clamp-1">
                  {project.bhk_options} • {project.location}, {project.city}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <span className="font-medium text-slate-900 truncate pr-2">By {project.builder?.company_name}</span>
                  <div className="flex items-center whitespace-nowrap">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.possession_date || 'Ongoing'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed">
            No projects found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
