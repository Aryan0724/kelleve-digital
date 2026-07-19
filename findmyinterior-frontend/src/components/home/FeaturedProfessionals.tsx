"use client";

import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";

export function FeaturedProfessionals({ pros = [] }: { pros?: any[] }) {
  // Use passed data or empty array if not loaded yet
  const displayPros = pros && pros.length > 0 ? pros.slice(0, 4) : [];

  if (displayPros.length === 0) {
    return null; // or a skeleton loader if preferred
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0a1c3a] dark:text-white mb-2">Top Rated Professionals</h2>
            <p className="text-gray-600 dark:text-gray-400">Hire the most trusted experts in Bihar</p>
          </div>
          <Link href="/professionals" className="hidden md:block text-[#E8701A] font-semibold hover:underline">
            View All Experts →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPros.map((pro, i) => (
            <div key={pro.id || i} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                {pro.image_url ? (
                  <img src={pro.image_url} alt={pro.business_name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">{pro.business_name?.charAt(0)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1 line-clamp-1">
                    {pro.business_name} <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{pro.category?.name || "Professional"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {pro.rating || "4.5"} <span className="text-gray-400 font-normal">({pro.review_count || 0})</span>
                </div>
                <div className="w-[100px]">
                  <InquiryForm type="Listing" id={pro.id || 1} title={pro.business_name} />
                </div>
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
