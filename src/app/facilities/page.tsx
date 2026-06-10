import { ShieldCheck, MonitorPlay, Brush, Coffee } from "lucide-react"

export default function FacilitiesPage() {
  const facilities = [
    {
      title: "Interactive Classrooms",
      icon: MonitorPlay,
      description: "Equipped with smart boards and child-friendly digital tools to make learning interactive and highly engaging.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Art Studio",
      icon: Brush,
      description: "A dedicated space filled with canvases, non-toxic paints, and endless craft supplies where kids can get messy and creative.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop"
    },
    {
      title: "Parent Lounge",
      icon: Coffee,
      description: "A comfortable waiting area for parents with complimentary Wi-Fi, coffee, and a clear view of the classrooms.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    },
    {
      title: "Safety First",
      icon: ShieldCheck,
      description: "24/7 CCTV surveillance, child-safe furniture, secure entry systems, and strict pickup policies to ensure absolute safety.",
      image: "https://images.unsplash.com/photo-1584697964190-7d838fd1104e?q=80&w=2070&auto=format&fit=crop"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
            alt="Facilities"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Our Campus & Facilities
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the safe, inspiring, and fully-equipped spaces where your child's creativity comes to life.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {facilities.map((facility, index) => (
              <div key={index} className="flex flex-col group">
                <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-lg mb-8">
                  <img 
                    src={facility.image} 
                    alt={facility.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl">
                      <facility.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{facility.title}</h2>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed px-2">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Banner */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Want to see it in person?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            We welcome parents to take a guided tour of our Khilgaon center. Meet our teachers, see the classrooms, and experience the creative atmosphere.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Schedule a Campus Tour
          </a>
        </div>
      </section>
    </div>
  )
}
