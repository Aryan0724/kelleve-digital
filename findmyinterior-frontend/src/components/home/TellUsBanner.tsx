import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export function TellUsBanner() {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-slate-900 py-4 lg:hidden">
      <div className="container mx-auto px-4">
        <div className="bg-[#FFF5ED] dark:bg-orange-950/20 rounded-3xl p-5 flex items-center justify-between shadow-sm border border-orange-100 dark:border-orange-900/50">
          <div className="flex flex-col max-w-[65%]">
            <h3 className="text-sm font-black text-[#0a1c3a] dark:text-white leading-tight mb-1">
              Tell us what you need.
            </h3>
            <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-snug mb-3">
              Get quotes from verified professionals.
            </p>
            <Link href="/post-requirement">
              <button className="bg-[#E8701A] hover:bg-[#c25a12] text-white font-bold text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1 w-max shadow-md transition-colors">
                Post your requirement
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          
          <div className="w-[30%] flex justify-end">
            <div className="bg-orange-100 dark:bg-orange-900/50 w-16 h-16 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-[#E8701A]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
