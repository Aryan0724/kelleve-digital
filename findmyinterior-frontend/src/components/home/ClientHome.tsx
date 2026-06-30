"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Categories } from "@/components/home/Categories";
import { Hubs } from "@/components/home/Hubs";
import { ActionBanner } from "@/components/home/ActionBanner";
import { TrustFooter } from "@/components/home/TrustFooter";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";
import { RoleBasedHomepage } from "@/components/home/RoleBasedHomepage";

export function ClientHome() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />; // Prevent hydration mismatch flash
  }

  if (user && Object.keys(user).length > 0) {
    return <RoleBasedHomepage />;
  }

  return (
    <>
      <Hero />
      <Stats />
      <FeaturedProfessionals />
      <Categories />
      <Hubs />
      <ActionBanner />
      <TrustFooter />
      <MobileStickyCTA />
    </>
  );
}