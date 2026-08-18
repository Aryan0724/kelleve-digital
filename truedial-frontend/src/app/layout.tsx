import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrueDial — India's Business Discovery Platform",
  description: "Discover and connect with trusted local businesses across India. TrueDial is India's emerging business discovery and growth platform.",
};

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { RoleProvider } from "@/context/RoleContext";
import LocationSelectorModal from "@/components/shared/LocationSelectorModal";
import MobileNav from "@/components/layout/MobileNav";
import { TopRibbonAd } from "@/components/shared/AdPlacements/TopRibbonAd";
import { PopupAd } from "@/components/shared/AdPlacements/PopupAd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <TenantProvider>
          <AuthProvider>
            <RoleProvider>
              <LocationProvider>
                <TopRibbonAd />
                <PopupAd />
                {children}
                <MobileNav />
                <LocationSelectorModal />
              </LocationProvider>
            </RoleProvider>
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
