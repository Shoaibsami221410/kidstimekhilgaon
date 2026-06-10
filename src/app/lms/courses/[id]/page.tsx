"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, CheckCircle2, Lock, ChevronDown, Loader2, BookOpen } from "lucide-react"

export default function LMSCoursePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [course, setCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [])

  async function fetchCourseData() {
    setIsLoading(true)
    // 1. Fetch Course
    const { data: courseData } = await supabase.from('courses').select('*').eq('id', params.id).single()
    if (courseData) setCourse(courseData)

    // 2. Fetch Modules
    const { data: modulesData } = await supabase.from('modules').select('*').eq('course_id', params.id).order('order_index', { ascending: true })
    
    if (modulesData && modulesData.length > 0) {
      // 3. Fetch Lessons for these modules
      const moduleIds = modulesData.map(m => m.id)
      const { data: lessonsData } = await supabase.from('lessons').select('*').in('module_id', moduleIds).order('order_index', { ascending: true })
      
      const modulesWithLessons = modulesData.map(m => ({
        ...m,
        lessons: lessonsData?.filter(l => l.module_id === m.id) || []
      }))
      
      setModules(modulesWithLessons)
      setExpandedModules([modulesWithLessons[0].id])
      if (modulesWithLessons[0].lessons.length > 0) {
        setActiveLesson(modulesWithLessons[0].lessons[0])
      }
    }
    
    setIsLoading(false)
  }

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white h-16 flex items-center px-6 sticky top-0 z-10">
        <h1 className="font-bold text-lg truncate">Kids Time LMS <span className="mx-2 text-slate-500">/</span> {course.title}</h1>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Main Content Area */}
        <div className="flex-1 lg:border-r border-slate-200 bg-white">
          {activeLesson ? (
            <>
              <div className="aspect-video bg-black flex items-center justify-center relative group cursor-pointer">
                {activeLesson.video_url ? (
                  <div className="text-white text-center">
                    <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity text-orange-500" />
                    <p>Play {activeLesson.title}</p>
                    <p className="text-sm text-slate-400 mt-2">Video player integrated with Supabase Storage</p>
                  </div>
                ) : activeLesson.pdf_url ? (
                  <div className="text-white text-center">
                    <FileText className="w-20 h-20 mx-auto mb-4 text-blue-500" />
                    <Button className="bg-blue-600 hover:bg-blue-700">Download PDF Worksheet</Button>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <FileText className="w-20 h-20 mx-auto mb-4 text-emerald-500" />
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Read Content</Button>
                  </div>
                )}
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeLesson.title}</h2>
                <div className="prose max-w-none text-slate-600">
                  <p>{activeLesson.content || "No detailed description provided for this lesson."}</p>
                </div>
                <div className="mt-8 flex justify-between items-center border-t pt-6">
                  <Button variant="outline">Previous Lesson</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Mark as Complete & Next</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>No lessons available for this course yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar / Curriculum */}
        <div className="w-full lg:w-96 bg-slate-50 h-[calc(100vh-64px)] overflow-y-auto hidden lg:block">
          <div className="p-4 border-b bg-white sticky top-0 z-10">
            <h3 className="font-bold text-lg">Course Content</h3>
            <p className="text-sm text-slate-500">{modules.reduce((acc, m) => acc + m.lessons.length, 0)} total lessons</p>
          </div>
          <div className="p-4 space-y-4">
            {modules.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">No modules created yet.</p>
            ) : (
              modules.map((module) => (
                <Card key={module.id} className="border-0 shadow-sm overflow-hidden">
                  <button 
                    className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <h4 className="font-bold text-left text-sm">{module.title}</h4>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedModules.includes(module.id) && (
                    <div className="divide-y divide-slate-100">
                      {module.lessons.map((lesson: any) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex flex-col p-4 text-left transition-colors hover:bg-orange-50/50 ${activeLesson?.id === lesson.id ? 'bg-orange-50 border-l-2 border-orange-500' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className={`text-sm font-medium pr-4 ${activeLesson?.id === lesson.id ? 'text-orange-700' : 'text-slate-700'}`}>
                              {lesson.title}
                            </span>
                            <Lock className="w-4 h-4 text-slate-300 shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {lesson.video_url && <PlayCircle className="w-3 h-3" />}
                            {lesson.pdf_url && <FileText className="w-3 h-3" />}
                            <span className="capitalize">{lesson.video_url ? 'video' : lesson.pdf_url ? 'pdf' : 'text'}</span>
                          </div>
                        </button>
                      ))}
                      {module.lessons.length === 0 && (
                        <p className="text-xs text-slate-400 p-4">No lessons in this module.</p>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
