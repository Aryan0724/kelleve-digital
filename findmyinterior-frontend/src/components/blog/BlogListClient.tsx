"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ChevronRight } from "lucide-react";

export function BlogCard({ blog }: { blog: any }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
          {blog.cover_image ? (
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
              <span className="text-4xl">✍️</span>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {blog.category}
          </span>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <h2 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
            {blog.title}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-3 flex-1 mb-4">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {blog.views_count ?? 0}
              </span>
            </div>
            <span className="text-orange-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Read <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const CATEGORIES = [
  "All",
  "Interior Design",
  "Construction",
  "Materials",
  "Tips & Tricks",
  "Vastu",
  "Budget Planning",
];

export function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [currentCategory, setCurrentCategory] = useState("All");

  const filteredBlogs = initialBlogs.filter(
    (blog) => currentCategory === "All" || blog.category === currentCategory
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCurrentCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              currentCategory === cat
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredBlogs.length > 0 && (
        <p className="text-sm text-slate-500 mb-6 text-center">
          Showing <span className="font-semibold text-slate-800">{filteredBlogs.length}</span> articles
          {currentCategory !== "All" && (
            <> in <span className="text-orange-600 font-medium">{currentCategory}</span></>
          )}
        </p>
      )}

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
          <p className="text-slate-500 mb-4">
            No articles in "{currentCategory}" yet.
          </p>
          <button
            onClick={() => setCurrentCategory("All")}
            className="inline-block text-orange-600 font-medium hover:underline"
          >
            View all articles →
          </button>
        </div>
      )}
    </>
  );
}
