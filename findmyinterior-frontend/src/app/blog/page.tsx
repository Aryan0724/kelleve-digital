import { Tag } from "lucide-react";
import { getServerApiUrl } from "@/lib/serverApi";
import { BlogListClient } from "@/components/blog/BlogListClient";

async function getAllBlogs() {
  try {
    const res = await fetch(`${getServerApiUrl()}/blogs?per_page=100`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getAllBlogs();

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
        <BlogListClient initialBlogs={blogs} />
      </div>
    </div>
  );
}
