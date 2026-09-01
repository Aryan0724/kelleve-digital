"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, DollarSign, Megaphone, BarChart2, 
  GraduationCap, PlayCircle, CheckCircle, Clock, 
  BookOpen, Users, Star, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrueDialAPI } from "@/lib/api";

const CATEGORY_TABS = ["All", "Sales", "Business", "Design", "Marketing", "Finance", "Branding"];

const EXPERTS = [
  { name: "Rahul Sharma", title: "Sales Coach", courses: 5, students: "12k+", color: "from-blue-500 to-indigo-600" },
  { name: "Priya Patel", title: "Digital Marketer", courses: 8, students: "20k+", color: "from-pink-500 to-rose-600" },
  { name: "Amit Kumar", title: "Business Consultant", courses: 3, students: "5k+", color: "from-emerald-500 to-teal-600" },
  { name: "Sneha Reddy", title: "Brand Strategist", courses: 4, students: "8k+", color: "from-orange-500 to-amber-600" }
];

const TESTIMONIALS = [
  { name: "Vikram S.", business: "Vikram Electronics", stars: 5, text: "The sales course completely changed how I pitch to clients. Revenue is up 30%!" },
  { name: "Ananya D.", business: "Ananya Interiors", stars: 5, text: "TrueDial Academy's branding masterclass helped me stand out in a crowded market." },
  { name: "Rajesh G.", business: "Rajesh Plumbing Services", stars: 4, text: "Practical, easy to understand, and highly actionable. Highly recommend it." }
];

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [playingCourse, setPlayingCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await TrueDialAPI.get('/academy');
        if (res.success && res.data) {
          // Map backend data to UI fields
          const mapped = res.data.map((c: any, index: number) => {
            const colors = [
              "from-[#E8701A] to-[#f59e0b]",
              "from-[#7c3aed] to-[#4f46e5]",
              "from-[#059669] to-[#0d9488]",
              "from-[#0891b2] to-[#1d4ed8]"
            ];
            const icons = [TrendingUp, DollarSign, Megaphone, BarChart2];
            return {
              ...c,
              subtitle: "Premium TrueDial Academy Class",
              instructorTitle: "Industry Expert",
              lessons: 10 + (index * 2),
              rating: 4.8,
              students: 1200 + (index * 400),
              price: "Free",
              level: "Beginner",
              icon: icons[index % icons.length],
              color: colors[index % colors.length],
              topics: ["Foundations", "Core principles", "Advanced techniques"]
            };
          });
          setCourses(mapped);
        }
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = activeTab === "All"
    ? courses
    : courses.filter((c) => c.category === activeTab);

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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#E8701A] border-t-transparent rounded-full"></div>
          </div>
        ) : (
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
                      {course.topics.slice(0, 3).map((t: string) => (
                        <li key={t} className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/60">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                          {t}
                        </li>
                      ))}
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
        )}
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
