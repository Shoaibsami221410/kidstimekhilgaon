"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  // React 19+ requires unwrapping params if it's a promise, but in Next.js 14 Client Components useParams is synchronous.
  const courseId = params.id as string
  const supabase = createClient()
  
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()
        
      if (data) {
        setCourse(data)
      } else {
        alert("Course not found!")
        router.push("/dashboard/courses")
      }
      setLoading(false)
    }
    
    fetchCourse()
  }, [courseId, router])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const thumbnail_url = formData.get('thumbnail_url') as string
    const min_age = parseInt(formData.get('min_age') as string) || 4
    const max_age = parseInt(formData.get('max_age') as string) || 12

    const { error } = await supabase
      .from('courses')
      .update({ 
        title, 
        description,
        thumbnail_url,
        min_age,
        max_age
      })
      .eq('id', courseId)

    setIsSaving(false)
    
    if (!error) {
      alert("Course updated successfully!")
      router.push("/dashboard/courses")
    } else {
      alert("Error updating course: " + error.message)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Course</h1>
          <p className="text-slate-500 text-sm">Update the details for this program.</p>
        </div>
      </div>

      <Card className="max-w-2xl shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Course Details</CardTitle>
          <CardDescription>ID: {courseId}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" name="title" defaultValue={course?.title} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL (Image Link)</Label>
              <Input id="thumbnail_url" name="thumbnail_url" defaultValue={course?.thumbnail_url} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_age">Min Age</Label>
                <Input id="min_age" name="min_age" type="number" defaultValue={course?.min_age || 4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_age">Max Age</Label>
                <Input id="max_age" name="max_age" type="number" defaultValue={course?.max_age || 12} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={course?.description} rows={5} />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/courses")} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="flex-1 bg-orange-500 hover:bg-orange-600">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
