"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, Award, Clock, ChevronRight, CheckCircle2, Download } from "lucide-react";

export default function AcademyLMSPage() {
  const [activeTab, setActiveTab] = useState('enrolled');

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "Digital Marketing Mastery for Local Businesses",
      instructor: "Rahul Sharma",
      progress: 65,
      total_modules: 12,
      completed_modules: 8,
      next_lesson: "Facebook Ads Targeting",
      thumbnail: "bg-blue-500",
      status: "in_progress"
    },
    {
      id: 2,
      title: "GST Compliance & Accounting Basics",
      instructor: "CA Amit Patel",
      progress: 100,
      total_modules: 8,
      completed_modules: 8,
      next_lesson: null,
      thumbnail: "bg-purple-500",
      status: "completed",
      certificate_id: "TD-CERT-8902"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">TrueDial Academy</h1>
          <p className="text-muted-foreground mt-2">
            Your learning management system. Track progress and download certificates.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
          <BookOpen className="mr-2 h-4 w-4" />
          Browse New Courses
        </Button>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('enrolled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'enrolled' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          My Learning
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'certificates' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Certificates
        </button>
      </div>

      {activeTab === 'enrolled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="bg-white dark:bg-[#0a1c3a]/50 border-slate-200 dark:border-white/10 overflow-hidden shadow-xl backdrop-blur-md transition-all hover:-translate-y-1">
              <div className={`h-32 w-full ${course.thumbnail} relative flex items-center justify-center bg-opacity-80`}>
                <div className="absolute inset-0 bg-black/20" />
                <PlayCircle className="h-12 w-12 text-white opacity-80 z-10" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-0">
                    {course.completed_modules}/{course.total_modules} Modules
                  </Badge>
                  {course.status === 'completed' ? (
                    <Badge className="bg-green-500 text-white hover:bg-green-600 border-0">Completed</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-0">In Progress</Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Instructor: {course.instructor}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Progress</span>
                    <span className="text-slate-900 dark:text-white font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>

                {course.status === 'in_progress' ? (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Up Next</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{course.next_lesson}</p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                      Resume <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    Review Course Material
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrolledCourses.filter(c => c.status === 'completed').map((course) => (
            <Card key={course.id} className="bg-gradient-to-br from-slate-900 to-[#0a1c3a] border-white/10 text-white text-center p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-blue-200 mb-6">ID: {course.certificate_id}</p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </Card>
          ))}
          {enrolledCourses.filter(c => c.status === 'completed').length === 0 && (
            <div className="col-span-full text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
              <Award className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No certificates yet</h3>
              <p className="mt-2 text-sm text-slate-500">Complete a course to earn your first TrueDial certificate.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
