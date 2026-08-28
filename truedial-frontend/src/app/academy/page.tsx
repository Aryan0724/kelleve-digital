"use client";

import { useState } from "react";
import { BookOpen, Clock, PlayCircle, Star, Users, Award, ChevronRight, Lock, CheckCircle, Mic, TrendingUp, DollarSign, Megaphone, BarChart2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORY_TABS = ["All", "Digital Marketing", "Sales & Leads", "Operations", "Finance", "Branding"];

const COURSES = [
  {
    id: 1,
    slug: "google-my-business-mastery",
    title: "Google My Business Mastery",
    subtitle: "Rank #1 Locally & Get 10x More Calls",
    instructor: "Arjun Mehta",
    instructorTitle: "SEO & Local Growth Expert",
    duration: "3h 20min",
    lessons: 18,
    rating: 4.8,
    students: 2340,
    price: "Free",
    category: "Digital Marketing",
    level: "Beginner",
    icon: TrendingUp,
    color: "from-[#E8701A] to-[#f59e0b]",
    topics: ["Profile optimization", "Review generation", "Q&A management", "Local SEO signals"],
  },
  {
    id: 2,
    slug: "closing-more-leads-phone",
    title: "Close More Leads on the Phone",
    subtitle: "Turn Every Inquiry into a Paying Customer",
    instructor: "Meera Pillai",
    instructorTitle: "Sales Trainer, 15yr Experience",
    duration: "2h 45min",
    lessons: 14,
    rating: 4.9,
    students: 1876,
    price: "Free",
    category: "Sales & Leads",
    level: "Beginner",
    icon: DollarSign,
    color: "from-[#7c3aed] to-[#4f46e5]",
    topics: ["Opening scripts", "Handling objections", "Pricing conversations", "Follow-up system"],
  },
  {
    id: 3,
    slug: "whatsapp-business-automation",
    title: "WhatsApp Business Automation",
    subtitle: "Build a 24/7 Lead Machine on WhatsApp",
    instructor: "Ravi Shankar",
    instructorTitle: "Digital Strategist",
    duration: "2h 10min",
    lessons: 12,
    rating: 4.7,
    students: 3102,
    price: "Free",
    category: "Digital Marketing",
    level: "Beginner",
    icon: Megaphone,
    color: "from-[#059669] to-[#0d9488]",
    topics: ["Catalog setup", "Quick replies", "Broadcast lists", "Auto-replies with WATI"],
  },
  {
    id: 4,
    slug: "pricing-for-profit",
    title: "Pricing for Profit",
    subtitle: "Stop Undercharging. Start Earning What You Deserve.",
    instructor: "Neha Gupta",
    instructorTitle: "Business Finance Coach",
    duration: "1h 55min",
    lessons: 10,
    rating: 4.6,
    students: 892,
    price: "₹499",
    category: "Finance",
    level: "Intermediate",
    icon: BarChart2,
    color: "from-[#0891b2] to-[#1d4ed8]",
    topics: ["Cost-based pricing", "Competitor benchmarking", "Value-based pricing", "Package offers"],
  },
  {
    id: 5,
    slug: "build-your-brand-identity",
    title: "Build Your Brand Identity",
    subtitle: "From Logo to Voice — A Complete Branding Bootcamp",
    instructor: "Priya Nair",
    instructorTitle: "Brand Designer & Strategist",
    duration: "4h 05min",
    lessons: 22,
    rating: 4.8,
    students: 1560,
    price: "₹799",
    category: "Branding",
    level: "Beginner",
    icon: Award,
    color: "from-[#dc2626] to-[#9333ea]",
    topics: ["Brand archetype", "Color & typography", "Logo brief", "Brand voice guide"],
  },
  {
    id: 6,
    slug: "staff-management-small-business",
    title: "Managing Staff in a Small Business",
    subtitle: "Hire Right. Retain Longer. Delegate Confidently.",
    instructor: "Suresh Kumar",
    instructorTitle: "Operations Consultant",
    duration: "3h 30min",
    lessons: 16,
    rating: 4.5,
    students: 724,
    price: "Free",
    category: "Operations",
    level: "Intermediate",
    icon: Users,
    color: "from-[#d97706] to-[#b45309]",
    topics: ["Job description writing", "Interview scripts", "SOP creation", "Performance reviews"],
  },
];

const EXPERTS = [
  { name: "Arjun Mehta", title: "Local SEO Expert", courses: 3, students: "5k+", color: "from-[#E8701A] to-[#f59e0b]" },
  { name: "Meera Pillai", title: "Sales Trainer", courses: 2, students: "3.2k+", color: "from-[#7c3aed] to-[#4f46e5]" },
  { name: "Neha Gupta", title: "Finance Coach", courses: 2, students: "1.8k+", color: "from-[#0891b2] to-[#1d4ed8]" },
  { name: "Priya Nair", title: "Brand Strategist", courses: 1, students: "1.5k+", color: "from-[#dc2626] to-[#9333ea]" },
];

const TESTIMONIALS = [
  { name: "Deepak Sharma", business: "Hair Salon, Jaipur", text: "The Google My Business course alone got me 3x more calls within a month. I was sceptical but it actually works.", stars: 5 },
  { name: "Anjali Verma", business: "Restaurant, Lucknow", text: "Meera's phone sales training changed how my staff talks to customers. We're converting more inquiries now.", stars: 5 },
  { name: "Manish Patel", business: "Electrical Contractor, Surat", text: "Finally understood how to price my services properly. Took the Finance course and added 30% to my margins.", stars: 5 },
];

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [playingCourse, setPlayingCourse] = useState<number | null>(null);

  const filtered = activeTab === "All"
    ? COURSES
    : COURSES.filter((c) => c.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f24]">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#0a1c3a] to-[#050f24] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E8701A]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8701A]/10 border border-[#E8701A]/30 rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-3.5 h-3.5 text-[#E8701A]" />
            <span className="text-[#E8701A] text-sm font-bold">TrueDial Academy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Master the Art of<br />
            <span className="text-[#E8701A]">Business Growth</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Learn from India's top entrepreneurs and consultants how to scale faster, market smarter, and build a business that lasts.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button className="bg-[#E8701A] hover:bg-[#c95d13] text-white text-base px-8 py-6 rounded-full shadow-lg shadow-[#E8701A]/20 border-0">
              <PlayCircle className="mr-2 h-5 w-5" /> Start Learning Free
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-base px-8 py-6 rounded-full">
              Browse All Courses
            </Button>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12">
            {[["120+", "Expert Courses"], ["5,000+", "Vendors Trained"], ["40+", "Industry Experts"], ["4.8★", "Avg. Rating"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{num}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Featured Masterclasses</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Highly rated courses by top entrepreneurs & consultants</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeTab === tab
                    ? "bg-[#E8701A] text-white border-[#E8701A]"
                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-[#E8701A] hover:text-[#E8701A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="group bg-white dark:bg-[#0a1c3a]/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className={`h-44 bg-gradient-to-br ${course.color} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <Icon className="w-16 h-16 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-black/30 text-white border-0 text-[10px]">{course.level}</Badge>
                    <Badge className={`${course.price === "Free" ? "bg-green-600" : "bg-[#E8701A]"} text-white border-0 text-[10px]`}>
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() => setPlayingCourse(course.id === playingCourse ? null : course.id)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all border border-white/30"
                    >
                      <PlayCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold text-[#E8701A] uppercase tracking-wider">{course.category}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug mb-1 group-hover:text-[#E8701A] dark:group-hover:text-[#E8701A] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mb-3 line-clamp-1">{course.subtitle}</p>

                  {/* Topics preview */}
                  <ul className="space-y-1 mb-4">
                    {course.topics.slice(0, 3).map((t) => (
                      <li key={t} className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/60">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                        {t}
                      </li>
                    ))}
                    {course.topics.length > 3 && (
                      <li className="text-xs text-slate-400 pl-5">+{course.topics.length - 3} more topics</li>
                    )}
                  </ul>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/40 mb-4 mt-auto border-t border-slate-100 dark:border-white/5 pt-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students.toLocaleString()}</span>
                    <span className="flex items-center gap-1 ml-auto text-yellow-500 font-semibold"><Star className="w-3 h-3 fill-yellow-400" />{course.rating}</span>
                  </div>

                  {/* Instructor + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{course.instructor}</p>
                      <p className="text-[10px] text-slate-400">{course.instructorTitle}</p>
                    </div>
                    <button className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-all hover:scale-105 bg-gradient-to-r ${course.color}`}>
                      {course.price === "Free" ? "Enroll Free" : `Buy ${course.price}`}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Expert Instructors ── */}
      <div className="bg-white dark:bg-[#0a1c3a]/30 border-y border-slate-200 dark:border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Meet Your Instructors</h2>
            <p className="text-slate-500 dark:text-slate-400">India's top operators, trainers, and consultants teaching real-world skills.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {EXPERTS.map((e) => (
              <div key={e.name} className="text-center group">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${e.color} mx-auto mb-3 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {e.name[0]}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{e.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{e.title}</p>
                <div className="flex justify-center gap-3 mt-2 text-[10px] text-slate-400">
                  <span>{e.courses} courses</span>
                  <span>·</span>
                  <span>{e.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-10">What Business Owners Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white dark:bg-[#0a1c3a]/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-white/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                <p className="text-xs text-slate-400">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#E8701A] to-[#f59e0b] rounded-3xl p-10 text-center shadow-2xl shadow-[#E8701A]/20">
          <GraduationCap className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-3xl font-extrabold text-white mb-3">Ready to Grow Faster?</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Join 5,000+ business owners learning on TrueDial Academy. Most courses are free — start today.</p>
          <button className="bg-white text-[#E8701A] font-extrabold rounded-full px-8 py-3.5 hover:scale-105 transition-transform shadow-lg">
            Browse All Free Courses →
          </button>
        </div>
      </div>

    </div>
  );
}
