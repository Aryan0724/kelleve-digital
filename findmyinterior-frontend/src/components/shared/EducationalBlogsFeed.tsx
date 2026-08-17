"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export function EducationalBlogsFeed({ role }: { role: string }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get(`/blogs?target_audience=${role}&per_page=3`);
        setBlogs(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    if (role) {
      fetchBlogs();
    }
  }, [role]);

  if (loading || blogs.length === 0) return null;

  return (
    <div className="mb-10 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Pro Tips & Resources
        </h3>
        <Link href="/blog" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all h-full flex flex-col">
              {blog.cover_image && (
                <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden">
                  <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded">
                  {blog.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {blog.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
                {blog.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
