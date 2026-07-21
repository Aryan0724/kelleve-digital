import "core-js/stable";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://findmyinterior.com'),
  title: {
    default: "FindMyInterior | Bihar's Home Improvement & Construction Marketplace",
    template: "%s | FindMyInterior",
  },
  description: "Connect with verified interior designers, builders, suppliers, and skilled workers in Bihar. Find professionals or list your business today.",
  keywords: ["Interior Designers in Patna", "Builders in Bihar", "Home Improvement", "Construction Marketplace", "FindMyInterior"],
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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
