import { AdmissionForm } from "@/components/admission-form"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Admissions | Kids Time Khilgaon",
  description: "Apply for admission to Kids Time Khilgaon Preschool.",
}

export default async function AdmissionsPage() {
  const supabase = await createClient()
  
  const { data: pageData } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'admissions')
    
  const hero = pageData?.find((c) => c.id === 'admissions_hero')?.content || {
    title: "Admissions Application",
    description: "Please complete the application form below. Our admissions team will review your application and contact you shortly."
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 relative">
      {hero.image_url && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={hero.image_url} alt="Admissions" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{hero.title}</h1>
          <p className="text-lg text-slate-600 whitespace-pre-line">{hero.description}</p>
        </div>
        <AdmissionForm />
      </div>
    </div>
  )
}
