import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, User as UserIcon, Calendar, GraduationCap, Briefcase } from "lucide-react"

export const revalidate = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch course details
  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      teacher_profiles (
        id,
        name,
        image_url,
        qualifications,
        experience,
        role
      )
    `)
    .eq("id", id)
    .single()

  if (error || !course) {
    console.error("Course fetch error:", error)
    notFound()
  }

  // Parse syllabus if available
  let syllabus: any[] = []
  if (course.syllabus) {
    try {
      syllabus = typeof course.syllabus === 'string' ? JSON.parse(course.syllabus) : course.syllabus
    } catch (e) {
      console.error("Failed to parse syllabus", e)
    }
  }

  // Since teacher_profiles have course_id, course.teacher_profiles will be an array
  const assignedTeachers = Array.isArray(course.teacher_profiles) ? course.teacher_profiles : (course.teacher_profiles ? [course.teacher_profiles] : [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b relative">
        {course.thumbnail_url && (
          <div className="absolute inset-0 z-0 opacity-5">
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 pt-24 pb-16">
          <Link href="/programs" className="inline-flex items-center text-[#00b4ff] hover:text-blue-600 font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-3">
                <div className="inline-block bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-full text-sm">
                  Ages {course.min_age}-{course.max_age} Years
                </div>
                {course.duration && (
                  <div className="inline-block bg-[#00b4ff]/10 text-[#00b4ff] font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {course.duration}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {course.description}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/contact" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 text-lg">
                  Book a Trial Class
                </Link>
              </div>
            </div>
            
            {course.thumbnail_url && (
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content: Syllabus */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#00b4ff]" />
                Course Syllabus
              </h2>
              
              {syllabus && syllabus.length > 0 ? (
                <div className="space-y-6">
                  {syllabus.map((item: any, idx: number) => (
                    <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-slate-200 last:before:hidden">
                      <div className="absolute left-0 top-1.5 w-6 h-6 bg-red-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.week && <span className="text-[#00b4ff] mr-2">{item.week}:</span>}
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-slate-600 mt-2">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  Syllabus is being updated and will be available soon.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar: Teacher Info */}
          <div className="space-y-8">
            <section className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-3xl shadow-sm border border-blue-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-[#00b4ff]" />
                Course Instructors
              </h2>
              
              {assignedTeachers.length > 0 ? (
                <div className="space-y-8">
                  {assignedTeachers.map((teacher: any, idx: number) => {
                    return (
                      <div key={idx} className="text-center pb-8 border-b border-blue-100/50 last:border-0 last:pb-0">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-white">
                          <img 
                            src={teacher.image_url || `https://ui-avatars.com/api/?name=${teacher.name}&background=random`} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
                        <p className="text-[#00b4ff] font-medium mb-4">{teacher.role || "Instructor"}</p>
                        
                        <div className="text-left space-y-3 mt-6">
                          {teacher.qualifications && (
                            <div className="flex gap-3 text-sm text-slate-600">
                              <GraduationCap className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                              <span>{teacher.qualifications}</span>
                            </div>
                          )}
                          {teacher.experience && (
                            <div className="flex gap-3 text-sm text-slate-600">
                              <Briefcase className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                              <span>{teacher.experience}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500">Instructors will be assigned soon.</p>
                </div>
              )}
            </section>

            <section className="bg-slate-900 p-8 rounded-3xl shadow-lg text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00b4ff] opacity-20 rounded-full blur-3xl -ml-16 -mb-16"></div>
              
              <h2 className="text-2xl font-bold mb-4 relative z-10">Ready to start learning?</h2>
              <p className="text-slate-300 mb-6 relative z-10">Join thousands of students and start your journey today.</p>
              <Link href="/contact" className="inline-block bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 relative z-10 w-full shadow-lg">
                Contact Us
              </Link>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
