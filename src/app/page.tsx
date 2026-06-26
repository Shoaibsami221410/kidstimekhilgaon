"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, Music, Palette, Users } from "lucide-react"

export default function Home() {
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

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-300 via-orange-200 to-rose-300">
        <div className="absolute inset-0 z-0 opacity-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 -right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600 mb-6"
          >
            Admissions Open for 2026!
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl"
          >
            Nurturing Brilliant Minds for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Brighter Future</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl"
          >
            Kids Time Khilgaon offers a world-class early childhood education with a holistic approach to learning, creativity, and personal development.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link href="/programs">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg shadow-orange-500/30 text-white border-0">
                Watch Demo Classes
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Our Core Programs</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Designed by experts to develop cognitive, social, and physical skills.</p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8"
          >
            {[
              { title: "Art & Creativity", icon: <Palette className="w-8 h-8 text-rose-500" />, desc: "Expressing imagination through colors and crafts.", color: "bg-rose-50" },
              { title: "Social Play", icon: <Users className="w-8 h-8 text-emerald-500" />, desc: "Learning teamwork, sharing, and empathy.", color: "bg-emerald-50" },
            ].map((program, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="border-0 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${program.color}`}>
                      {program.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                    <p className="text-slate-600">{program.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Kids Time Family?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Give your child the best start in life. Schedule a visit or enroll directly through our digital portal.
          </p>
          <Link href="/admissions">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 text-lg rounded-full">
              Start Admission Process
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
