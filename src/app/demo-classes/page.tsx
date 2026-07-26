import { DemoClassFlow } from "@/components/demo-class-flow"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Demo Classes | Kids Time Khilgaon",
  description: "Watch demo classes and activities before enrolling.",
}

export default async function DemoClassesPage() {
  const supabase = await createClient()
  
  const { data: pageData } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'demo')
    
  const hero = pageData?.find((c) => c.id === 'demo_hero')?.content || {
    title: "Experience Our Classes",
    description: "Register below to get instant access to our premium demo library, featuring recorded classes, storytelling, and fun activities."
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 relative">
      {hero.image_url && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={hero.image_url} alt="Demo Classes" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{hero.title}</h1>
          <p className="text-lg text-slate-600 whitespace-pre-line">{hero.description}</p>
        </div>
        <DemoClassFlow />
      </div>
    </div>
  )
}
