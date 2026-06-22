import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white relative pb-16 md:pb-0">
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
