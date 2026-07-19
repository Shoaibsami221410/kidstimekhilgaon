"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Play } from "lucide-react"

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

  // Safely extract content with fallbacks
  const hero = content.find((c: any) => c.id === 'home_hero')?.content || {}
  const about = content.find((c: any) => c.id === 'home_about')?.content || {}
  const servicesMontessori = content.find((c: any) => c.id === 'home_services_montessori')?.content || {}
  const servicesAfterSchool = content.find((c: any) => c.id === 'home_services_afterschool')?.content || {}
  const community = content.find((c: any) => c.id === 'home_community')?.content || {}

  // Hero Background (fallback if no image provided)
  const heroBg = hero.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop'

  return (
    <div className="flex flex-col w-full selection:bg-rose-200 selection:text-rose-900 bg-white">
      {/* 1. Hero Section */}
      <section 
        className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-8 max-w-4xl leading-tight"
          >
            {hero.title_black} <br /> {hero.title_gradient}
          </motion.h1>
          
          {hero.button_text && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Link href={hero.button_link || "#"}>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full text-white border-white bg-transparent hover:bg-white hover:text-black transition-all">
                  {hero.button_text}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. About Kids Time */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Text Side */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col items-start"
            >
              <span className="text-sky-500 font-bold mb-2 uppercase tracking-wide text-sm">{about.subtitle}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6">{about.title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {about.description}
              </p>
            </motion.div>

            {/* Video/Image Side */}
            {about.thumbnail_url && (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video group cursor-pointer"
              >
                <img src={about.thumbnail_url} alt="About Kids Time" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {about.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Services: Montessori Pre-School */}
      <section className="w-full py-24 bg-zinc-50 border-t border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Text Side */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="text-sky-500 font-bold mb-2 uppercase tracking-wide text-sm">{servicesMontessori.subtitle}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6 leading-tight">{servicesMontessori.title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium mb-10">
                {servicesMontessori.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                {servicesMontessori.btn1_text && (
                  <Link href={servicesMontessori.btn1_link || "#"}>
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-red-600 hover:bg-red-700 rounded-full text-white shadow-xl shadow-red-600/20">
                      {servicesMontessori.btn1_text}
                    </Button>
                  </Link>
                )}
                {servicesMontessori.btn2_text && (
                  <Link href={servicesMontessori.btn2_link || "#"}>
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-sky-500 hover:bg-sky-600 rounded-full text-white shadow-xl shadow-sky-500/20">
                      {servicesMontessori.btn2_text}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Image Side */}
            {servicesMontessori.image_url && (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]"
              >
                <img src={servicesMontessori.image_url} alt="Montessori" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  LIVE
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Services: After-School Program */}
      <section className="w-full py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sky-500 font-bold mb-2 block uppercase tracking-wide text-sm">{servicesAfterSchool.subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6">{servicesAfterSchool.title}</h2>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              {servicesAfterSchool.description}
            </p>
          </div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-8 mb-12"
          >
            {servicesAfterSchool.items?.map((course: any, i: number) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center bg-white border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                {/* Blob Image Mask */}
                <div 
                  className="w-full aspect-[4/3] mb-6 overflow-hidden relative"
                  style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                >
                  <div className="absolute inset-0 bg-orange-500 opacity-90 mix-blend-multiply" />
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {course.title.replace('Course', '')} <span className="text-red-500">Course</span>
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">{course.desc}</p>
                <div className="w-12 h-1 bg-sky-500 rounded-full mx-auto" />
              </motion.div>
            ))}
          </motion.div>

          {servicesAfterSchool.explore_btn_text && (
            <div className="flex justify-center">
               <Link href={servicesAfterSchool.explore_btn_link || "#"}>
                <Button className="bg-slate-700 hover:bg-slate-800 text-white rounded px-8 h-12 shadow-md">
                  {servicesAfterSchool.explore_btn_text}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Kids Time? / Parent Community */}
      <section className="w-full py-24 relative overflow-hidden">
        {/* Soft split background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-purple-50 z-0" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">Why Kids Time?</h2>
            <p className="text-sky-500 font-bold text-sm tracking-wide">See what other parents are saying about us...</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Testimonial Side */}
            {community.testimonial && (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="text-center"
              >
                <p className="text-xl text-slate-800 font-medium leading-relaxed italic mb-8">
                  "{community.testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img src={community.testimonial.avatar_url} alt={community.testimonial.author} className="w-12 h-12 rounded-full shadow-md" />
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm">{community.testimonial.author}</h4>
                    <p className="text-slate-500 text-xs">{community.testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Community Side */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col items-center text-center lg:pl-16 lg:border-l lg:border-slate-200"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border">
                <Users className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{community.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-8 max-w-md">
                {community.description}
              </p>
              {community.btn_text && (
                <Link href={community.btn_link || "#"}>
                  <Button size="lg" className="h-12 px-10 text-lg bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg shadow-red-600/20">
                    {community.btn_text}
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
