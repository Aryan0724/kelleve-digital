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

  const interiorProjects = homeData?.open_leads?.filter((l: any) => l.category?.name?.toLowerCase().includes('interior') || l.category?.name?.toLowerCase().includes('architect')) || [];
  const contractProjects = homeData?.open_leads?.filter((l: any) => l.category?.name?.toLowerCase().includes('contractor') || l.category?.name?.toLowerCase().includes('civil') || l.category?.name?.toLowerCase().includes('build')) || [];
  const otherProjects = homeData?.open_leads?.filter((l: any) => !interiorProjects.includes(l) && !contractProjects.includes(l)) || [];

  return (
    <>
      <div className="container mx-auto px-4 mt-6">
        <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
      </div>
      <Hero />
      <Stats stats={homeData?.stats} />
      
      {/* Dynamic Project Sections */}
      {interiorProjects.length > 0 && (
        <PublicProjects title="Interior Design & Architecture Projects" projects={interiorProjects} type="lead" />
      )}
      {contractProjects.length > 0 && (
        <PublicProjects title="Construction & Contract Projects" projects={contractProjects} type="lead" />
      )}
      {otherProjects.length > 0 && (
        <PublicProjects title="Other Live Projects" projects={otherProjects} type="lead" />
      )}
      
      <FeaturedProfessionals pros={homeData?.featured_listings} />
      
      {homeData?.open_rfqs?.length > 0 && (
        <PublicProjects title="Urgent Material Requirements" projects={homeData.open_rfqs} type="rfq" />
      )}
      {homeData?.open_jobs?.length > 0 && (
        <PublicProjects title="Latest Worker Jobs" projects={homeData.open_jobs} type="job" />
      )}

      <Categories categories={homeData?.categories} />
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