import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlayCircle, BookOpen, Trophy, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const COURSES = [
  { title: "Mastering Local SEO", duration: "45 mins", level: "Beginner", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop" },
  { title: "How to convert Leads into Sales", duration: "1h 20m", level: "Intermediate", image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=800&auto=format&fit=crop" },
  { title: "Optimizing your TrueDial Profile", duration: "25 mins", level: "Beginner", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background pb-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-navy">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-primary font-medium text-sm mb-6 animate-fade-in-up">
              <Trophy className="w-4 h-4" /> TrueDial Business Academy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Grow your business <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">like a Pro.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Free courses, tutorials, and insider secrets to help you dominate local search, attract more customers, and skyrocket your revenue.
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="container mx-auto px-6 -mt-16 relative z-20">
          <div className="flex justify-between items-end mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div>
              <h2 className="text-2xl font-bold text-navy dark:text-white">Trending Courses</h2>
              <p className="text-muted-foreground mt-1">Start learning from industry experts.</p>
            </div>
            <Link href="/academy/courses" className="text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COURSES.map((course, idx) => (
              <div key={idx} className="premium-card rounded-2xl overflow-hidden group cursor-pointer animate-fade-in-up" style={{animationDelay: `${0.4 + (idx * 0.1)}s`}}>
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  </div>
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                    <span className="bg-navy/80 backdrop-blur text-white text-xs px-2 py-1 rounded font-medium">{course.duration}</span>
                    <span className="bg-primary/90 backdrop-blur text-white text-xs px-2 py-1 rounded font-medium">{course.level}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-orange-500 mb-2">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">Learn the fundamental strategies to rank higher on TrueDial and Google.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources & Guides */}
        <section className="container mx-auto px-6 mt-24">
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-navy dark:text-white">Business Resource Library</h2>
              <p className="text-muted-foreground">
                Download free e-books, checklists, and marketing templates designed specifically for Indian SMEs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> The 2026 Local Marketing Checklist</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> How to handle negative reviews</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Ultimate Guide to SMS Marketing</li>
              </ul>
              <Link href="/academy/library">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                  Browse Library
                </button>
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transform rotate-3 scale-105 -z-10"></div>
              <img src="https://images.unsplash.com/photo-1553484771-047a44eee27b?q=80&w=800&auto=format&fit=crop" alt="Resources" className="rounded-2xl shadow-2xl border border-border" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
