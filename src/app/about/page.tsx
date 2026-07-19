import { CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

export default async function AboutPage() {
  const supabase = await createClient()
  
  const { data: content, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page", "about")

  const hero = content?.find((c) => c.id === 'about_hero')?.content || {
    title: "Nurturing Creativity in Every Child",
    description: "At Kids Time Khilgaon, we believe every child is an artist, a storyteller, and an innovator waiting to be discovered."
  }
  
  const missionVision = content?.find((c) => c.id === 'about_mission_vision')?.content || {
    mission_title: "Our Mission",
    mission_desc: "To provide a safe, engaging, and highly creative environment where children can explore their imaginations. We focus on developing core skills through art, craft, and storytelling, building confidence that lasts a lifetime.",
    vision_title: "Our Vision",
    vision_desc: "To be the leading creative development center in Bangladesh, where every child's unique talent is recognized, nurtured, and celebrated."
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
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
            alt="Kids learning"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{missionVision.mission_title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                {missionVision.mission_desc}
              </p>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{missionVision.vision_title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {missionVision.vision_desc}
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
                alt="Children painting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{features.title}</h2>
            <p className="text-slate-600 text-lg font-medium">{features.description}</p>
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
