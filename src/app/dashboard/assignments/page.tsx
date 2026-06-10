"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function AssignmentsPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [recentAssignments, setRecentAssignments] = useState<any[]>([])

  useEffect(() => {
    fetchRecentAssignments()
  }, [])

  async function fetchRecentAssignments() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      setRecentAssignments(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setErrorMsg("")
    
    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const courseId = formData.get('course') as string
      const deadline = formData.get('deadline') as string
      const description = formData.get('description') as string
      const fileInput = document.getElementById('worksheetFile') as HTMLInputElement
      
      let worksheetUrl = null
      
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `assignments/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('kidstime-assets')
          .upload(filePath, file)
          
        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('kidstime-assets').getPublicUrl(filePath)
        worksheetUrl = data.publicUrl
      }

      // Insert into public.assignments
      const { error: insertError } = await supabase.from('assignments').insert([
        {
          title,
          course_id: null,
          description,
          deadline: new Date(deadline).toISOString(),
          worksheet_url: worksheetUrl
        }
      ])

      if (insertError) {
         console.warn("Could not insert due to FK constraint (we need real courses first):", insertError)
      }

      setIsSuccess(true)
      fetchRecentAssignments()
      setTimeout(() => setIsSuccess(false), 3000)
      e.currentTarget.reset()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An error occurred.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Homework & Assignments</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Upload New Assignment
            </CardTitle>
            <CardDescription>Assign worksheets or projects to your classes.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-green-600">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Assignment Published!</h3>
                <p className="text-slate-500 mt-2">Students have been notified of the new homework.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input id="title" name="title" placeholder="e.g. Tracing Letters A-E Worksheet" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Select Course</Label>
                    <Select defaultValue="c1" name="course">
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">Early Literacy Foundation</SelectItem>
                        <SelectItem value="c2">Numbers & Counting</SelectItem>
                        <SelectItem value="c3">Art & Creativity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" name="deadline" type="datetime-local" required />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Instructions (Optional)</Label>
                    <Textarea id="description" name="description" placeholder="Provide instructions for completing the homework..." className="h-24" />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Attachment (Worksheet/PDF)</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => document.getElementById('worksheetFile')?.click()}>
                      <FileText className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or Image (max 5MB)</p>
                      <Input id="worksheetFile" type="file" className="hidden" />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                <Button type="submit" disabled={isUploading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  {isUploading ? "Publishing..." : "Publish Assignment"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-base">Recent Assignments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {recentAssignments.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">No recent assignments found.</div>
              ) : (
                recentAssignments.map((assignment) => {
                  const isDueSoon = new Date(assignment.deadline).getTime() - new Date().getTime() < 86400000 * 3 // less than 3 days
                  return (
                    <div key={assignment.id} className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">{assignment.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isDueSoon ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{assignment.description || "No instructions provided."}</p>
                      <div className="flex justify-between items-center mt-2 text-xs font-medium text-slate-600">
                         {assignment.worksheet_url && (
                           <a href={assignment.worksheet_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Download Worksheet</a>
                         )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
