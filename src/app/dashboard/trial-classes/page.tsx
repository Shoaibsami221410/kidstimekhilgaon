"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, CalendarIcon, Download, Trash2 } from "lucide-react"

export default function TrialClassesAdminPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [courses, setCourses] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    
    // Fetch courses to map course_id to title
    const { data: coursesData } = await supabase.from('courses').select('id, title')
    const courseMap: Record<string, string> = {}
    if (coursesData) {
      coursesData.forEach(c => {
        courseMap[c.id] = c.title
      })
    }
    setCourses(courseMap)

    // Fetch trial class requests
    const { data: requestsData, error } = await supabase
      .from('trial_class_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching trial requests:", error)
      // If table doesn't exist yet, just keep empty
    } else {
      setRequests(requestsData || [])
    }
    
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this trial class request?")) return
    
    const { error } = await supabase.from('trial_class_requests').delete().eq('id', id)
    if (error) {
      alert("Error deleting request: " + error.message)
    } else {
      fetchData()
    }
  }

  function handleExportCSV() {
    if (requests.length === 0) {
      alert("No data to export")
      return
    }

    const headers = ["ID", "Course", "Parent Name", "Phone", "Email", "Child Name", "Child Age", "Requested At"]
    const csvContent = [
      headers.join(","),
      ...requests.map(row => [
        row.id, 
        `"${courses[row.course_id] || 'Unknown Course'}"`,
        `"${row.parent_name || ''}"`, 
        `"=""${row.parent_phone || ''}"""`, 
        `"${row.parent_email || ''}"`, 
        `"${row.child_name || ''}"`, 
        row.child_age || '', 
        `"${new Date(row.created_at).toLocaleString()}"`
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Trial_Class_Requests_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trial Classes</h1>
          <p className="text-slate-500 mt-2">Manage parent requests for trial classes and demo sessions.</p>
        </div>
        
        <Button 
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={requests.length === 0}
        >
          <Download className="w-4 h-4 mr-2" /> Export to Excel (CSV)
        </Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg">Recent Requests</CardTitle>
          <CardDescription>A list of all parents who have signed up for a trial class.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Requested Course</TableHead>
                <TableHead>Parent Info</TableHead>
                <TableHead>Child Info</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-slate-900">No requests found</p>
                    <p>There are currently no trial class requests.</p>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="font-medium text-blue-600">{courses[req.course_id] || "General"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900">{req.parent_name}</div>
                      <div className="text-sm text-slate-600">{req.parent_phone}</div>
                      {req.parent_email && <div className="text-xs text-slate-500">{req.parent_email}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-700">{req.child_name || "-"}</div>
                      {req.child_age && <div className="text-xs text-slate-500">Age: {req.child_age}</div>}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(req.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleDelete(req.id)}
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
