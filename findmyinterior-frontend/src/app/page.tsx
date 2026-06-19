import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import RecentActivityFeed from "@/components/home/RecentActivityFeed";
import { Categories } from "@/components/home/Categories";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white relative pb-16 md:pb-0">
      <Hero />
      <Stats />
      <FeaturedProfessionals />
      <RecentActivityFeed />
      <Categories />
      <Hubs />
      <ActionBanner />
      <TrustFooter />

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <Link href="/post-requirement">
          <button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold py-3.5 rounded-lg shadow-md transition text-center">
            Post Requirement (Free)
          </button>
        </Link>
      </div>
    </div>
  );
}
