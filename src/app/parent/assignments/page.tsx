"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { FileText, Download, CheckCircle2, BookOpen } from "lucide-react"

const supabase = createClient()

export default function ParentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAssignments() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Find students for this parent
      const { data: students } = await supabase.from('students').select('id').eq('parent_id', user.id)
      
      let enrolledCourseIds: string[] = []
      if (students && students.length > 0) {
        const studentIds = students.map(s => s.id)
        const { data: enrollments } = await supabase.from('enrollments').select('course_id').in('student_id', studentIds)
        if (enrollments) {
          enrolledCourseIds = enrollments.map(e => e.course_id)
        }
      }

      if (enrolledCourseIds.length === 0) {
        setAssignments([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('assignments')
        .select(`
          *,
          courses (
            title
          )
        `)
        .in('course_id', enrolledCourseIds)
        .order('deadline', { ascending: true })
      
      if (data) {
        setAssignments(data)
      }
      setLoading(false)
    }
    fetchAssignments()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments & Worksheets</h1>
        <p className="text-slate-500">Download practice materials for your child's enrolled courses.</p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Your Pending Assignments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
              <p>You're all caught up! No pending assignments for your enrolled courses.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {assignment.courses?.title || 'Course'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{assignment.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{assignment.description}</p>
                      <p className="text-xs font-medium text-red-500 mt-1">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {assignment.worksheet_url && (
                    <a 
                      href={assignment.worksheet_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-lg text-sm font-medium hover:bg-slate-50 shrink-0 w-full sm:w-auto justify-center"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
