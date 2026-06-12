import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Paintbrush, Hammer, Sofa, Ruler } from "lucide-react"; // Fallback icons

export function Categories({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-slate-500 text-lg">
              Find exactly what you need for your home.
            </p>
          </div>
          <Link href="/categories" className="hidden md:inline-flex text-orange-600 font-semibold hover:text-orange-700">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.slice(0, 10).map((cat) => (
            <Link key={cat.id} href={`/search?category=${cat.slug}`}>
              <Card className="hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group bg-white border-slate-200">
                <CardContent className="p-6 flex flex-col items-center text-center justify-center min-h-[140px]">
                  <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {/* Use Lucide icon based on name or generic if not matched */}
                    {cat.name.includes("Interior") ? <Sofa /> : 
                     cat.name.includes("Architect") ? <Ruler /> : 
                     cat.name.includes("Paint") ? <Paintbrush /> : 
                     <Hammer />}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm md:text-base group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
