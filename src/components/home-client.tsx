"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, Music, Palette, Users, Globe, Code, PenTool } from "lucide-react"

const iconMap: any = {
  Palette: Palette,
  Users: Users,
  BookOpen: BookOpen,
  Music: Music,
  Globe: Globe,
  Code: Code,
  PenTool: PenTool
}

export function HomeClient({ content }: { content: any }) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  // Safely extract content with fallbacks just in case
  const hero = content.find((c: any) => c.id === 'home_hero')?.content || {}
  const programs = content.find((c: any) => c.id === 'home_programs')?.content || { items: [] }
  const cta = content.find((c: any) => c.id === 'home_cta')?.content || {}

  return (
    <div className="flex flex-col w-full bg-transparent selection:bg-orange-200 selection:text-orange-900">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Soft, unified background elements */}
        <div className="absolute inset-0 z-0 bg-transparent" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-sky-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-rose-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between mt-10 gap-12">
          <div className={`flex flex-col items-center lg:items-start text-center lg:text-left ${hero.image_url ? 'lg:w-1/2' : 'w-full items-center text-center'}`}>
          {hero.badge && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-orange-600 mb-6 shadow-sm border border-orange-100"
            >
              {hero.badge}
            </motion.div>
          )}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className={`text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight ${hero.image_url ? 'max-w-2xl' : 'max-w-4xl'}`}
          >
            {hero.title_black} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">{hero.title_gradient}</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-medium"
          >
            {hero.description}
          </motion.p>
          {hero.button_text && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className={`flex flex-col sm:flex-row gap-4 w-full ${hero.image_url ? 'justify-center lg:justify-start' : 'justify-center'}`}
            >
              <Link href={hero.button_link || "#"}>
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-xl shadow-orange-500/20">
                  {hero.button_text}
                </Button>
              </Link>
            </motion.div>
          )}
          </div>

          {hero.image_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 w-full max-w-lg relative"
            >
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={hero.image_url} 
                  alt="Kids Time Hero" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Programs Overview */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{programs.title}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">{programs.description}</p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-8"
          >
            {programs.items?.map((program: any, i: number) => {
              const Icon = iconMap[program.icon] || BookOpen
              return (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="border border-white shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full bg-white/60 backdrop-blur-md group overflow-hidden relative rounded-3xl">
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${program.color?.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-400') || 'bg-gradient-to-r from-amber-400'} to-transparent opacity-70`} />
                    <CardContent className="p-8 text-center flex flex-col items-center relative z-10">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${program.color || 'bg-amber-50'}`}>
                        <Icon className="w-10 h-10 text-slate-700 opacity-80" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-800">{program.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{program.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center bg-white/40 backdrop-blur-sm rounded-3xl p-12 max-w-5xl border border-white shadow-xl shadow-slate-200/50">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">{cta.title}</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {cta.description}
          </p>
          {cta.button_text && (
            <Link href={cta.button_link || "#"}>
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white h-14 px-10 text-lg rounded-full shadow-xl shadow-rose-500/20">
                {cta.button_text}
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
