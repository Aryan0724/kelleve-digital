import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactButtons } from "@/components/professionals/ContactButtons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReviewSection from "@/components/reviews/ReviewSection";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ShieldCheck, Phone, Mail, Globe, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function getProfessional(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/listings/${slug}`, {
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getProfessional(slug);
  
  if (!listing) {
    return {
      title: "Professional Not Found",
    };
  }

  const categoryName = listing.category?.name || "Professional";
  
  return {
    title: `${listing.title} - ${categoryName} in ${listing.city}`,
    description: listing.description ? listing.description.substring(0, 160) : `Contact ${listing.title}, a top-rated ${categoryName} in ${listing.city}.`,
    openGraph: {
      title: `${listing.title} - ${categoryName} in ${listing.city}`,
      description: listing.description ? listing.description.substring(0, 160) : `Contact ${listing.title}, a top-rated ${categoryName} in ${listing.city}.`,
      images: listing.cover_image ? [listing.cover_image] : [],
    }
  };
}

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getProfessional(slug);
  if (!listing) return notFound();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Cover Image Header */}
      <div className="h-64 md:h-96 w-full bg-slate-900 relative">
        {listing.cover_image && (
          <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{listing.title}</h1>
                    {listing.verification_level === 'elite_professional' && <Badge className="bg-indigo-600 hover:bg-indigo-700 ml-2" title="Elite Professional">Elite Professional</Badge>}
                    {listing.verification_level === 'trusted_professional' && <Badge className="bg-blue-600 hover:bg-blue-700 ml-2" title="Trusted Professional">Trusted Professional</Badge>}
                    {(listing.verification_level === 'verified_business' || listing.is_verified) && <span title="Verified Business" className="flex-shrink-0 ml-2"><ShieldCheck className="h-8 w-8 text-green-500" /></span>}
                  </div>
                  <div className="flex items-center text-slate-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" /> {listing.address}, {listing.city}, {listing.district}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{listing.category?.name}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                      <span className="font-semibold text-slate-900 mr-1">{listing.avg_rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-sm">({listing.review_count} reviews)</span>
                    </div>
                    {listing.trust_score > 0 && (
                      <div className="flex items-center">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                          Trust Score: {listing.trust_score}/100
                        </span>
                      </div>
                    )}
                    {listing.profile_completion_score > 0 && (
                      <div className="flex items-center">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                          Profile: {listing.profile_completion_score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-4">About Us</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
              
              {/* Advanced Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                {/* Business Specific Details */}
                {(listing.years_experience > 0 || listing.team_size || listing.gst_number || listing.pan_number || listing.budget_tier) && (
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {listing.years_experience > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">Established</div>
                        <div className="text-sm font-bold text-slate-900">{new Date().getFullYear() - listing.years_experience} ({listing.years_experience} Years)</div>
                      </div>
                    )}
                    {listing.team_size && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">Company Size</div>
                        <div className="text-sm font-bold text-slate-900">{listing.team_size} Employees</div>
                      </div>
                    )}
                    {listing.gst_number && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">GSTIN</div>
                        <div className="text-sm font-bold text-slate-900">{listing.gst_number}</div>
                      </div>
                    )}
                    {listing.pan_number && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">PAN</div>
                        <div className="text-sm font-bold text-slate-900">{listing.pan_number}</div>
                      </div>
                    )}
                    {listing.budget_tier && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">Pricing Tier</div>
                        <div className="text-sm font-bold text-slate-900">{listing.budget_tier}</div>
                      </div>
                    )}
                  </div>
                )}

                {listing.services && listing.services.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      {['supplier', 'material_supplier'].includes(listing.category?.slug) ? 'Product Categories' : 'Services Offered'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.services.map((svc: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{svc}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {listing.achievements && listing.achievements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      {['builder'].includes(listing.category?.slug) ? 'Completed Projects' : 'Key Achievements'}
                    </h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {listing.achievements.map((ach: string, i: number) => (
                        <li key={i} className="text-sm text-slate-600">{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {listing.languages && listing.languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Languages Spoken</h3>
                    <div className="text-sm text-slate-600">
                      {listing.languages.join(", ")}
                    </div>
                  </div>
                )}
                
                {(listing.availability || listing.response_time) && (
                  <div className="space-y-3">
                    {listing.availability && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                          {['supplier', 'material_supplier'].includes(listing.category?.slug) ? 'Supply Capacity' : 'Availability'}
                        </h3>
                        <div className="text-sm text-slate-600">{listing.availability}</div>
                      </div>
                    )}
                    {listing.response_time && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">Typical Response Time</h3>
                        <div className="text-sm text-slate-600">{listing.response_time}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            {listing.gallery && listing.gallery.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-4">Project Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.gallery.map((img: any) => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden border">
                      <img src={img.image_url} alt="Portfolio item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <ReviewSection reviews={listing.reviews || []} reviewableType="listing" reviewableId={listing.id} professionalId={listing.user_id} />
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Business</h3>
              
              <ContactButtons listing={listing} />

              <div className="space-y-3">
                <InquiryForm type="Listing" id={listing.id} title={listing.title} />
                
                {listing.user && (
                  <Link href={`/messages?user_id=${listing.user.id}`} className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      Message Professional
                    </Button>
                  </Link>
                )}
              </div>

              {listing.is_premium && (
                <div className="mt-4 flex items-center justify-center text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Premium Member
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
