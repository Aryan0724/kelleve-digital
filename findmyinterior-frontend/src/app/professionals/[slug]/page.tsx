import { InquiryForm } from "@/components/forms/InquiryForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReviewSection from "@/components/reviews/ReviewSection";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ShieldCheck, Phone, Mail, Globe, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

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
                    {listing.is_verified && <span title="Verified Business"><ShieldCheck className="h-8 w-8 text-green-500 flex-shrink-0" /></span>}
                  </div>
                  <div className="flex items-center text-slate-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" /> {listing.address}, {listing.city}, {listing.district}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{listing.category?.name}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                      <span className="font-semibold text-slate-900 mr-1">{listing.avg_rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-sm">({listing.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-4">About Us</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
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
            <ReviewSection reviews={listing.reviews || []} reviewableType="listing" reviewableId={listing.id} />
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Business</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Phone className="h-5 w-5 text-slate-400 mr-3" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Phone Number</div>
                    <div className="text-slate-900 font-semibold">{listing.phone || '+91 ***** *****'}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Mail className="h-5 w-5 text-slate-400 mr-3" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Email Address</div>
                    <div className="text-slate-900 font-semibold">{listing.email || 'hidden@example.com'}</div>
                  </div>
                </div>
                {listing.website && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Globe className="h-5 w-5 text-slate-400 mr-3" />
                    <a href={listing.website} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

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
