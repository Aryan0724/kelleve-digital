import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, Tag, ChevronRight } from "lucide-react";

const CATEGORIES = [
  "All",
  "Interior Design",
  "Construction",
  "Materials",
  "Tips & Tricks",
  "Vastu",
  "Budget Planning",
];

async function getBlogs(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === "string") {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://find-my-interior-1.onrender.com/api/v1"}/blogs?${params}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [], meta: { current_page: 1, last_page: 1, total: 0 } };
  }
}

function BlogCard({ blog }: { blog: any }) {
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
          <Badge className="absolute top-3 left-3 bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs">
            {blog.category}
          </Badge>
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const resolved = await searchParams;
  const { data: blogs, meta } = await getBlogs(resolved);
  const currentCategory = resolved.category || "All";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-orange-600/30">
            <Tag className="h-3.5 w-3.5" /> Bihar Home Improvement Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ideas, Guides &amp; Inspiration
          </h1>
          <p className="text-slate-300 text-lg">
            Expert advice on interior design, construction tips, material
            guides, and home improvement ideas tailored for Bihar.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => {
            const active =
              cat === "All" ? !resolved.category : resolved.category === cat;
            const href =
              cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  active
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-600"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Stats bar */}
        {meta?.total > 0 && (
          <p className="text-sm text-slate-500 mb-6 text-center">
            Showing <span className="font-semibold text-slate-800">{blogs.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{meta.total}</span> articles
            {currentCategory !== "All" && (
              <> in <span className="text-orange-600 font-medium">{currentCategory}</span></>
            )}
          </p>
        )}

        {/* Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
            <p className="text-slate-500">
              {currentCategory !== "All"
                ? `No articles in "${currentCategory}" yet.`
                : "No blog posts published yet."}
            </p>
            {currentCategory !== "All" && (
              <Link
                href="/blog"
                className="mt-4 inline-block text-orange-600 font-medium hover:underline"
              >
                View all articles →
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta?.last_page > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/blog?${new URLSearchParams({ ...resolved, page: String(page) })}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-all ${
                  meta.current_page === page
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-orange-400"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
