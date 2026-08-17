import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopRibbonAd } from "@/components/shared/AdPlacements/TopRibbonAd";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopRibbonAd />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-white">Find My Interior</h1>
            <p className="text-xl lg:text-2xl text-orange-400 font-bold mb-8 italic">"Where Projects Meet Professionals"</p>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Find My Interior is a technology-driven Home Improvement Marketplace built to connect Homeowners, Interior Designers, Architects, Builders, Contractors, Material Suppliers, Hardware Stores and Skilled Professionals on one platform.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-5xl">
          {/* Main Body */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12 mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              The Digital Ecosystem
            </h2>
            <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
              <p>
                Finding the right professional, getting competitive quotations, discovering reliable suppliers and connecting with genuine project opportunities can often be time-consuming and fragmented. Find My Interior is designed to bring these activities together in one digital ecosystem.
              </p>
              <p>
                Homeowners can post their Interior, Renovation or Construction requirements and connect with relevant professionals. Professionals and businesses can create their profiles, showcase their portfolios, discover suitable projects, submit bids, receive enquiries and build their digital presence.
              </p>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 my-8">
                <p className="text-xl font-bold text-slate-900 text-center italic">
                  "The right project should reach the right professional, and the right customer should find the right professional."
                </p>
              </div>
              <p>
                Unlike general business directories, Find My Interior focuses specifically on the Interior, Construction, Renovation and Home Improvement ecosystem.
              </p>
              <p>
                Our long-term vision is to build a trusted technology platform where the entire home improvement journey—from planning and design to materials, execution and skilled services—can become easier, more transparent and digitally connected.
              </p>
            </div>
          </div>

          {/* Vision and Mission Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-black text-orange-600 mb-4">Our Vision</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                To become India's leading digital ecosystem for Home Improvement, Interior and Construction services.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-black text-orange-600 mb-4">Our Mission</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                To connect customers and professionals through technology, project discovery, bidding, business profiles, trusted information and meaningful business opportunities.
              </p>
            </div>
          </div>

          {/* Founder Message */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white">
            <div className="p-8 lg:p-12 lg:pr-24 relative">
              <h2 className="text-3xl font-black text-white mb-8 tracking-wide">FOUNDER'S MESSAGE</h2>
              <h3 className="text-xl font-bold text-orange-400 mb-6 italic">“I have always believed that great businesses are created by solving real problems.”</h3>
              
              <div className="space-y-5 text-slate-300 text-lg leading-relaxed font-light mb-10 relative z-10">
                <p>
                  The idea behind Find My Interior came from observing how fragmented the Home Improvement industry can be.
                </p>
                <p>
                  When someone wants to build a home, renovate a property or create an interior, they often have to search separately for an Interior Designer, Architect, Contractor, Builder, Carpenter, Electrician, Hardware Shop, Material Supplier and many other professionals.
                </p>
                <p>
                  At the same time, thousands of capable professionals and businesses struggle to reach the right customers and discover genuine project opportunities.
                </p>
                <p className="font-bold text-white text-xl my-8 border-l-4 border-orange-500 pl-6">
                  Find My Interior was created to bridge this gap.
                </p>
                <p>
                  Our vision is not to build just another listing website. We are building a Home Improvement Ecosystem where projects, professionals, businesses, products and opportunities can come together on one platform.
                </p>
                <p>
                  We want technology to make the process simpler for homeowners, more productive for professionals and more accessible for businesses.
                </p>
                <p>
                  Our journey is just beginning, but our ambition is much bigger:
                  <strong className="block text-white font-medium mt-2">
                    To build a platform where every Home Improvement project can find the right professional, and every capable professional can find the right opportunity.
                  </strong>
                </p>
                <p>
                  I invite homeowners, professionals, businesses, brands and partners to join us in building this ecosystem together.
                </p>
              </div>

              <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative z-10">
                <div className="text-orange-400 font-bold text-xl space-y-1">
                  <p>Let’s build better homes.</p>
                  <p>Let’s build better businesses.</p>
                  <p>Let’s build the future of Home Improvement together.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white mb-1">Ratnesh Kumar</p>
                  <p className="text-slate-400 font-medium">Founder, Find My Interior</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
             <h2 className="text-3xl font-black text-slate-900 mb-2">Find My Interior</h2>
             <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Where Projects Meet Professionals.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
