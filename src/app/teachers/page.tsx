import { createClient } from "@/lib/supabase/server"
import { GraduationCap, Award, BookOpen } from "lucide-react"

export const revalidate = 60

export default async function TeachersPage() {
  const supabase = await createClient()

  // Fetch page content for the hero section
  const { data: contentData } = await supabase.from('page_content').select('*').eq('page', 'teachers')
  
  const hero = contentData?.find((c) => c.id === 'teachers_hero')?.content || {
    title: "Our Expert Teachers",
    description: "Meet the passionate educators dedicated to nurturing your child's creativity."
  }

  // Fetch all teachers with their assigned courses and user details
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select(`
      *,
      users (
        full_name,
        avatar_url
      ),
      courses (
        title
      )
    `)

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      <section className="bg-orange-50 py-20 border-b border-orange-100 relative">
        {hero.image_url && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={hero.image_url} alt="Teachers" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: hero.title_color, fontFamily: hero.title_font }}>{hero.title}</h1>
          <p className="text-lg mb-8 whitespace-pre-line" style={{ color: hero.description_color, fontFamily: hero.description_font }}>
            {hero.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!teachers || teachers.length === 0 ? (
             <div className="text-center text-slate-500 py-12">
               <GraduationCap className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <p className="text-xl">Teacher profiles are being updated. Check back soon!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher: any, index: number) => {
                const user = teacher.users
                if (!user) return null

                return (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto overflow-hidden border-4 border-orange-50 shadow-sm">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} alt={user.full_name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">{user.full_name}</h3>
                    
                    {teacher.courses ? (
                      <p className="text-orange-500 font-bold text-center mb-6 text-lg">{teacher.courses.title} Teacher</p>
                    ) : (
                      <p className="text-orange-400 font-medium text-center mb-6 text-lg">Creative Educator</p>
                    )}
                    
                    <div className="space-y-4">
                      {teacher.qualifications && (
                        <div className="flex items-start gap-3">
                          <GraduationCap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Qualifications</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{teacher.qualifications}</p>
                          </div>
                        </div>
                      )}
                      
                      {teacher.experience && (
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{teacher.experience}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
