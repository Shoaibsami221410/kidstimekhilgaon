"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, Clock, ArrowRight, Loader2, CheckCircle2, ChevronRight, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { notFound } from "next/navigation"

const supabase = createClient()

export default function SingleEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const [event, setEvent] = useState<any>(null)
  const [currentRsvps, setCurrentRsvps] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Form fields
  const [parentName, setParentName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [studentName, setStudentName] = useState("")
  const [studentAge, setStudentAge] = useState("")

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
        
      if (error || !data) {
        notFound()
        return
      }
      
      setEvent(data)

      const { data: countsRes } = await supabase.rpc('get_event_rsvp_counts')
      if (countsRes) {
        const countRow = countsRes.find((row: any) => row.event_id === id)
        if (countRow) {
          setCurrentRsvps(parseInt(countRow.rsvp_count))
        }
      }
      
      setLoading(false)
    }
    
    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) return null

  const date = new Date(event.event_date)
  const formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { error } = await supabase.from('event_rsvps').insert({
      event_id: id,
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
        setCurrentRsvps(prev => prev + 1)
      }, 2500)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/events" className="hover:text-orange-500 transition-colors">Events</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium truncate">{event.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Main Content (70%) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{event.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    KT
                  </div>
                  <span>Kids Time Khilgaon</span>
                </div>
              </div>
            </div>

            {event.cover_image_url && (
              <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 aspect-video relative">
                <img 
                  src={event.cover_image_url} 
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rich Text Content */}
            <div 
              className="prose prose-lg prose-slate max-w-none break-words prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-500 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: event.description || "<p>No description provided.</p>" }}
            />
          </div>

          {/* Right Column: Sticky Sidebar (30%) */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* Event Details Widget */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Event Details</h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Date</p>
                      <p className="text-slate-600">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Time</p>
                      <p className="text-slate-600">{time}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Location</p>
                      <p className="text-slate-600">{event.location || "Kids Time Khilgaon"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Widget */}
              {event.is_registration_enabled !== false && (
                <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 relative z-10">Registration</h3>
                  
                  {event.registration_deadline && new Date() <= new Date(event.registration_deadline) && (
                    <p className="text-slate-400 text-sm mb-6 relative z-10">
                      Closes on {new Date(event.registration_deadline).toLocaleDateString()}
                    </p>
                  )}

                  {(() => {
                    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
                      return (
                        <div className="bg-slate-800 text-slate-400 font-semibold py-4 rounded-xl text-center border border-slate-700">
                          Registration Closed
                        </div>
                      )
                    }

                    if (event.max_seats && currentRsvps >= event.max_seats) {
                      return (
                        <div className="bg-red-500/10 text-red-400 font-semibold py-4 rounded-xl text-center border border-red-500/20">
                          Event Full (No Seats)
                        </div>
                      )
                    }

                    return (
                      <>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                          <DialogTrigger className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-orange-500/20 relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
                            RSVP Now <ArrowRight className="w-5 h-5 ml-2" />
                          </DialogTrigger>
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

                    {event.max_seats && (
                      <p className="text-slate-400 text-sm mt-4 text-center relative z-10">
                        {event.max_seats - currentRsvps} seats remaining
                      </p>
                    )}
                    </>
                    )
                  })()}
                </div>
              )}

              {/* Share Widget */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share this event
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl flex justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </button>
                  <button className="flex-1 bg-sky-50 text-sky-500 hover:bg-sky-100 py-2 rounded-xl flex justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded-xl flex justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
