"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Clock, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function ContactPage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'contact')
      
      if (data) setContent(data)
      setLoading(false)
    }
    fetchContent()
  }, [])

  const hero = content?.find((c) => c.id === 'contact_hero')?.content || {
    title: "Get in Touch",
    description: "Have questions about our programs, admissions, or anything else? We'd love to hear from you."
  }

  const info = content?.find((c) => c.id === 'contact_info')?.content || {
    title: "Contact Information",
    description: "Our friendly team is always here to help. Reach out to us through any of the following methods or drop by our center.",
    address: "Block C, Road 12, House 45\nKhilgaon, Dhaka 1219\nBangladesh",
    phone: "Franchisee Owner - Jiaul Haque\n+880 1685-729549\n\nCoordinator - Junaida Islam\n+880 1625-626227",
    hours: "Friday - Saturday: 9:00 AM - 6:00 PM"
  }

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      {loading ? (
        <div className="flex-1 flex justify-center items-center h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 relative">
        {hero.image_url && (
          <div className="absolute inset-0 z-0 opacity-30">
            <img src={hero.image_url} alt="Contact" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ color: hero.title_color, fontFamily: hero.title_font }}>
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: hero.description_color, fontFamily: hero.description_font }}>
            {hero.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 text-center">
                <h2 className="text-3xl font-bold mb-6" style={{ color: info.title_color, fontFamily: info.title_font }}>{info.title}</h2>
                <p className="text-lg mb-10 font-medium leading-relaxed" style={{ color: info.description_color, fontFamily: info.description_font }}>
                  {info.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Visit Us</h3>
                    <p className="text-slate-600 whitespace-pre-line">{info.address}</p>
                  </div>
                </div>

                {info.phone_contacts && Array.isArray(info.phone_contacts) ? (
                  info.phone_contacts.map((contact: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{contact.name}</h3>
                        <p className="text-sm font-medium text-blue-600 mb-1">{contact.role}</p>
                        <p className="text-slate-600 font-medium">{contact.phone}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">Call Us</h3>
                      <p className="text-slate-600 whitespace-pre-line">
                        {info.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 md:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Opening Hours</h3>
                    <p className="text-slate-600 whitespace-pre-line">{info.hours}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </>
      )}
    </div>
  )
}
