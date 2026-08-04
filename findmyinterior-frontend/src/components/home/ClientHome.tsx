"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { TellUsBanner } from "@/components/home/TellUsBanner";
import { HowItWorksTimeline } from "@/components/home/HowItWorksTimeline";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";
import { RoleBasedHomepage } from "@/components/home/RoleBasedHomepage";
import { AdSlot } from "@/components/ads/AdSlot";
import { PublicProjects } from "@/components/home/PublicProjects";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { BeforeAfterGallery } from "@/components/home/BeforeAfterGallery";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { PopularCities } from "@/components/home/PopularCities";
import { BrandPartners } from "@/components/home/BrandPartners";
import { FAQ } from "@/components/home/FAQ";

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
    return <div className="min-h-screen bg-white dark:bg-background" />; // Prevent hydration mismatch flash
  }

  if (user && Object.keys(user).length > 0) {
    return (
      <>
        <RoleBasedHomepage />
        <div className="container mx-auto px-4 my-6">
          <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
        </div>
      </>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a]">
      {/* 2. Hero + AI Search */}
      <Hero />
      
      {/* 3. Trust Metrics */}
      <Stats stats={homeData?.stats} />
      
      {/* 4. Service Categories */}
      <div className="container mx-auto px-4 xl:px-8 mt-12 lg:mt-20 mb-8">
        <Categories categories={homeData?.categories} />
      </div>

      {/* 5. Featured Projects */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-16">
        <FeaturedProjects />
      </div>

      {/* 6. Top Professionals */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-16">
        <FeaturedProfessionals pros={homeData?.featured_listings} />
      </div>

      {/* Ad slot gracefully inserted */}
      <div className="container mx-auto px-4 xl:px-8 my-6 lg:my-10">
        <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
      </div>

      {/* 7. Before & After Gallery */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-16">
        <BeforeAfterGallery />
      </div>

      {/* 8. Why Choose Us */}
      <div className="container mx-auto px-4 xl:px-8">
        <WhyChooseUs />
      </div>

      {/* 9. Testimonials */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-16">
        <Testimonials />
      </div>

      {/* 10. Popular Cities */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-16">
        <PopularCities />
      </div>

      {/* 11. Brand Partners */}
      <div className="container mx-auto px-4 xl:px-8">
        <BrandPartners />
      </div>

      {/* 12. FAQ */}
      <div className="container mx-auto px-4 xl:px-8 lg:my-8 border-t border-slate-100 dark:border-slate-800">
        <FAQ />
      </div>

      {/* 13. Large Footer */}
      <TrustFooter />
      
      <MobileStickyCTA />
    </div>
  );
}