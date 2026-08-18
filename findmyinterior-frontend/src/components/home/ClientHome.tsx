"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { BeforeAfterGallery } from "@/components/home/BeforeAfterGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { PopularCities } from "@/components/home/PopularCities";
import { BrandPartners } from "@/components/home/BrandPartners";
import { FAQ } from "@/components/home/FAQ";
import { RoleBasedHomepage } from "@/components/home/RoleBasedHomepage";
import { TrustFooter } from "@/components/home/TrustFooter";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";

export function ClientHome() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    api.get("/homepage").then((res) => {
      setHomeData(res.data.data);
    }).catch(console.error);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-900" />; 
  }

  if (user && Object.keys(user).length > 0) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <RoleBasedHomepage />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 overflow-x-hidden font-sans selection:bg-[#FF6B00] selection:text-white">
      
      {/* 1. Hero & Search */}
      <Hero />
      
      {/* 2. Trust Metrics */}
      <Stats stats={homeData?.stats} />
      
      {/* 3. Categories */}
      <div className="w-full mt-16 mb-20">
        <div className="container max-w-[1320px] mx-auto px-4">
          <Categories categories={homeData?.categories} />
        </div>
      </div>

      {/* 4. Featured Projects */}
      <div className="w-full my-20">
        <div className="container max-w-[1320px] mx-auto px-4">
          <FeaturedProjects />
        </div>
      </div>

      {/* 5. Top Professionals */}
      <div className="w-full my-20">
        <div className="container max-w-[1320px] mx-auto px-4">
          <FeaturedProfessionals pros={homeData?.featured_listings} />
        </div>
      </div>

      {/* 6. Brand Partners */}
      <div className="w-full my-20 py-10 bg-[#F8FAFC] dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container max-w-[1320px] mx-auto px-4">
          <BrandPartners />
        </div>
      </div>

      {/* 7. Before & After Gallery */}
      <div className="w-full my-24">
        <div className="container max-w-[1320px] mx-auto px-4">
          <BeforeAfterGallery />
        </div>
      </div>

      {/* 8. Testimonials */}
      <div className="w-full my-24">
        <div className="container max-w-[1320px] mx-auto px-4">
          <Testimonials />
        </div>
      </div>

      {/* 9. Popular Cities */}
      <div className="w-full my-24">
        <div className="container max-w-[1320px] mx-auto px-4">
          <PopularCities />
        </div>
      </div>

      {/* 10. FAQ */}
      <div className="w-full my-24">
        <div className="container max-w-[1320px] mx-auto px-4">
          <FAQ />
        </div>
      </div>

      {/* Footer */}
      <TrustFooter />
      
      <MobileStickyCTA />
    </div>
  );
}