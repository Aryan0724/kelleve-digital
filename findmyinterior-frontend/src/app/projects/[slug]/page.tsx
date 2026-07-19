import { InquiryForm } from "@/components/forms/InquiryForm";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Calendar, Grid3X3, Wallet } from "lucide-react";
import { notFound } from "next/navigation";

async function getProject(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/builder-projects/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch');
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProjectProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6">
          <div>
            <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">{project.property_type}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">{project.title}</h1>
            <div className="flex items-center text-slate-500 text-lg">
              <MapPin className="h-5 w-5 mr-1" /> {project.location}, {project.city}
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <div className="text-3xl font-bold text-orange-600">{project.formatted_price}</div>
            <div className="text-sm text-slate-500">Starting Price</div>
          </div>
        </div>

        {/* Big Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] min-h-[400px] mb-12">
          <div className="md:col-span-3 bg-slate-100 rounded-2xl overflow-hidden h-full">
            {project.cover_image && <img src={project.cover_image} className="w-full h-full object-cover" alt={project.title} />}
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="bg-slate-100 rounded-2xl overflow-hidden flex-1"></div>
            <div className="bg-slate-100 rounded-2xl overflow-hidden flex-1"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-10">
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="text-slate-500 text-sm flex items-center mb-1"><Grid3X3 className="h-4 w-4 mr-1"/> BHK Options</div>
                <div className="font-semibold text-lg">{project.bhk_options}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm flex items-center mb-1"><Calendar className="h-4 w-4 mr-1"/> Possession</div>
                <div className="font-semibold text-lg">{project.possession_date || 'Ready to Move'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm flex items-center mb-1"><Wallet className="h-4 w-4 mr-1"/> RERA ID</div>
                <div className="font-semibold text-lg">{project.rera_id || 'N/A'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm flex items-center mb-1"><Building className="h-4 w-4 mr-1"/> Total Units</div>
                <div className="font-semibold text-lg">{project.total_units || 'N/A'}</div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 border-b pb-4 mb-6">About the Project</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">{project.description}</p>
            </div>
            
            {project.amenities && project.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 border-b pb-4 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.amenities.map((item: string, i: number) => (
                    <div key={i} className="flex items-center text-slate-700 bg-slate-50 p-3 rounded-lg border">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mr-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-24">
              <div className="mb-6 pb-6 border-b text-center">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Developed By</div>
                <h3 className="text-2xl font-bold text-slate-900">{project.builder?.company_name}</h3>
                <div className="text-slate-500 flex items-center justify-center mt-2">
                  <MapPin className="h-4 w-4 mr-1"/> {project.builder?.city}
                </div>
              </div>
              
              <h4 className="font-bold text-lg mb-4 text-center">Interested in this property?</h4>
              <p className="text-slate-500 text-sm text-center mb-6">Connect directly with the builder for the best price. No brokerage.</p>
              
              <InquiryForm type="BuilderProject" id={project.id} title={project.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
