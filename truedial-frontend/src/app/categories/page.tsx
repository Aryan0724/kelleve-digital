import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Wrench, HeartPulse, Building2, Landmark, Briefcase, Truck, Sofa, Camera, Scissors, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

// Map strings from DB to lucide-react components
const iconMap: Record<string, any> = {
  Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Wrench, HeartPulse, Building2, Landmark, Briefcase, Truck, Sofa, Camera, Scissors
};

const defaultColors = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-red-100 text-red-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
  "bg-cyan-100 text-cyan-600",
  "bg-indigo-100 text-indigo-600",
];

export default async function CategoriesPage() {
  const response = await TrueDialAPI.getCategories();
  const dbCategories = response.success ? response.data : [];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb]">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">All Categories</h1>
          <p className="text-gray-500 text-lg">Browse thousands of verified businesses by category</p>
        </div>

        {dbCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold text-navy mb-2">No Categories Found</h2>
             <p className="text-gray-500">Categories are currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbCategories.map((cat: any, index: number) => {
              const IconComp = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : Tag;
              const colorClass = defaultColors[index % defaultColors.length];

              return (
                <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy">{cat.name}</h3>
                      <Link href={`/categories/${encodeURIComponent(cat.name)}`} className="text-sm text-primary hover:underline font-medium">
                        View Hub &gt;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
