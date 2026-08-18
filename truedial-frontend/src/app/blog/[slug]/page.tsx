import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockBlogs } from '@/data/mockBlogs';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ChevronRight, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = mockBlogs.find(b => b.slug === resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = mockBlogs.filter(b => b.id !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Header with Background Image */}
      <section className="w-full relative h-[60vh] min-h-[450px] flex items-end pb-16">
        <Image 
          src={blog.imageUrl} 
          alt={blog.title} 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
            <Tag className="w-4 h-4" />
            {blog.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight max-w-4xl mx-auto">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-3">
              <Image src={blog.authorAvatar} alt={blog.author} width={40} height={40} className="rounded-full border-2 border-white/20" />
              <div className="text-left">
                <p className="text-white font-bold">{blog.author}</p>
                <p className="text-xs text-slate-400">{blog.authorRole}</p>
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:block"></div>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {blog.date}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:block"></div>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {blog.readTime}</span>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <article className="lg:w-2/3 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 relative">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
              </Link>
              
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              {/* Tags & Share */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-500">Share:</span>
                  <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3 flex flex-col gap-8">
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-[#1E3A8A] to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                <h3 className="text-2xl font-black mb-2 relative z-10">Get Expert Insights Weekly</h3>
                <p className="text-blue-100 text-sm mb-6 relative z-10">Join 10,000+ business owners receiving our best growth strategies directly in their inbox.</p>
                <div className="relative z-10">
                  <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3 backdrop-blur-sm" />
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">Subscribe Now</button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  Related Articles <ChevronRight className="w-5 h-5 text-orange-500" />
                </h3>
                <div className="flex flex-col gap-6">
                  {relatedBlogs.map(related => (
                    <Link href={`/blog/${related.slug}`} key={related.id} className="group flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0">
                        <Image src={related.imageUrl} alt={related.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                          {related.title}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">{related.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
