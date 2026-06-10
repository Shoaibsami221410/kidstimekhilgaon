"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Calendar, Clock, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const formSchema = z.object({
  title: z.string().min(2, "Required"),
  courseId: z.string().optional(),
  scheduledDate: z.string().min(1, "Required"),
  scheduledTime: z.string().min(1, "Required"),
  durationMinutes: z.string().min(1, "Required"),
  platform: z.string().min(1, "Required"),
  joinUrl: z.string().url("Must be a valid URL"),
})

export default function LiveClassesPage() {
  const [isScheduled, setIsScheduled] = useState(false)
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    fetchUpcomingClasses()
    fetchCourses()
  }, [])

  async function fetchCourses() {
    const { data } = await supabase
      .from('courses')
      .select('id, title')
      .order('created_at', { ascending: false })
    
    if (data) setCourses(data)
  }

  async function fetchUpcomingClasses() {
    const { data } = await supabase
      .from('live_classes')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .limit(10)
    
    if (data) setUpcomingClasses(data)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      courseId: "",
      scheduledDate: "",
      scheduledTime: "",
      durationMinutes: "45",
      platform: "Zoom",
      joinUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Combine date and time to ISO string
    const scheduledAt = new Date(`${values.scheduledDate}T${values.scheduledTime}`).toISOString()

    const { error } = await supabase.from('live_classes').insert([
      {
        title: values.title,
        course_id: values.courseId || null,
        scheduled_at: scheduledAt,
        duration_minutes: parseInt(values.durationMinutes),
        platform: values.platform,
        join_url: values.joinUrl
      }
    ])

    if (!error) {
      setIsScheduled(true)
      fetchUpcomingClasses()
      setTimeout(() => {
        setIsScheduled(false)
        form.reset()
      }, 3000)
    } else {
      console.error(error)
    }
  }

  const getMonthAbbr = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-us', { month: 'short' })
  }
  
  const getDay = (isoString: string) => {
    return new Date(isoString).getDate()
  }

  const getTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Live Classes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-orange-500" />
              Schedule New Class
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isScheduled ? (
              <div className="flex flex-col items-center justify-center py-12 text-green-600">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Class Scheduled Successfully!</h3>
                <p className="text-slate-500 mt-2">Students have been notified.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Class Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Interactive Storytelling Session" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Course</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map(course => (
                                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                              ))}
                              {courses.length === 0 && (
                                <SelectItem value="none" disabled>No courses available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Zoom">Zoom</SelectItem>
                              <SelectItem value="Google Meet">Google Meet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="date" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input type="time" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="durationMinutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (min)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="joinUrl"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Meeting URL (Zoom/Meet link)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://zoom.us/j/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Schedule Class
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-base">Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {upcomingClasses.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">No classes scheduled yet.</div>
              ) : (
                upcomingClasses.map((liveClass) => (
                  <div key={liveClass.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                    <div className="w-12 h-12 rounded bg-orange-100 text-orange-600 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold uppercase">{getMonthAbbr(liveClass.scheduled_at)}</span>
                      <span className="text-lg font-bold leading-none">{getDay(liveClass.scheduled_at)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{liveClass.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{getTime(liveClass.scheduled_at)} • {liveClass.duration_minutes} mins</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${liveClass.platform === 'Zoom' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {liveClass.platform}
                        </span>
                        <a href={liveClass.join_url} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 py-0.5 rounded-full font-medium">Join Link</a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
