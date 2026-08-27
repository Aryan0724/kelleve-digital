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

  // Group open leads by category dynamically to create specific sections for businesses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedLeads = (homeData?.open_leads || []).reduce((acc: any, lead: any) => {
    // Some categories might have ' Designer' or ' Contractor' in them. We can just use the name directly.
    const categoryName = lead.category?.name || 'General';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(lead);
    return acc;
  }, {});

  return (
    <>
      <Hero />
      <Categories categories={homeData?.categories} />
      <TellUsBanner />
      <HowItWorksTimeline />
      <FeaturedProfessionals pros={homeData?.featured_listings} />
      <div className="lg:hidden">
        <Stats stats={homeData?.stats} />
      </div>
      <div className="container mx-auto px-4 my-6">
        <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
      </div>
      
      {/* Dynamic Project Sections grouped by Category */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {Object.entries(groupedLeads).map(([categoryName, projects]: [string, any]) => (
        <PublicProjects 
          key={categoryName} 
          title={`Live ${categoryName} Projects`} 
          projects={projects} 
          type="lead" 
        />
      ))}
      
      {/* Urgent Material Requirements */}
      {homeData?.open_rfqs?.length > 0 && (
        <PublicProjects 
          title="Urgent Material Requirements" 
          projects={homeData.open_rfqs} 
          type="rfq" 
        />
      )}

      {/* Latest Worker Jobs */}
      {homeData?.open_jobs?.length > 0 && (
        <PublicProjects 
          title="Daily Wage & Contract Jobs" 
          projects={homeData.open_jobs} 
          type="job" 
        />
      )}
      
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