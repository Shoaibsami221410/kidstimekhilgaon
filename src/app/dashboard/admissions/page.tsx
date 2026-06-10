"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function AdminAdmissionsPage() {
  const supabase = createClient()
  const [admissions, setAdmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdmissions()
  }, [])

  async function fetchAdmissions() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("admissions")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) {
      console.error("Error fetching admissions:", error)
    } else {
      setAdmissions(data || [])
    }
    setIsLoading(false)
  }

  async function handleStatusUpdate(id: string, newStatus: string) {
    const { error } = await supabase
      .from("admissions")
      .update({ status: newStatus })
      .eq("id", id)
      
    if (!error) {
      // Refresh the list
      fetchAdmissions()
    } else {
      console.error("Error updating status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0"><CheckCircle2 className="w-3 h-3 mr-1"/> Approved</Badge>
      case 'Rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>
      default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admissions Processing</h1>
        <Button onClick={fetchAdmissions} variant="outline" className="h-9">Refresh</Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg">Recent Applications</CardTitle>
          <CardDescription>Review and approve new student applications.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Date Applied</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading applications...</TableCell>
                </TableRow>
              ) : admissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">No applications found.</TableCell>
                </TableRow>
              ) : (
                admissions.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="text-slate-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {app.student_first_name} {app.student_last_name}
                      <div className="text-xs text-slate-500 font-normal">DOB: {app.dob}</div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {app.father_name} / {app.mother_name}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {app.phone}<br/>
                      <span className="text-xs text-slate-400">{app.email}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {app.birth_certificate_url && (
                          <a href={app.birth_certificate_url} target="_blank" rel="noreferrer" title="Birth Certificate" className="text-blue-500 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {app.student_photo_url && (
                          <a href={app.student_photo_url} target="_blank" rel="noreferrer" title="Photo" className="text-blue-500 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {app.guardian_nid_url && (
                          <a href={app.guardian_nid_url} target="_blank" rel="noreferrer" title="NID" className="text-blue-500 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {!app.birth_certificate_url && !app.student_photo_url && !app.guardian_nid_url && (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        onClick={() => handleStatusUpdate(app.id, 'Approved')}
                        variant="outline" size="sm" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        disabled={app.status === 'Approved'}
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                        variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={app.status === 'Rejected'}
                      >
                        Reject
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
