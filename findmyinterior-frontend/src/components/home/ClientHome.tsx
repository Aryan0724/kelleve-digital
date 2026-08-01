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

  // Group open leads by category dynamically to create specific sections for businesses
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
      <div className="container mx-auto px-4 mt-6">
        <AdSlot location="hero_banner" className="w-full h-32 md:h-48 rounded-xl" />
      </div>
      <Hero />
      <Stats stats={homeData?.stats} />
      
      {/* Dynamic Project Sections grouped by Category */}
      {Object.entries(groupedLeads).map(([categoryName, projects]: [string, any]) => (
        <PublicProjects 
          key={categoryName} 
          title={`Live ${categoryName} Projects`} 
          projects={projects} 
          type="lead" 
        />
      ))}
      
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