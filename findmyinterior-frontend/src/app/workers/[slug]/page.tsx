import { InquiryForm } from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, ShieldCheck, Briefcase, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

async function getWorker(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/workers/${slug}`, {
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

export default async function WorkerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const worker = await getWorker(slug);
  if (!worker) return notFound();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-400 w-full" />
          
          <div className="px-6 md:px-10 pb-10 relative">
            {/* Avatar & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-8 gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage src={worker.avatar} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-3xl font-bold">{worker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {worker.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                    <ShieldCheck className="h-7 w-7 text-green-500 fill-white" />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-64">
                <InquiryForm type="Worker" id={worker.id} title={worker.name} />
              </div>
            </div>

            {/* Title & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{worker.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 text-sm px-3 py-1">
                      {worker.skill}
                    </Badge>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-1 text-slate-400" /> {worker.city}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 border-b pb-2">About Me</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{worker.bio || "No biography provided."}</p>
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 font-medium">
                      <IndianRupee className="h-5 w-5 mr-2 text-slate-400"/> Daily Rate
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{worker.daily_rate_formatted || 'Negotiable'}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 font-medium">
                      <Briefcase className="h-5 w-5 mr-2 text-slate-400"/> Experience
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{worker.experience_years} Years</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 font-medium">
                      <Star className="h-5 w-5 mr-2 text-slate-400"/> Rating
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                      <div className="font-bold text-slate-900 text-lg">{worker.avg_rating.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center text-slate-600 font-medium mb-3">
                    <Clock className="h-5 w-5 mr-2 text-slate-400"/> Availability
                  </div>
                  {worker.is_available ? (
                    <div className="flex items-center text-green-700 bg-green-100 p-3 rounded-lg font-semibold">
                      <CheckCircle2 className="w-5 h-5 mr-2"/> Available for work
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-700 bg-amber-100 p-3 rounded-lg font-semibold">
                      Currently busy on a project
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="mt-12">
              <ReviewSection reviews={worker.reviews || []} reviewableType="worker" reviewableId={worker.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
