"use client";

import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function FeaturedProfessionals() {
  const pros = [
    { name: "Rahul Sharma", role: "Interior Designer", rating: 4.9, reviews: 124, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" },
    { name: "Apex Builders", role: "Contractor", rating: 4.8, reviews: 89, img: "https://images.unsplash.com/photo-1504307651254-35680f356f12?w=150&h=150&fit=crop" },
    { name: "Priya Singh", role: "Architect", rating: 5.0, reviews: 56, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" },
    { name: "Vikas Modulars", role: "Modular Kitchen", rating: 4.7, reviews: 210, img: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0a1c3a] mb-2">Top Rated Professionals</h2>
            <p className="text-gray-600">Hire the most trusted experts in Bihar</p>
          </div>
          <Link href="/professionals" className="hidden md:block text-[#E8701A] font-semibold hover:underline">
            View All Experts →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pros.map((pro, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <img src={pro.img} alt={pro.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-100" />
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-1">
                    {pro.name} <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </h3>
                  <p className="text-sm text-gray-500">{pro.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {pro.rating} <span className="text-gray-400 font-normal">({pro.reviews})</span>
                </div>
                <Link href="/post-requirement">
                  <button className="text-sm font-semibold text-[#E8701A] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-orange-100">
                    Get Quote
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/professionals" className="inline-block border border-[#E8701A] text-[#E8701A] font-semibold px-6 py-2 rounded-lg hover:bg-orange-50">
            View All Experts
          </Link>
        </div>
      </div>
    </section>
  );
}
