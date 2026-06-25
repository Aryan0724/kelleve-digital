import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";
import { RoleBasedHomepage } from "@/components/home/RoleBasedHomepage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Find & Hire The Best Interior Experts, Contractors, and Suppliers in Bihar. Compare quotes and save up to 30% on your next home project.",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white relative pb-16 md:pb-0">
      {/* Role-based personalized section for logged-in users */}
      <RoleBasedHomepage />
      <Hero />
      <Stats />
      <FeaturedProfessionals />
      <Categories />
      <Hubs />
      <ActionBanner />
      <TrustFooter />
      <MobileStickyCTA />
    </div>
  );
}

