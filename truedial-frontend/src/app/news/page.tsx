"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Radio, Newspaper, ArrowRight, Calendar } from "lucide-react";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/public/news`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#050f24]">
        <Loader2 className="h-12 w-12 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f24]">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge className="bg-[#E8701A] text-white hover:bg-[#c95d13] mb-4 border-0">TD News & Podcasts</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Stay Ahead of the <span className="text-[#E8701A]">Market</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Latest insights, regulatory updates, and exclusive interviews with industry leaders.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <Newspaper className="mr-2 text-[#E8701A]" /> Latest Stories
          </h2>
          <div className="flex space-x-2">
            <Badge variant="outline" className="cursor-pointer bg-white dark:bg-slate-800">All</Badge>
            <Badge variant="outline" className="cursor-pointer">News</Badge>
            <Badge variant="outline" className="cursor-pointer flex items-center"><Radio className="h-3 w-3 mr-1"/> Podcasts</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="group bg-white dark:bg-[#0a1c3a]/30 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                {article.category === 'Podcast' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 group-hover:bg-black/20 transition-colors">
                    <div className="h-16 w-16 rounded-full bg-[#E8701A] text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Radio className="h-8 w-8" />
                    </div>
                  </div>
                )}
                { }
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white border-0">
                  {article.category}
                </Badge>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#E8701A] transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" className="p-0 text-[#E8701A] hover:text-[#c95d13] hover:bg-transparent flex items-center">
                    {article.category === 'Podcast' ? 'Listen Now' : 'Read Article'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
