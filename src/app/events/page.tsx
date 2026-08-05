import { createClient } from "@/lib/supabase/server"
import { Calendar } from "lucide-react"
import { EventCard } from "@/components/event-card"

export const revalidate = 60

export default async function EventsPage() {
  const supabase = await createClient()
  
  // Fetch data in parallel
  const [
    { data: eventsRes },
    { data: contentRes },
    { data: countsRes }
  ] = await Promise.all([
    supabase.from('events').select('*').order('event_date', { ascending: true }),
    supabase.from('page_content').select('*').eq('page', 'events'),
    supabase.rpc('get_event_rsvp_counts')
  ])

  const events = eventsRes || []
  
  const rsvpCounts: Record<string, number> = {}
  if (countsRes) {
    countsRes.forEach((row: any) => {
      rsvpCounts[row.event_id] = parseInt(row.rsvp_count)
    })
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      day: date.getDate().toString(),
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
          {events.length === 0 ? (
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
