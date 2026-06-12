import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Store, Star, ShieldCheck } from "lucide-react";

async function getSuppliers(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === 'string') {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/suppliers?${params}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { current_page: 1, last_page: 1 } };
  }
}

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: suppliers, meta } = await getSuppliers(resolvedSearchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Construction Materials & Suppliers</h1>
        <p className="text-slate-500 text-lg mb-8">Find top wholesale dealers and manufacturers for cement, steel, tiles, paints and more.</p>
        
        <form className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Store className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="type" defaultValue={resolvedSearchParams.type} placeholder="E.g. Cement, Tiles, Plywood" className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <div className="w-px bg-slate-200 hidden md:block" />
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <Input name="city" defaultValue={resolvedSearchParams.city} placeholder="City..." className="pl-10 h-12 border-0 focus-visible:ring-0 shadow-none text-base" />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-lg bg-orange-600 hover:bg-orange-700">Search</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {suppliers.length > 0 ? suppliers.map((supplier: any) => (
          <Link key={supplier.id} href={`/materials/${supplier.slug}`}>
            <Card className="h-full flex flex-col hover:border-orange-500 hover:shadow-md transition-all group overflow-hidden">
              <div className="flex items-start p-6 pb-4 border-b">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border">
                  {supplier.logo ? (
                    <img src={supplier.logo} alt={supplier.company_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Store /></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{supplier.company_name}</h3>
                    {supplier.is_verified && <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 ml-1" />}
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{supplier.business_type}</p>
                  <div className="flex items-center text-xs text-slate-400">
                    <MapPin className="h-3 w-3 mr-1" /> {supplier.city}, {supplier.district}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-0 flex-1">
                {/* Top Products Preview */}
                {supplier.products && supplier.products.length > 0 ? (
                  <div className="grid grid-cols-3 divide-x border-b">
                    {supplier.products.slice(0, 3).map((product: any) => (
                      <div key={product.id} className="p-3 text-center hover:bg-slate-50 transition-colors">
                        <div className="w-full h-16 bg-slate-100 rounded mb-2 overflow-hidden mx-auto">
                          {product.cover_image && <img src={product.cover_image} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-xs font-medium text-slate-700 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-orange-600 font-bold">{product.formatted_price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">No products listed yet</div>
                )}
                
                <div className="p-4 flex justify-between items-center bg-slate-50/50 mt-auto">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                    <span className="font-semibold text-sm">{supplier.avg_rating.toFixed(1)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors">
                    Contact Supplier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        )) : (
           <div className="col-span-full py-20 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed">
            No suppliers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
