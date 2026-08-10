import "core-js/stable";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { GlobalLoginModal } from "@/components/auth/GlobalLoginModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PopupAd } from "@/components/ads/PopupAd";
import { TopRibbonAd } from "@/components/ads/TopRibbonAd";
import { AdSlot } from "@/components/ads/AdSlot";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://findmyinterior.com'),
  title: {
    default: "Best Interior Designers & Contractors in Patna | FindMyInterior",
    template: "%s | FindMyInterior",
  },
  description: "Find the Best Interior Designer, Civil Contractor, and Home Renovation Services in Patna, Bihar. Connect with top interior design companies, modular kitchen designers, and verified builders for residential and commercial projects.",
  keywords: [
    "Interior Designer Near Me", "Best Interior Designer", "Interior Designers in Patna", 
    "Home Interior Design", "Interior Design Company", "Interior Decoration Services", 
    "Interior Contractor", "Home Renovation Services", "Home Improvement Services", 
    "Residential Interior Designer", "Commercial Interior Designer", "Modular Kitchen Designer", 
    "False Ceiling Contractor", "Wardrobe Designer", "Office Interior Designer",
    "Civil Contractor Near Me", "Building Contractor", "House Construction Contractor", 
    "Renovation Contractor", "Turnkey Interior Contractor", "Painting Contractor", 
    "Plumbing Contractor", "Electrical Contractor", "Builders in Patna", 
    "Real Estate Developers", "Apartment Projects", "Villa Builders", "Residential Builder",
    "FindMyInterior", "Bihar"
  ],
  authors: [{ name: "FindMyInterior" }],
  creator: "FindMyInterior",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://findmyinterior.com",
    title: "FindMyInterior | Bihar's Home Improvement & Construction Marketplace",
    description: "Connect with verified interior designers, builders, suppliers, and skilled workers in Bihar.",
    siteName: "FindMyInterior",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FindMyInterior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FindMyInterior",
    description: "Bihar's leading Home Improvement & Construction Marketplace",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "FindMyInterior",
                "url": "https://findmyinterior.com",
                "logo": "https://findmyinterior.com/logo.png",
                "sameAs": [
                  "https://www.facebook.com/findmyinterior",
                  "https://www.instagram.com/findmyinterior",
                  "https://www.linkedin.com/company/findmyinterior"
                ]
              })
            }}
          />
          <TopRibbonAd />
          <Navbar />
          <PopupAd />
          <main className="flex-1 relative pb-16 lg:pb-0">
            {children}
          </main>
          <div className="container mx-auto px-4 my-8">
            <AdSlot location="before_footer" className="w-full h-32 md:h-48 rounded-xl" />
          </div>
          <Footer />
          <MobileBottomNav />
          <GlobalLoginModal />
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
