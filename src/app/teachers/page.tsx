"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap, Award, BookOpen } from "lucide-react"

const supabase = createClient()

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeachers() {
      // Fetch teachers and join with users to get full_name
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          id,
          qualifications,
          experience,
          certifications,
          users (
            full_name,
            email
          )
        `)
      
      if (data) {
        setTeachers(data)
      } else if (error) {
        console.error(error)
      }
      setLoading(false)
    }
    
    fetchTeachers()
  }, [])

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      <section className="bg-orange-50 py-20 border-b border-orange-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Expert Teachers</h1>
          <p className="text-lg text-slate-600 mb-8">
            Meet the passionate educators dedicated to nurturing your child's creativity.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : teachers.length === 0 ? (
             <div className="text-center text-slate-500 py-12">
               <GraduationCap className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <p className="text-xl">Teacher profiles are being updated. Check back soon!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl font-bold text-orange-600">
                      {teacher.users?.full_name?.charAt(0) || "T"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">{teacher.users?.full_name || "Teacher"}</h3>
                  <p className="text-orange-500 font-medium text-center mb-6">Creative Educator</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Qualifications</p>
                        <p className="text-sm text-slate-700">{teacher.qualifications || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                        <p className="text-sm text-slate-700">{teacher.experience || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Certifications</p>
                        <p className="text-sm text-slate-700">{teacher.certifications || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
