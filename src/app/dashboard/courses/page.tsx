"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, BookOpen, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardCoursesPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    if (data) setCourses(data)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    const { error } = await supabase.from('courses').insert([{ title, description }])

    setIsSaving(false)
    if (!error) {
      setShowSuccess(true)
      fetchCourses()
      e.currentTarget.reset()
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage LMS Courses</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" />
              Create Course
            </CardTitle>
            <CardDescription>Add a new course to the LMS.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {showSuccess && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Course created successfully!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" name="title" placeholder="e.g. Early Literacy Foundation" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Course overview..." rows={4} />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full bg-orange-500 hover:bg-orange-600">
                {isSaving ? "Saving..." : "Create Course"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              All Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {courses.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No courses created yet.</p>
            ) : (
              courses.map(course => (
                <div key={course.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/courses/${course.id}`}>Manage Modules</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
