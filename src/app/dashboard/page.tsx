"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, CalendarCheck, BookOpen, Clock, Loader2, ArrowRight, CalendarDays, MapPin } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    courses: 0,
    teachers: 0,
    enrollments: 0,
    trials: 0
  })
  
  const [recentTrials, setRecentTrials] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      
      try {
        // Fetch Counts concurrently
        const [
          { count: coursesCount },
          { count: teachersCount },
          { count: enrollmentsCount },
          { count: trialsCount },
          { data: trialData },
          { data: enrollData }
        ] = await Promise.all([
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }),
          supabase.from('trial_class_requests').select('*', { count: 'exact', head: true }),
          // Fetch Recent Trials
          supabase.from('trial_class_requests')
            .select('id, parent_name, child_name, child_age, status, created_at, courses(title)')
            .order('created_at', { ascending: false })
            .limit(5),
          // Fetch Upcoming Events
          supabase.from('events')
            .select('id, title, event_date, location')
            .gte('event_date', new Date().toISOString())
            .order('event_date', { ascending: true })
            .limit(5)
        ])

        setStats({
          courses: coursesCount || 0,
          teachers: teachersCount || 0,
          enrollments: enrollmentsCount || 0,
          trials: trialsCount || 0
        })

        if (trialData) setRecentTrials(trialData)
        if (enrollData) setUpcomingEvents(enrollData)

      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
          Live Data Sync
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.courses}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Students Enrolled</CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.enrollments}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Trials</CardTitle>
            <CalendarCheck className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.trials}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Teachers</CardTitle>
            <GraduationCap className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.teachers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Trial Requests */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Recent Trial Requests</CardTitle>
            <Link href="/dashboard/trial-classes" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentTrials.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No trial requests found.</div>
            ) : (
              <div className="divide-y">
                {recentTrials.map((trial) => (
                  <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{trial.parent_name}</p>
                      <p className="text-sm text-slate-500">
                        {trial.child_name} (Age: {trial.child_age})
                      </p>
                    </div>
                    <div className="text-right">

                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(trial.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Link href="/dashboard/events" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming events found.</div>
            ) : (
              <div className="divide-y">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{event.title}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {event.location || "TBA"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600 flex items-center gap-1 justify-end">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
