import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    category: string;
    city: string;
  };
}

const validCategories: Record<string, { title: string, searchParam: string, icon: string }> = {
  'interior-designers': { title: 'Interior Designers', searchParam: 'Interior Designer', icon: 'Sofa' },
  'architects': { title: 'Architects', searchParam: 'Architect', icon: 'Building2' },
  'contractors': { title: 'Contractors', searchParam: 'Contractor', icon: 'HardHat' },
  'builders': { title: 'Builders', searchParam: 'Builder', icon: 'Building' }
};



export function generateMetadata({ params }: Props): Metadata {
  const cat = params.category.toLowerCase();
  const city = params.city.toLowerCase();

  if (!validCategories[cat]) return {};

  const catName = validCategories[cat].title;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return {
    title: `Top ${catName} in ${cityName} | FindMyInterior`,
    description: `Find the best and verified ${catName.toLowerCase()} in ${cityName}, Bihar. Compare portfolios, read reviews, and get free quotes for your projects.`,
    keywords: [`${catName} in ${cityName}`, `Best ${catName} ${cityName}`, `Home Improvement ${cityName}`, 'FindMyInterior'],
    alternates: {
      canonical: `/${cat}/${city}`,
    },
    openGraph: {
      title: `Top ${catName} in ${cityName} | FindMyInterior`,
      description: `Connect with verified ${catName.toLowerCase()} in ${cityName}. Compare and hire today.`,
      url: `https://findmyinterior.com/${cat}/${city}`,
    }
  };
}

export default function CategoryCityLandingPage({ params }: Props) {
  const cat = params.category.toLowerCase();
  const city = params.city.toLowerCase();

  if (!validCategories[cat]) {
    notFound();
  }

  const catData = validCategories[cat];
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-[#0a1c3a] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full mb-6 border border-white/20 text-sm font-medium">
            Verified Professionals in {cityName}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find the Best <span className="text-[#E8701A]">{catData.title}</span> in {cityName}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Transform your space with top-rated {catData.title.toLowerCase()} in {cityName}. Compare profiles, check reviews, and get quotes for free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/post-requirement?category=${catData.searchParam}&city=${cityName}`}>
              <Button size="lg" className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold px-8 py-7 text-lg rounded-full shadow-xl w-full sm:w-auto">
                Get Free Quotes Now
              </Button>
            </Link>
            <Link href={`/professionals?search=${catData.searchParam}&city=${cityName}`}>
              <Button size="lg" variant="outline" className="border-slate-500 text-slate-200 hover:text-white hover:bg-slate-800 font-bold px-8 py-7 text-lg rounded-full w-full sm:w-auto">
                Browse Professionals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="bg-white border-b py-8 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center justify-center p-4">
              <ShieldCheck className="w-10 h-10 text-green-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-lg">100% Verified</h3>
              <p className="text-sm text-slate-500">All professionals pass our strict KYC checks</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Star className="w-10 h-10 text-yellow-500 mb-2 fill-yellow-500" />
              <h3 className="font-bold text-slate-800 text-lg">Trusted Reviews</h3>
              <p className="text-sm text-slate-500">Read genuine feedback from past clients</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <CheckCircle className="w-10 h-10 text-blue-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-lg">Free to Connect</h3>
              <p className="text-sm text-slate-500">Post your requirement and get bids for free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Hire {catData.title} in {cityName} through FindMyInterior?</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Finding reliable {catData.title.toLowerCase()} in {cityName} can be challenging. We bridge the gap by bringing you a curated list of the finest experts in the city. 
              Whether it's a small renovation or a massive commercial project, our professionals deliver quality on time and within budget.
            </p>
            <ul className="space-y-4">
              {[
                'Compare multiple competitive quotes',
                'View rich portfolios and past work',
                'Direct messaging with professionals',
                'Transparent pricing models',
                'Dedicated customer support'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[#E8701A] shrink-0 text-sm">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full blur-2xl opacity-60"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">How it works</h3>
            <div className="space-y-8 relative z-10">
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-[#0a1c3a] flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-[#0a1c3a] group-hover:text-white transition-colors shadow-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Post your requirement</h4>
                  <p className="text-slate-500">Tell us exactly what you need in {cityName}. It takes less than 2 minutes.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-[#0a1c3a] flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-[#0a1c3a] group-hover:text-white transition-colors shadow-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Get instant bids</h4>
                  <p className="text-slate-500">Receive custom quotes from available {catData.title.toLowerCase()}.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-[#0a1c3a] flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-[#0a1c3a] group-hover:text-white transition-colors shadow-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Hire the best</h4>
                  <p className="text-slate-500">Compare, chat, and award your project with confidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-[#E8701A] text-white py-20 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto">Ready to start your project in {cityName}?</h2>
        <p className="text-orange-100 mb-10 text-lg">Join thousands of happy customers who found their perfect match.</p>
        <Link href={`/post-requirement?category=${catData.searchParam}&city=${cityName}`}>
          <Button size="lg" className="bg-[#0a1c3a] hover:bg-[#0a1c3a]/90 text-white px-10 py-7 text-lg rounded-full shadow-2xl">
            Post Your Requirement <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
