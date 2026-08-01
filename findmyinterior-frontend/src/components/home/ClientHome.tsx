"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";
import { RoleBasedHomepage } from "@/components/home/RoleBasedHomepage";
import { AdSlot } from "@/components/ads/AdSlot";
import { BannerCTA } from "@/components/home/BannerCTA";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PublicProjects } from "@/components/home/PublicProjects";

export function ClientHome() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
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
        <div className="container mx-auto px-4 mt-6">
          <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
        </div>
        <RoleBasedHomepage />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 mt-2">
        <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
      </div>
      <Hero />
      <Categories categories={homeData?.categories} />
      <BannerCTA />
      <HowItWorks />
      
      {homeData?.open_leads?.length > 0 && (
        <PublicProjects title="Live Project Requirements" projects={homeData.open_leads} type="lead" />
      )}
      
      <FeaturedProfessionals pros={homeData?.featured_listings} />
      
      {homeData?.open_rfqs?.length > 0 && (
        <PublicProjects title="Urgent Material Requirements" projects={homeData.open_rfqs} type="rfq" />
      )}
      
      <Stats stats={homeData?.stats} />
      
      <div className="container mx-auto px-4 my-8">
        <AdSlot location="mid_page" className="w-full h-32 md:h-64 rounded-xl" />
      </div>
      <Hubs homeData={homeData} />
      <ActionBanner />
      <TrustFooter />
      <MobileStickyCTA />
    </>
  );
}