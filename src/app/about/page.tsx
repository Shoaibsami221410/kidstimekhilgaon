import { CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

/**
 * About Page Component
 * Displays the mission, vision, and core features of Kids Time Khilgaon
 */
export default async function AboutPage() {
  const supabase = await createClient()
  
  const { data: content, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page", "about")

  const hero = content?.find((c) => c.id === 'about_hero')?.content || {
    title: "Nurturing Creativity in Every Child",
    description: "At Kids Time Khilgaon, we believe every child is an artist, a storyteller, and an innovator waiting to be discovered.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
  }
  
  const missionVision = content?.find((c) => c.id === 'about_mission_vision')?.content || {
    mission_title: "Our Mission",
    mission_desc: "To provide a safe, engaging, and highly creative environment where children can explore their imaginations. We focus on developing core skills through art, craft, and storytelling, building confidence that lasts a lifetime.",
    vision_title: "Our Vision",
    vision_desc: "To be the leading creative development center in Bangladesh, where every child's unique talent is recognized, nurtured, and celebrated.",
    image_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
  }
  
  const features = content?.find((c) => c.id === 'about_features')?.content || {
    title: "Why Kids Time Khilgaon?",
    description: "We offer a unique blend of creative learning methodologies tailored for early childhood development.",
    items: [
      { title: "Expert Instructors", desc: "Our teachers are highly trained professionals passionate about early childhood education and creative arts." },
      { title: "Interactive Curriculum", desc: "Every lesson is designed to be highly interactive, ensuring children remain engaged and excited to learn." },
      { title: "Safe Environment", desc: "We provide a secure, welcoming, and child-friendly physical and digital environment." },
      { title: "Hybrid Learning", desc: "Flexibility of both on-center physical classes and engaging live online sessions." },
      { title: "Continuous Feedback", desc: "Parents receive regular updates, assignments, and progress reports through our dedicated dashboard." },
      { title: "Holistic Development", desc: "Focusing not just on art, but on cognitive, motor, and social skills development." }
    ]
  }

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-block px-4 py-1.5 bg-white rounded-full shadow-sm text-sm font-bold text-orange-500 uppercase tracking-wider mb-2 border border-orange-100">
                About Kids Time
              </div>
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-sm" 
                style={{ color: hero.title_color || '#1e293b', fontFamily: hero.title_font || 'inherit' }}
              >
                {hero.title}
              </h1>
              <p 
                className="text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium" 
                style={{ color: hero.description_color || '#475569', fontFamily: hero.description_font || 'inherit' }}
              >
                {hero.description}
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 rounded-[60px] transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden border-8 border-white shadow-2xl aspect-[4/3]">
                <img 
                  src={hero.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"}
                  alt="Kids learning"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-bl-full -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="bg-orange-50 p-8 rounded-3xl border-l-8 border-orange-500 relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-2xl">
                  🎯
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold mb-4" style={{ color: missionVision.mission_title_color || '#f97316', fontFamily: missionVision.mission_title_font }}>
                  {missionVision.mission_title}
                </h2>
                <p className="text-lg leading-relaxed text-slate-700" style={{ color: missionVision.mission_desc_color, fontFamily: missionVision.mission_desc_font }}>
                  {missionVision.mission_desc}
                </p>
              </div>
              
              <div className="bg-blue-50 p-8 rounded-3xl border-l-8 border-blue-500 relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-2xl">
                  🌟
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold mb-4" style={{ color: missionVision.vision_title_color || '#3b82f6', fontFamily: missionVision.vision_title_font }}>
                  {missionVision.vision_title}
                </h2>
                <p className="text-lg leading-relaxed text-slate-700" style={{ color: missionVision.vision_desc_color, fontFamily: missionVision.vision_desc_font }}>
                  {missionVision.vision_desc}
                </p>
              </div>
            </div>
            
            <div className="relative h-[500px] w-full lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src={missionVision.image_url || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"}
                alt="Children painting"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: features.title_color, fontFamily: features.title_font }}>{features.title}</h2>
            <p className="text-lg font-medium" style={{ color: features.description_color, fontFamily: features.description_font }}>{features.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.items?.map((feature: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border border-slate-100">
                <CheckCircle2 className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
