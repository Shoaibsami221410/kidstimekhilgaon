import { Palette, Scissors, BookOpen, Video, MapPin, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ProgramsPage() {
  const subjects = [
    {
      title: "Art & Drawing",
      icon: Palette,
      description: "Introduce your child to the colorful world of imagination. Our art program covers basic sketching, coloring, and water painting, helping kids express their inner thoughts on paper.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop"
    },
    {
      title: "Craft & DIY",
      icon: Scissors,
      description: "Hands-on activities that boost motor skills. Children learn to build, cut, fold, and stick materials together to create beautiful handmade crafts and science models.",
      image: "https://images.unsplash.com/photo-1499803270242-4f30b9101d2c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Storytelling",
      icon: BookOpen,
      description: "Building confidence through words. Our storytelling sessions encourage kids to listen, imagine, and speak, greatly improving their vocabulary and public speaking skills.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      {/* Hero */}
      <section className="bg-orange-50 py-20 border-b border-orange-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Core Programs</h1>
          <p className="text-lg text-slate-600 mb-8">
            Choose from three fundamental creative subjects, available both online and physically at our Khilgaon center.
          </p>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {subjects.map((subject, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                <div className="w-full md:w-1/2">
                  <div className="relative h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-xl">
                    <img 
                      src={subject.image} 
                      alt={subject.title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                    <subject.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{subject.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Formats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Format</h2>
            <p className="text-slate-400">We offer maximum flexibility so your child can learn in the environment that suits them best.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Live Format */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Online Classes</h3>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-orange-500" /> Interactive Zoom sessions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-orange-500" /> Learn from home</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-orange-500" /> Access to LMS recordings</li>
              </ul>
              <Link href="/admissions" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold">
                Enroll Online <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* On Center */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">On-Center Physical</h3>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Direct teacher interaction</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Physical craft materials</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Socialize with other kids</li>
              </ul>
              <Link href="/admissions" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
                Enroll On-Center <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
