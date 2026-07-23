import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Wrench, HeartPulse, Building2, Landmark, Briefcase, Truck, Sofa, Camera, Scissors } from "lucide-react";

export default async function CategoriesPage() {
  // In a real implementation, we'd fetch categories from TrueDialAPI.getCategories()
  // For now, we'll use a hardcoded robust list like JustDial
  const ALL_CATEGORIES = [
    { name: "Restaurants", icon: Utensils, color: "bg-orange-100 text-orange-600", subcategories: ["Fine Dining", "Cafes", "Delivery", "Street Food"] },
    { name: "Hotels", icon: Hotel, color: "bg-blue-100 text-blue-600", subcategories: ["Resorts", "Budget Hotels", "Hostels", "Luxury"] },
    { name: "Hospitals", icon: PlusSquare, color: "bg-red-100 text-red-600", subcategories: ["Clinics", "Dentists", "Specialists", "Pharmacies"] },
    { name: "Education", icon: GraduationCap, color: "bg-green-100 text-green-600", subcategories: ["Schools", "Colleges", "Tutors", "Coaching"] },
    { name: "Interior Design", icon: HardHat, color: "bg-yellow-100 text-yellow-600", subcategories: ["Architects", "Decorators", "Modular Kitchens"] },
    { name: "Automobile", icon: Car, color: "bg-purple-100 text-purple-600", subcategories: ["Car Repair", "Bike Showrooms", "Accessories", "Car Wash"] },
    { name: "Electronics", icon: Smartphone, color: "bg-cyan-100 text-cyan-600", subcategories: ["Mobile Shops", "Repair Centers", "Computer Stores"] },
    { name: "Fitness", icon: HeartPulse, color: "bg-rose-100 text-rose-600", subcategories: ["Gyms", "Yoga", "Zumba", "Sports Clubs"] },
    { name: "Real Estate", icon: Building2, color: "bg-indigo-100 text-indigo-600", subcategories: ["Agents", "Builders", "Commercial Space"] },
    { name: "Financial", icon: Landmark, color: "bg-emerald-100 text-emerald-600", subcategories: ["CA", "Loans", "Insurance", "Mutual Funds"] },
    { name: "Services", icon: Wrench, color: "bg-gray-100 text-gray-600", subcategories: ["Plumbers", "Electricians", "Pest Control", "Carpenters"] },
    { name: "Packers & Movers", icon: Truck, color: "bg-amber-100 text-amber-600", subcategories: ["Local Shifting", "Intercity", "Vehicle Transport"] },
    { name: "Furniture", icon: Sofa, color: "bg-teal-100 text-teal-600", subcategories: ["Home Furniture", "Office", "Mattresses"] },
    { name: "Photography", icon: Camera, color: "bg-sky-100 text-sky-600", subcategories: ["Wedding", "Events", "Product", "Studios"] },
    { name: "Salons & Spa", icon: Scissors, color: "bg-fuchsia-100 text-fuchsia-600", subcategories: ["Hair Salons", "Massage", "Bridal Makeup", "Tattoos"] },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb]">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">All Categories</h1>
          <p className="text-gray-500 text-lg">Browse thousands of verified businesses by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color}`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy">{cat.name}</h3>
                  <Link href={`/search?category=${encodeURIComponent(cat.name)}`} className="text-sm text-primary hover:underline font-medium">
                    View All &gt;
                  </Link>
                </div>
              </div>
              
              <ul className="space-y-3">
                {cat.subcategories.map(sub => (
                  <li key={sub}>
                    <Link href={`/search?category=${encodeURIComponent(cat.name)}&q=${encodeURIComponent(sub)}`} className="text-gray-600 hover:text-primary transition flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
