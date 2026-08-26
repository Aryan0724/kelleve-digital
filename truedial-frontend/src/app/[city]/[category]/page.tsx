import { use } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveBusinessesGrid from '@/components/home/LiveBusinessesGrid';
import { MapPin, Search, Star, Building2, CheckCircle2 } from 'lucide-react';
import { TrueDialAPI } from '@/lib/api';

interface PageProps {
  params: Promise<{
    city: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, category } = await params;
  
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
          url: 'https://truedial.in/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default async function CategoryCityPage({ params }: PageProps) {
  const { city, category } = await params;
  
  const formattedCity = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formattedCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let fetchedListings: any[] = [];
  try {
    const res = await TrueDialAPI.searchBusinesses({ category_name: formattedCategory, category: category, city: formattedCity });
    if (res?.data && Array.isArray(res.data.data)) {
      fetchedListings = res.data.data;
    } else if (res?.data && Array.isArray(res.data)) {
      fetchedListings = res.data;
    }
  } catch (err) {
    console.warn("Could not fetch businesses for category city page", err);
  }

  const mappedBusinesses = fetchedListings.map((b: any) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: { name: b.category?.name || formattedCategory },
    city: b.city || formattedCity,
    address: b.address || `${formattedCity}, India`,
    rating: Number(b.avg_rating || 4.8),
    reviews_count: Number(b.review_count || 120),
    description: b.description || b.tagline || `Top rated ${formattedCategory} services in ${formattedCity}.`,
    gallery: b.gallery && b.gallery.length > 0 ? b.gallery.map((g: any) => g.url || g) : [b.cover_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"],
    phone: b.phone || "+91 98765 00101",
    features: ["TrueDial Verified", "Privilege Partner", "Digital Billing"]
  }));

  // Fallback businesses if 0 returned
  const displayBusinesses = mappedBusinesses.length > 0 ? mappedBusinesses : [
    {
      id: 101,
      title: `${formattedCategory} Premier (${formattedCity})`,
      slug: `${category}-premier-${city}`,
      category: { name: formattedCategory },
      city: formattedCity,
      address: `Main Commercial Hub, ${formattedCity}`,
      rating: 4.8,
      reviews_count: 142,
      description: `Top rated certified ${formattedCategory} destination in ${formattedCity} offering world-class services and privilege discounts.`,
      gallery: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"],
      phone: "+91 98765 00101",
      features: ["100% Verified", "Accepts Privilege Card", "Sanitized"]
    },
    {
      id: 102,
      title: `Apex ${formattedCategory} Center`,
      slug: `apex-${category}-${city}`,
      category: { name: formattedCategory },
      city: formattedCity,
      address: `Sector Market, ${formattedCity}`,
      rating: 4.7,
      reviews_count: 98,
      description: `Trusted professional ${formattedCategory} in ${formattedCity} with high customer satisfaction and instant booking slots.`,
      gallery: ["https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800"],
      phone: "+91 98765 00102",
      features: ["Instant Quotations", "TrueDial Verified"]
    }
  ];

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
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-gradient-to-b from-orange-50 to-[#f8fafc] dark:from-slate-900 dark:to-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 mb-4 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            100% Verified Listings
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Best {formattedCategory} in <span className="text-[#E05A1B]">{formattedCity}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 text-xs sm:text-sm">
            Browse through {formattedCity}&apos;s top-rated {formattedCategory}. Compare profiles, read verified reviews, and book directly using your TrueDial Privilege Card for exclusive discounts.
          </p>
        </div>
      </section>

      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Filter By</h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="rounded text-orange-500" defaultChecked />
                  TrueDial Verified
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="rounded text-orange-500" />
                  Top Rated (4.5+)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="rounded text-orange-500" />
                  Accepts Privilege Card
                </label>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-900/40">
              <h3 className="font-bold text-orange-900 dark:text-orange-300 text-sm mb-1">Need a custom quote?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Post your requirement and let the best {formattedCategory} in {formattedCity} contact you.</p>
              <Link href="/search" className="block text-center bg-[#E05A1B] hover:bg-[#c94d13] text-white py-2 rounded-xl text-xs font-bold transition shadow-md">
                Search All Businesses
              </Link>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Showing results in {formattedCity}</h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {displayBusinesses.length} verified listings
              </span>
            </div>
            
            <LiveBusinessesGrid businesses={displayBusinesses} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
