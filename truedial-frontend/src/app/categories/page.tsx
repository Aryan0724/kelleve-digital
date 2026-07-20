import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Store, Presentation, BookOpen, Stethoscope, Dumbbell } from "lucide-react";

const CATEGORIES = [
  { name: "Restaurants", icon: <Utensils className="w-8 h-8" />, color: "bg-red-50 text-red-600" },
  { name: "Hotels", icon: <Hotel className="w-8 h-8" />, color: "bg-blue-50 text-blue-600" },
  { name: "Hospitals", icon: <PlusSquare className="w-8 h-8" />, color: "bg-green-50 text-green-600" },
  { name: "Education", icon: <GraduationCap className="w-8 h-8" />, color: "bg-yellow-50 text-yellow-600" },
  { name: "Interior & Construction", icon: <HardHat className="w-8 h-8" />, color: "bg-orange-50 text-orange-600" },
  { name: "Automotive", icon: <Car className="w-8 h-8" />, color: "bg-gray-50 text-gray-600" },
  { name: "Electronics", icon: <Smartphone className="w-8 h-8" />, color: "bg-purple-50 text-purple-600" },
  { name: "Retail Stores", icon: <Store className="w-8 h-8" />, color: "bg-pink-50 text-pink-600" },
  { name: "IT Services", icon: <Presentation className="w-8 h-8" />, color: "bg-indigo-50 text-indigo-600" },
  { name: "Consulting", icon: <BookOpen className="w-8 h-8" />, color: "bg-teal-50 text-teal-600" },
  { name: "Health & Clinics", icon: <Stethoscope className="w-8 h-8" />, color: "bg-emerald-50 text-emerald-600" },
  { name: "Fitness & Gym", icon: <Dumbbell className="w-8 h-8" />, color: "bg-slate-50 text-slate-600" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center animate-fade-in-up">
            <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">Explore Top Categories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you are looking for. Browse through our extensive list of verified businesses across multiple sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <Link href={`/search?category=${encodeURIComponent(cat.name)}`} key={idx} className="animate-fade-in-up" style={{animationDelay: `${idx * 0.05}s`}}>
                <div className="premium-card rounded-xl p-6 flex flex-col items-center justify-center gap-4 h-full text-center group cursor-pointer">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${cat.color} dark:bg-opacity-20`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-navy dark:text-white text-sm">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
