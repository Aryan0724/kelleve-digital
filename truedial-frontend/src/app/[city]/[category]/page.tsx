import React, { use } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveBusinessesGrid from '@/components/home/LiveBusinessesGrid';
import { TrueDialAPI } from '@/lib/api';
import { MapPin, Search, Star, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    city: string;
    category: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, category } = await params;
  
  // Format strings for display (e.g. "interior-designers" -> "Interior Designers")
  const formattedCity = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formattedCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `Top 10 Best ${formattedCategory} in ${formattedCity} | TrueDial`,
    description: `Find the best verified ${formattedCategory} in ${formattedCity}. Compare ratings, reviews, and get instant quotes from top professionals with TrueDial's Privilege Card discounts.`,
    alternates: {
      canonical: `https://truedial.in/${city}/${category}`
    },
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCity} - TrueDial`,
      description: `Hire verified ${formattedCategory} in ${formattedCity}. View portfolios, prices, and reviews.`,
      url: `https://truedial.in/${city}/${category}`,
      siteName: 'TrueDial',
      images: [
        {
          url: 'https://truedial.in/og-image.jpg', // Placeholder
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default function CategoryCityPage({ params }: PageProps) {
  const { city, category } = use(params);
  
  const formattedCity = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formattedCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Generate JSON-LD Structured Data for LocalBusiness aggregation
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@type': 'LocalBusiness',
          'name': `Top ${formattedCategory} in ${formattedCity}`,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': formattedCity,
            'addressCountry': 'IN'
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] dark:bg-slate-950">
      <Navbar />
      
      {/* Inject JSON-LD into the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-[#f8fafc] dark:from-slate-900 dark:to-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-border text-xs font-bold text-muted-foreground mb-4 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            100% Verified Listings
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy dark:text-white mb-4">
            Best {formattedCategory} in <span className="text-primary">{formattedCity}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse through {formattedCity}'s top-rated {formattedCategory}. Compare profiles, read verified reviews, and book directly using your TrueDial Privilege Card for exclusive discounts.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar (Mocked for SEO structural purposes) */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="premium-card p-5 rounded-xl border border-border">
              <h3 className="font-bold text-foreground mb-4">Filter By</h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary" defaultChecked />
                  TrueDial Verified
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary" />
                  Top Rated (4.5+)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary" />
                  Accepts Privilege Card
                </label>
              </div>
            </div>
            
            <div className="premium-card p-5 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="font-bold text-primary mb-2">Can't decide?</h3>
              <p className="text-xs text-muted-foreground mb-4">Post your requirement and let the best {formattedCategory} contact you with quotes.</p>
              <Link href="/dashboard/vendor/requirements" className="block text-center bg-primary hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-bold transition shadow-md">
                Post Requirement Free
              </Link>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Showing results in {formattedCity}</h2>
              <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Sort by: Popularity</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Nearest</option>
              </select>
            </div>
            
            {/* Re-use the existing component which maps businesses */}
            <LiveBusinessesGrid filterCategory={formattedCategory} filterCity={formattedCity} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
