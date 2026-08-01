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

  // Fetch page content
  const { data: pageData } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'programs')
  
  const hero = pageData?.find((c) => c.id === 'programs_hero')?.content || {
    title_cyan: "Live",
    title_red: "Online Course For Kids",
    subtitle: "Creativity has no bound! Unleash your child's creativity with the ultimate online course for kids from anywhere.",
    description: "We are offering the Best Online Drawing Courses, Crafting Classes, Spoken English For Kids & Singapore Math Online. Your child now can join these courses through online from anywhere in the country or abroad while sitting at home."
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-12 border-b relative overflow-hidden">
        {hero.image_url && (
          <div className="absolute inset-0 z-0 opacity-10">
            <img src={hero.image_url} alt="Programs" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span style={{ color: hero.title_cyan_color, fontFamily: hero.title_cyan_font }}>{hero.title_cyan}</span> <span style={{ color: hero.title_red_color, fontFamily: hero.title_red_font }}>{hero.title_red}</span>
          </h1>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-2 h-1 bg-[#00b4ff] rounded-full"></div>
            <div className="w-24 h-0.5 bg-slate-200 ml-2 rounded-full"></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-8 max-w-4xl leading-tight whitespace-pre-line" style={{ color: hero.subtitle_color, fontFamily: hero.subtitle_font }}>
            {hero.subtitle}
          </h2>
          
          <p className="text-lg md:text-xl leading-relaxed max-w-5xl whitespace-pre-line" style={{ color: hero.description_color, fontFamily: hero.description_font }}>
            {hero.description}
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
