import { createClient } from "@supabase/supabase-js"
import CourseList from "./course-list"

// Initialize Supabase admin client for Server Component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 60 // Revalidate every minute

export default async function ProgramsPage() {
  // Fetch all courses from Supabase
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-12 border-b relative overflow-hidden">
        {/* Decorative subtle patterns could go here */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#00b4ff]">Live</span> <span className="text-red-500">Online Course For Kids</span>
          </h1>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-24 h-0.5 bg-slate-200 ml-2 rounded-full"></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl text-[#00b4ff] font-bold mb-8 max-w-4xl leading-tight">
            Creativity has no bound! Unleash your child's creativity with the ultimate online course for kids from anywhere.
          </h2>
          
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-5xl">
            We are offering the Best <span className="text-red-500 font-bold">Online Drawing Courses</span>, <span className="text-red-500 font-bold">Crafting Classes</span>, <span className="text-red-500 font-bold">Spoken English For Kids</span> & <span className="text-red-500 font-bold">Singapore Math Online</span>. Your child now can join these courses through online from anywhere in the country or abroad while sitting at home.
          </p>
        </div>
      </section>

      {/* Courses List Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {courses && courses.length > 0 ? (
            <CourseList courses={courses} />
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl text-slate-500">No courses available at the moment.</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
