"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, CheckCircle2, AlertCircle, Clock } from "lucide-react"

const supabase = createClient()

export default function ParentAdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdmissions() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch admissions associated with this parent's email or phone
        // In a real app, you'd match the parent_id if linked properly.
        const { data: userData } = await supabase.from('users').select('email, phone').eq('id', user.id).single()
        
        if (userData) {
          const { data } = await supabase
            .from('admissions')
            .select('*')
            .or(`email.eq.${userData.email},phone.eq.${userData.phone}`)
            .order('created_at', { ascending: false })
          
          if (data) {
            setAdmissions(data)
          }
        }
      }
      setLoading(false)
    }
    fetchAdmissions()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admission Status</h1>
        <p className="text-slate-500">Track the enrollment status of your children.</p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Your Applications</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ClipboardCheck className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="mb-4">You haven't submitted any admission applications yet.</p>
              <a href="/admissions" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Apply Now
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {admissions.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border rounded-xl hover:bg-slate-50 transition-colors gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{app.student_first_name} {app.student_last_name}</h4>
                    <p className="text-sm text-slate-500 mt-1">Submitted: {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white">
                    {app.status === 'Approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : app.status === 'Rejected' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <span className={`font-bold text-sm ${
                      app.status === 'Approved' ? 'text-emerald-700' : 
                      app.status === 'Rejected' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {app.status || 'Pending Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
