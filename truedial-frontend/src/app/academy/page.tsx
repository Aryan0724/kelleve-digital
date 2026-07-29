"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, PlayCircle, Star } from "lucide-react";

export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/public/academy/courses`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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
      <div className="bg-gradient-to-br from-[#0a1c3a] to-[#050f24] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[#E8701A]/20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge className="bg-[#E8701A] text-white hover:bg-[#c95d13] mb-6 border-0">TrueDial Academy</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Master the Art of <span className="text-[#E8701A]">Business Growth</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Learn from industry experts how to scale your services, leverage digital marketing, and build a lasting brand.
          </p>
          <Button className="bg-[#E8701A] hover:bg-[#c95d13] text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-[#E8701A]/20 transition-transform hover:-translate-y-1 border-0">
            <PlayCircle className="mr-2 h-6 w-6" /> Start Learning Free
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Masterclasses</h2>
            <p className="text-slate-500 mt-2">Highly rated courses by top entrepreneurs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="group bg-white dark:bg-[#0a1c3a]/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <Badge className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white border-0">
                  {course.level}
                </Badge>
                { }
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-[#E8701A] font-medium mb-3">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Business & Marketing
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex items-center">
                  By <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">{course.instructor}</span>
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10 pt-4 mb-4">
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {course.duration}</span>
                  <span className="flex items-center text-yellow-500"><Star className="h-4 w-4 mr-1 fill-current" /> 4.9</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </span>
                  <Button variant="outline" className="dark:text-white dark:border-white/20 dark:hover:bg-white/10">
                    Enroll Now
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
