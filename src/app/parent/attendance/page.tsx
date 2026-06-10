"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle2, XCircle, AlertCircle, CalendarCheck } from "lucide-react"

const supabase = createClient()

export default function ParentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAttendance() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch students for this parent
      const { data: students } = await supabase.from('students').select('id, first_name, last_name').eq('parent_id', user.id)
      
      if (students && students.length > 0) {
        const studentIds = students.map(s => s.id)
        
        // Fetch attendance for these students
        const { data: attendance } = await supabase
          .from('attendance')
          .select(`
            *,
            students (first_name, last_name)
          `)
          .in('student_id', studentIds)
          .order('class_date', { ascending: false })
        
        if (attendance) {
          setAttendanceRecords(attendance)
          
          // Calculate this month's stats
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          
          let present = 0
          let absent = 0
          let total = 0
          
          attendance.forEach(record => {
            const recordDate = new Date(record.class_date)
            if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
              total++
              if (record.status === 'Present') present++
              else if (record.status === 'Absent') absent++
            }
          })
          
          setStats({ total, present, absent })
        }
      }
      setLoading(false)
    }
    fetchAttendance()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance History</h1>
        <p className="text-slate-500">Track your child's weekly class attendance and participation.</p>
      </div>

      {/* Stats Summary for Current Month */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Classes This Month</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Attended</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Missed</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Detailed Class Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CalendarCheck className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p>No attendance records found yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-slate-50/50">
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {new Date(record.class_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {record.students?.first_name} {record.students?.last_name}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {record.status === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                          {record.status === 'Absent' && <XCircle className="w-3 h-3" />}
                          {record.status === 'Late' && <AlertCircle className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {record.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
