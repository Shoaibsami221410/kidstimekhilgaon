"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, Clock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

const supabase = createClient()

export function EventCard({ event, month, day, time, currentRsvps }: { event: any, month: string, day: string, time: string, currentRsvps: number }) {
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col group">
      <div className="relative h-48 bg-slate-200">
        {event.cover_image_url ? (
          <Image 
            src={event.cover_image_url} 
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
          {event.description ? event.description.replace(/<[^>]*>?/gm, '') : "No description provided."}
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
        
        <div className="mt-4">
          <Link href={`/events/${event.id}`}>
            <button className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-colors">
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
