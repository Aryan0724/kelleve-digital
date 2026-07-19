import { InquiryForm } from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ShieldCheck, Box, Package, Truck, Info, Store } from "lucide-react";
import { notFound } from "next/navigation";

async function getSupplier(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/suppliers/${slug}`, {
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

export default async function SupplierProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = await getSupplier(slug);
  if (!supplier) return notFound();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              {supplier.logo ? (
                <img src={supplier.logo} alt={supplier.company_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Store className="h-16 w-16" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{supplier.company_name}</h1>
                    {supplier.is_verified && <ShieldCheck className="h-8 w-8 text-green-500 shrink-0" />}
                  </div>
                  <div className="flex items-center text-slate-500 mb-4 text-lg">
                    <MapPin className="h-5 w-5 mr-1" /> {supplier.address}, {supplier.city}, {supplier.district}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700">{supplier.business_type}</Badge>
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-500 mr-1"/> {supplier.avg_rating.toFixed(1)} Rating
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full md:w-72">
                  <InquiryForm type="Supplier" id={supplier.id} title={supplier.company_name} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center text-sm text-slate-600">
                  <Package className="h-5 w-5 mr-2 text-slate-400"/> Wholesale & Retail
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Truck className="h-5 w-5 mr-2 text-slate-400"/> Delivery Available
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Box className="h-5 w-5 mr-2 text-slate-400"/> Bulk Orders
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Info className="h-5 w-5 mr-2 text-slate-400"/> GST Verified
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Products Area */}
          <div className="w-full lg:w-3/4 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Product Catalog</h2>
            
            {supplier.products && supplier.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplier.products.map((product: any) => (
                  <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-48 bg-slate-100 w-full overflow-hidden">
                      {product.cover_image ? (
                        <img src={product.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 mb-1">{product.name}</h3>
                      <div className="text-xs text-slate-500 mb-3 line-clamp-1">{product.description}</div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="text-orange-600 font-bold text-lg">{product.formatted_price} <span className="text-xs text-slate-500 font-normal">/ unit</span></div>
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">MOQ: {product.moq}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed py-16 text-center text-slate-500">
                No products listed yet. Contact supplier for catalog.
              </div>
            )}

            {/* Reviews Section */}
            <div className="mt-12">
              <ReviewSection reviews={supplier.reviews || []} reviewableType="supplier" reviewableId={supplier.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-4 mb-4">About the Company</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                {supplier.description}
              </p>
              
              <div className="space-y-4">
                {supplier.gst_number && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">GST Number</div>
                    <div className="text-sm font-medium text-slate-900">{supplier.gst_number}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">Member Since</div>
                  <div className="text-sm font-medium text-slate-900">{new Date(supplier.created_at).getFullYear()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
