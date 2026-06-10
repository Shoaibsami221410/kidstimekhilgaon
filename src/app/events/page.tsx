"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"

const supabase = createClient()

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
      
      if (data) {
        setEvents(data)
      } else if (error) {
        console.error(error)
      }
      setLoading(false)
    }
    
    fetchEvents()
  }, [])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      day: date.getDate(),
      time: date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
  }

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-lg text-slate-300 mb-8">
            Join us for exciting activities, workshops, and celebrations at Kids Time Khilgaon.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
             <div className="text-center text-slate-500 py-12">
               <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <p className="text-xl">No upcoming events at the moment. Stay tuned!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const { month, day, time } = formatDate(event.event_date)
                return (
                  <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col">
                    <div className="relative h-48 bg-slate-200">
                      {event.cover_image_url ? (
                        <img 
                          src={event.cover_image_url} 
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-orange-100 text-orange-400">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 text-center shadow-lg">
                        <p className="text-orange-500 font-bold text-xs uppercase leading-none mb-1">{month}</p>
                        <p className="text-slate-900 font-black text-xl leading-none">{day}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{event.title}</h3>
                      <p className="text-slate-600 line-clamp-2 mb-6 flex-1">
                        {event.description || "No description provided."}
                      </p>
                      
                      <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>{event.location || "Kids Time Khilgaon Center"}</span>
                        </div>
                      </div>
                      
                      <button className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-colors">
                        RSVP Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
