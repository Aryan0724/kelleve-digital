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
      
      {/* If there are no organic leads, fallback to our beautiful mock data */}
      {Object.keys(groupedLeads).length === 0 && (
        <>
          <PublicProjects 
            title="Featured Interior Projects" 
            projects={[
              { id: 101, title: "Modern 3BHK Flat Interior", category: { name: "Interior Designer" }, city: "Patna", budget_min: 500000, budget_max: 800000 },
              { id: 102, title: "Modular Kitchen Setup", category: { name: "Kitchen Designer" }, city: "Gaya", budget_min: 150000, budget_max: 200000 },
              { id: 103, title: "Office Space Renovation", category: { name: "Interior Contractor" }, city: "Muzaffarpur", budget_min: 1200000, budget_max: 1500000 },
            ]} 
            type="lead" 
          />
          <PublicProjects 
            title="Construction & Civil Works" 
            projects={[
              { id: 201, title: "New Commercial Building Construction", category: { name: "Civil Contractor" }, city: "Patna", budget_min: 5000000 },
              { id: 202, title: "Residential House Expansion", category: { name: "Builder" }, city: "Darbhanga", budget_min: 800000, budget_max: 1200000 },
              { id: 203, title: "Turnkey Bungalow Project", category: { name: "Turnkey Contractor" }, city: "Bhagalpur", budget_min: 8000000 },
            ]} 
            type="lead" 
          />
        </>
      )}

      {/* Urgent Material Requirements */}
      <PublicProjects 
        title="Urgent Material Requirements" 
        projects={homeData?.open_rfqs?.length > 0 ? homeData.open_rfqs : [
          { id: 301, title: "Bulk Cement & Steel for Hospital Project", category: { name: "Material Supply" }, city: "Patna", budget_min: 150000 },
          { id: 302, title: "Vitrified Tiles (2000 sq ft)", category: { name: "Tile Dealer" }, city: "Gaya", budget_min: 80000 },
          { id: 303, title: "Plywood and Laminates for Wardrobes", category: { name: "Plywood Dealer" }, city: "Muzaffarpur", budget_min: 45000 },
        ]} 
        type="rfq" 
      />

      {/* Latest Worker Jobs */}
      <PublicProjects 
        title="Daily Wage & Contract Jobs" 
        projects={homeData?.open_jobs?.length > 0 ? homeData.open_jobs : [
          { id: 401, title: "Need 5 Carpenters for Modular Kitchen fitting", category: { name: "Carpenter" }, city: "Patna", budget_min: 1000, budget_max: 1500 },
          { id: 402, title: "Painters required for full exterior painting", category: { name: "Painter" }, city: "Bhagalpur", budget_min: 800, budget_max: 1200 },
          { id: 403, title: "Electrician for complete residential wiring", category: { name: "Electrician" }, city: "Darbhanga", budget_min: 1200, budget_max: 1800 },
        ]} 
        type="job" 
      />
      
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