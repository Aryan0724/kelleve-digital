import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, User, TrendingUp, Tag, Search } from "lucide-react";
import { mockBlogs } from '@/data/mockBlogs';

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const featuredBlog = mockBlogs[0];
  const regularBlogs = mockBlogs.slice(1);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-[#1E3A8A] dark:bg-slate-900 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            TrueDial Business Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Strategies to Grow Your <br className="hidden md:block" /> Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Exponentially</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium mb-10">
            Expert guides, marketing tips, and local SEO strategies to help you dominate your local market.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or topics..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/30 text-slate-900 font-medium shadow-xl transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-md text-sm">
              Search
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full pb-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Post */}
          <Link href={`/blog/${featuredBlog.slug}`} className="group block bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mb-16">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5 h-64 md:h-[400px] relative overflow-hidden">
                <Image 
                  src={featuredBlog.imageUrl} 
                  alt={featuredBlog.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                  Featured
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {featuredBlog.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {featuredBlog.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8 line-clamp-3">
                  {featuredBlog.excerpt}
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <Image src={featuredBlog.authorAvatar} alt={featuredBlog.author} width={40} height={40} className="rounded-full border-2 border-slate-100 dark:border-slate-800" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{featuredBlog.author}</p>
                    <p className="text-xs text-slate-500 font-medium">{featuredBlog.date} · {featuredBlog.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Categories Tab */}
          <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-10 pb-2">
            {['All Articles', 'Marketing', 'Sales', 'SEO & Growth', 'Tech & Trends', 'Case Studies'].map((cat, i) => (
              <button 
                key={i} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recent Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider shadow-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[18px] font-black text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src={blog.authorAvatar} alt={blog.author} width={28} height={28} className="rounded-full" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{blog.author}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
