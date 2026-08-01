"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, Clock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const supabase = createClient()

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const [eventsRes, contentRes, countsRes] = await Promise.all([
        supabase.from('events').select('*').order('event_date', { ascending: true }),
        supabase.from('page_content').select('*').eq('page', 'events'),
        supabase.rpc('get_event_rsvp_counts')
      ])
      
      if (eventsRes.data) setEvents(eventsRes.data)
      if (contentRes.data) setContent(contentRes.data)
      
      if (countsRes.data) {
        const countsMap: Record<string, number> = {}
        countsRes.data.forEach((row: any) => {
          countsMap[row.event_id] = parseInt(row.rsvp_count)
        })
        setRsvpCounts(countsMap)
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
                const count = rsvpCounts[event.id] || 0
                return <EventCard key={event.id} event={event} month={month} day={day} time={time} currentRsvps={count} />
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function EventCard({ event, month, day, time, currentRsvps }: { event: any, month: string, day: string, time: string, currentRsvps: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Form fields
  const [parentName, setParentName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [studentName, setStudentName] = useState("")
  const [studentAge, setStudentAge] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { error } = await supabase.from('event_rsvps').insert({
      event_id: event.id,
      parent_name: parentName,
      phone,
      email,
      student_name: studentName,
      student_age: studentAge ? parseInt(studentAge) : null
    })
    
    setIsSubmitting(false)
    
    if (error) {
      alert("Error submitting registration: " + error.message)
    } else {
      setIsSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSuccess(false)
        setParentName("")
        setPhone("")
        setEmail("")
        setStudentName("")
        setStudentAge("")
      }, 2500)
    }
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col">
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
        
        {(() => {
          if (event.is_registration_enabled === false) {
            return null; // Don't show button at all
          }
          
          if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
            return (
              <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl cursor-not-allowed">
                Registration Closed
              </button>
            )
          }

          if (event.max_seats && currentRsvps >= event.max_seats) {
            return (
              <button disabled className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 font-semibold py-3 rounded-xl cursor-not-allowed">
                Event Full (No Seats)
              </button>
            )
          }

          return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger 
                render={
                  <button className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-colors">
                    RSVP Now <ArrowRight className="w-4 h-4" />
                  </button>
                } 
              />
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-900 text-center">RSVP for Event</DialogTitle>
                  <p className="text-center text-slate-500 mt-2">{event.title}</p>
                </DialogHeader>
            
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in" />
                <h3 className="text-2xl font-bold text-slate-900">Registration Complete!</h3>
                <p className="text-slate-600">We look forward to seeing you there.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_name">Parent's Name <span className="text-red-500">*</span></Label>
                  <Input id="parent_name" required value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Enter full name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input id="phone" required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXX-XXXXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">Child's Name (Optional)</Label>
                    <Input id="student_name" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_age">Child's Age (Optional)</Label>
                    <Input id="student_age" type="number" min="3" max="15" value={studentAge} onChange={e => setStudentAge(e.target.value)} placeholder="e.g. 6" />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 mt-4 rounded-xl text-lg">
                  {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  Confirm Registration
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
          )
        })()}
      </div>
    </div>
  )
}
