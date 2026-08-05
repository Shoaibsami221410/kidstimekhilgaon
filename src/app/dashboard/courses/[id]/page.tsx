"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react"
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
  const [syllabus, setSyllabus] = useState<any[]>([])

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
        if (data.syllabus) {
          try {
            setSyllabus(typeof data.syllabus === 'string' ? JSON.parse(data.syllabus) : data.syllabus)
          } catch (e) {
            console.error("Failed to parse syllabus", e)
          }
        }
      } else {
        alert("Course not found!")
        router.push("/dashboard/courses")
      }
      setLoading(false)
    }
    
    fetchCourse()
  }, [courseId, router])

  const addSyllabusWeek = () => {
    setSyllabus([...syllabus, { week: `Week ${syllabus.length + 1}`, title: "", description: "" }])
  }

  const updateSyllabus = (index: number, field: string, value: string) => {
    const newSyllabus = [...syllabus]
    newSyllabus[index][field] = value
    setSyllabus(newSyllabus)
  }

  const removeSyllabusWeek = (index: number) => {
    const newSyllabus = [...syllabus]
    newSyllabus.splice(index, 1)
    setSyllabus(newSyllabus)
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const thumbnail_url = formData.get('thumbnail_url') as string
    const duration = formData.get('duration') as string
    const min_age = parseInt(formData.get('min_age') as string) || 4
    const max_age = parseInt(formData.get('max_age') as string) || 12

    const { error } = await supabase
      .from('courses')
      .update({ 
        title, 
        description,
        thumbnail_url,
        duration,
        min_age,
        max_age,
        syllabus
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
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Course</h1>
          <p className="text-slate-500 text-sm">Update the details for this program.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" name="title" defaultValue={course?.title} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={course?.description} rows={5} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle>Syllabus Editor</CardTitle>
                <CardDescription>Build the course curriculum week by week.</CardDescription>
              </div>
              <Button type="button" onClick={addSyllabusWeek} variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Week
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {syllabus.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  No syllabus added yet. Click "Add Week" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {syllabus.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm relative group">
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                            <Label className="text-xs text-slate-500 mb-1 block">Week/Session Label</Label>
                            <Input 
                              value={item.week} 
                              onChange={(e) => updateSyllabus(index, 'week', e.target.value)} 
                              placeholder="e.g. Week 1" 
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-slate-500 mb-1 block">Topic Title</Label>
                            <Input 
                              value={item.title} 
                              onChange={(e) => updateSyllabus(index, 'title', e.target.value)} 
                              placeholder="Topic Name" 
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Description</Label>
                          <Textarea 
                            value={item.description} 
                            onChange={(e) => updateSyllabus(index, 'description', e.target.value)} 
                            placeholder="What will they learn?"
                            rows={2}
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeSyllabusWeek(index)}
                        className="text-slate-300 hover:text-red-500 transition-colors self-start p-2"
                        title="Remove Week"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200 sticky top-6">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input id="thumbnail_url" name="thumbnail_url" defaultValue={course?.thumbnail_url} />
                {course?.thumbnail_url && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden border">
                    <img src={course.thumbnail_url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Course Duration</Label>
                <Input id="duration" name="duration" defaultValue={course?.duration} placeholder="e.g. 6 Months" />
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
              
              <div className="pt-6">
                <Button type="submit" disabled={isSaving} className="w-full bg-[#00b4ff] hover:bg-blue-600 text-white shadow-md">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
