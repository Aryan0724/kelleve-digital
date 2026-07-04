import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Calendar, Eye, User, Tag, ArrowLeft, ChevronRight } from "lucide-react";

async function getBlog(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://find-my-interior-1.onrender.com/api/v1"}/blogs/${slug}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getBlog(slug);

  if (!result) notFound();

  const blog = result.data;
  const related: any[] = result.related ?? [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Cover */}
      <div className="relative w-full h-72 md:h-96 bg-slate-900 overflow-hidden">
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-orange-900" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 max-w-4xl">
            <Badge className="mb-3 bg-orange-600 text-white border-0">
              {blog.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b">
          {blog.author?.name && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-orange-400" />
              <span className="font-medium text-slate-700">{blog.author.name}</span>
            </span>
          )}
          {blog.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-orange-400" />
              {new Date(blog.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-orange-400" />
            {blog.views_count ?? 0} views
          </span>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 italic border-l-4 border-orange-400 pl-4">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900
            prose-ul:text-slate-700 prose-ol:text-slate-700
            prose-li:my-1
            prose-blockquote:border-orange-400 prose-blockquote:text-slate-600
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            {blog.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="bg-slate-50 py-12 mt-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-36 bg-slate-100 overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-2xl">
                        ✍️
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-orange-100 text-orange-700 border-0 text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm">
                      {post.title}
                    </h3>
                    <span className="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1">
                      Read more <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
