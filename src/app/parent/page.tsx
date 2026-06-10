"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarCheck, BookOpen, Clock, AlertCircle, Banknote, PlayCircle, Sparkles, ArrowRight } from "lucide-react"

const supabase = createClient()

export default function ParentOverviewPage() {
  const [user, setUser] = useState<any>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const renderCourseCard = (course: any) => (
    <div key={`available-${course.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100 text-orange-400">
            <PlayCircle className="w-16 h-16 opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {course.program_type === 'junior' ? 'Junior Program' : course.program_type === 'senior' ? 'Senior Program' : 'Featured'}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{course.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
          {course.description || "Unlock your child's creative potential with this specialized program designed for interactive learning."}
        </p>
        
        <Link href={`/admissions?course=${course.id}`} className="w-full">
          <button className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
            Enroll Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  )
  
  useEffect(() => {
    async function fetchParentData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch parent details
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUser({
          ...userData,
          full_name: userData?.full_name || user.user_metadata?.full_name || 'Parent'
        })

        // 1. Fetch ALL courses
        const { data: allCourses } = await supabase.from('courses').select('*')
        let allCoursesList = allCourses || []

        // 2. Fetch students for this parent and their enrolled courses
        const { data: students } = await supabase.from('students').select('id, first_name').eq('parent_id', user.id)
        
        let enrolledIds = new Set<string>()
        if (students && students.length > 0) {
          const studentIds = students.map(s => s.id)
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select(`
              course_id,
              student_id,
              courses (
                id,
                title,
                thumbnail_url,
                description
              )
            `)
            .in('student_id', studentIds)
          
          if (enrollments) {
            setEnrolledCourses(enrollments)
            enrollments.forEach(e => {
              if (e.course_id) enrolledIds.add(e.course_id)
            })
          }
        }

        // 3. Filter available courses (courses not enrolled in)
        const notEnrolled = allCoursesList.filter(c => !enrolledIds.has(c.id))
        setAvailableCourses(notEnrolled)
      }
      setLoading(false)
    }
    fetchParentData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {user?.full_name || 'Parent'}</h1>
          <p className="text-slate-500">Here is what's happening with your child's creative journey.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/parent/attendance" className="block hover:scale-[1.02] transition-transform">
          <Card className="border-l-4 border-l-blue-500 h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Attendance Tracker</CardTitle>
              <CalendarCheck className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">View Details</div>
              <p className="text-xs text-slate-500 mt-1">Check monthly present & absent records</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/parent/assignments" className="block hover:scale-[1.02] transition-transform">
          <Card className="border-l-4 border-l-orange-500 h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Assignments</CardTitle>
              <BookOpen className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">View Tasks</div>
              <p className="text-xs text-slate-500 mt-1">Filter by your enrolled courses</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Next Live Class</CardTitle>
            <Clock className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Art & Drawing</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Tomorrow, 4:00 PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Active Enrollments</h3>
            <p className="text-slate-500 mb-4">You are not currently enrolled in any courses.</p>
            <Link href="#discover-courses" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Discover Programs Below
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((enrollment, index) => {
              const course = enrollment.courses;
              if (!course) return null;
              return (
                <div key={`enrolled-${course.id}-${index}`} className="group relative overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <PlayCircle className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/parent/assignments" className="px-4 py-2 bg-white text-slate-900 font-medium rounded-lg text-sm">
                        View Course
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Active Enrollment</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Upsell / Discover New Courses Section */}
      {availableCourses.length > 0 && (
        <div id="discover-courses" className="pt-8 pb-4 space-y-10">
          
          {/* Junior Courses Group */}
          {availableCourses.some(c => c.program_type === 'junior') && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-bold text-slate-900">Kids Time Junior (Age 4-7)</h2>
              </div>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {availableCourses.filter(c => c.program_type === 'junior').map(renderCourseCard)}
              </div>
            </div>
          )}

          {/* Senior Courses Group */}
          {availableCourses.some(c => c.program_type === 'senior') && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-900">Kids Time Senior (Age 8-12)</h2>
              </div>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {availableCourses.filter(c => c.program_type === 'senior').map(renderCourseCard)}
              </div>
            </div>
          )}

          {/* All Ages / Other Programs */}
          {availableCourses.some(c => !['junior', 'senior'].includes(c.program_type)) && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-900">Other Featured Programs</h2>
              </div>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {availableCourses.filter(c => !['junior', 'senior'].includes(c.program_type)).map(renderCourseCard)}
              </div>
            </div>
          )}

        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Notifications regarding your child.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-slate-50">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">New Assignment Posted</p>
                <p className="text-xs text-slate-500 mt-1">Please check the 'Assignments' tab for the latest worksheet.</p>
              </div>
            </div>
            <div className="flex gap-4 p-3 rounded-lg border bg-slate-50">
              <CalendarCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Monthly Assessment Result</p>
                <p className="text-xs text-slate-500 mt-1">Your child performed excellently in the recent Storytelling assessment!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/parent/admissions" className="p-4 rounded-xl border text-center hover:bg-slate-50 transition-colors block">
              <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">View Admissions</p>
            </Link>
            <Link href="/parent/fees" className="p-4 rounded-xl border text-center hover:bg-slate-50 transition-colors block">
              <div className="w-10 h-10 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <Banknote className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Pay Fees</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
