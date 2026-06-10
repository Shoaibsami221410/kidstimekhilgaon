"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Save } from "lucide-react"

export default function AttendancePage() {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  // Metrics
  const [presentCount, setPresentCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)
  const [lateCount, setLateCount] = useState(0)

  useEffect(() => {
    fetchStudentsAndAttendance()
  }, [attendanceDate])

  async function fetchStudentsAndAttendance() {
    setIsLoading(true)
    
    // Fetch students
    const { data: studentData } = await supabase.from('students').select('*')
    let activeStudents = studentData || []
    
    // Fallback for prototyping if no students
    if (activeStudents.length === 0) {
      const { data: adms } = await supabase.from('admissions').select('id, student_first_name, student_last_name')
      activeStudents = adms?.map(a => ({ id: a.id, first_name: a.student_first_name, last_name: a.student_last_name })) || []
    }
    
    setStudents(activeStudents)

    // Fetch existing attendance for the selected date
    const { data: attData } = await supabase
      .from('attendance')
      .select('*')
      .eq('class_date', attendanceDate)

    const initialRecords: { [key: string]: string } = {}
    let p = 0, a = 0, l = 0

    if (attData && attData.length > 0) {
      attData.forEach(record => {
        initialRecords[record.student_id] = record.status
        if (record.status === 'Present') p++
        if (record.status === 'Absent') a++
        if (record.status === 'Late') l++
      })
    } else {
      // Default everyone to present if no records exist yet
      activeStudents.forEach(s => {
        initialRecords[s.id] = 'Present'
        p++
      })
    }

    setAttendanceRecords(initialRecords)
    setPresentCount(p)
    setAbsentCount(a)
    setLateCount(l)
    setIsLoading(false)
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }))
    
    // Recalculate metrics locally
    let p = 0, a = 0, l = 0
    Object.values({ ...attendanceRecords, [studentId]: status }).forEach(val => {
      if (val === 'Present') p++
      if (val === 'Absent') a++
      if (val === 'Late') l++
    })
    setPresentCount(p)
    setAbsentCount(a)
    setLateCount(l)
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)
    
    const recordsToInsert = students.map(student => ({
      student_id: student.id,
      class_date: attendanceDate,
      status: attendanceRecords[student.id] || 'Present',
    }))

    // In Supabase, if we have a UNIQUE(student_id, class_date) constraint, we can UPSERT.
    // Since we don't have UPSERT set up easily here without specifying conflict columns perfectly,
    // we will delete existing for this date, then insert.
    await supabase.from('attendance').delete().eq('class_date', attendanceDate)
    
    const { error } = await supabase.from('attendance').insert(recordsToInsert)

    setIsSaving(false)
    if (!error) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Present': return "bg-green-100 text-green-700 hover:bg-green-100"
      case 'Absent': return "bg-red-100 text-red-700 hover:bg-red-100"
      case 'Late': return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Register</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="text-sm border-none focus:ring-0 p-0 text-slate-700 font-medium" 
            />
          </div>
          <Button onClick={handleSaveAttendance} disabled={isSaving || students.length === 0} className="bg-orange-500 hover:bg-orange-600 gap-2">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Register</>}
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Attendance successfully saved for {attendanceDate}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Present</p>
              <h3 className="text-xl font-bold text-slate-900">{presentCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Absent</p>
              <h3 className="text-xl font-bold text-slate-900">{absentCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Late</p>
              <h3 className="text-xl font-bold text-slate-900">{lateCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg">Class Roster</CardTitle>
          <CardDescription>Mark attendance for the selected date.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[100px]">Roll No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Mark Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">Loading roster...</TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">No students found.</TableCell>
                </TableRow>
              ) : (
                students.map((student, idx) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-slate-600">10{idx+1}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{student.first_name} {student.last_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusBadge(attendanceRecords[student.id])}>
                        {attendanceRecords[student.id] || "Present"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        variant="outline" 
                        size="sm" 
                        className={`h-8 w-20 ${attendanceRecords[student.id] === 'Present' ? 'bg-green-50 text-green-700 border-green-200' : 'text-slate-500'}`}
                      >
                        Present
                      </Button>
                      <Button 
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        variant="outline" 
                        size="sm" 
                        className={`h-8 w-20 ${attendanceRecords[student.id] === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' : 'text-slate-500'}`}
                      >
                        Absent
                      </Button>
                      <Button 
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        variant="outline" 
                        size="sm" 
                        className={`h-8 w-20 ${attendanceRecords[student.id] === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-500'}`}
                      >
                        Late
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
