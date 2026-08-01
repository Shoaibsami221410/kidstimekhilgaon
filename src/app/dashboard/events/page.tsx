"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Trash2, Plus, Calendar as CalendarIcon, MapPin, UploadCloud, Loader2, Download, Edit, Eye } from "lucide-react"

export default function EventsAdminPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  // RSVPs Viewer State
  const [isRsvpsDialogOpen, setIsRsvpsDialogOpen] = useState(false)
  const [rsvpsData, setRsvpsData] = useState<any[]>([])
  const [rsvpsLoading, setRsvpsLoading] = useState(false)
  const [viewRsvpsEventTitle, setViewRsvpsEventTitle] = useState("")

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [location, setLocation] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(true)
  const [registrationDeadline, setRegistrationDeadline] = useState("")
  const [maxSeats, setMaxSeats] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      
    if (error) {
      console.error("Error fetching events:", error)
    } else {
      setEvents(data || [])
    }
    setIsLoading(false)
  }

  function resetForm() {
    setEditingEventId(null)
    setTitle("")
    setDescription("")
    setEventDate("")
    setLocation("")
    setCoverImageUrl("")
    setIsRegistrationEnabled(true)
    setRegistrationDeadline("")
    setMaxSeats("")
  }

  function openNew() {
    resetForm()
    setIsDialogOpen(true)
  }

  function openEdit(evt: any) {
    setEditingEventId(evt.id)
    setTitle(evt.title)
    setDescription(evt.description || "")
    setEventDate(new Date(evt.event_date).toISOString().slice(0, 16))
    setLocation(evt.location || "")
    setCoverImageUrl(evt.cover_image_url || "")
    setIsRegistrationEnabled(evt.is_registration_enabled ?? true)
    setRegistrationDeadline(evt.registration_deadline ? new Date(evt.registration_deadline).toISOString().slice(0, 16) : "")
    setMaxSeats(evt.max_seats?.toString() || "")
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error deleting event: " + error.message)
    } else {
      fetchEvents()
    }
  }

  async function handleViewRSVPs(eventId: string, eventTitle: string) {
    setViewRsvpsEventTitle(eventTitle)
    setIsRsvpsDialogOpen(true)
    setRsvpsLoading(true)
    setRsvpsData([])
    
    const { data, error } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      
    if (error) {
      alert("Error fetching RSVPs: " + error.message)
    } else {
      setRsvpsData(data || [])
    }
    setRsvpsLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    
    const payload = {
      title,
      description,
      event_date: new Date(eventDate).toISOString(),
      location,
      cover_image_url: coverImageUrl,
      is_registration_enabled: isRegistrationEnabled,
      registration_deadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : null,
      max_seats: maxSeats ? parseInt(maxSeats) : null
    }

    let error;
    if (editingEventId) {
      const res = await supabase.from("events").update(payload).eq("id", editingEventId)
      error = res.error
    } else {
      const res = await supabase.from("events").insert(payload)
      error = res.error
    }

    setIsSaving(false)

    if (error) {
      alert("Error saving event: " + error.message)
    } else {
      setIsDialogOpen(false)
      resetForm()
      fetchEvents()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Events Management</h1>
          <p className="text-slate-500 mt-2">Create and manage upcoming events and registration limits.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            render={
              <Button onClick={openNew} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add New Event
              </Button>
            } 
          />
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEventId ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                  <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Art Workshop" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date & Time <span className="text-red-500">*</span></Label>
                  <Input id="date" type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Kids Time Khilgaon Center" />
                </div>
                
                {/* Registration Limits Section */}
                <div className="col-span-2 p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
                  <h3 className="font-semibold text-orange-900 border-b border-orange-200 pb-2">Registration Settings</h3>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="enable-registration" 
                      checked={isRegistrationEnabled}
                      onChange={e => setIsRegistrationEnabled(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
                    />
                    <Label htmlFor="enable-registration" className="font-medium text-orange-900 cursor-pointer">
                      Enable RSVP / Public Registration for this Event
                    </Label>
                  </div>

                  {isRegistrationEnabled && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="deadline" className="text-orange-900">Registration Deadline (Optional)</Label>
                        <Input id="deadline" type="datetime-local" value={registrationDeadline} onChange={e => setRegistrationDeadline(e.target.value)} className="border-orange-200" />
                        <p className="text-xs text-orange-700">Form will auto-close after this date.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seats" className="text-orange-900">Maximum Seats (Optional)</Label>
                        <Input id="seats" type="number" min="1" value={maxSeats} onChange={e => setMaxSeats(e.target.value)} placeholder="e.g. 20" className="border-orange-200" />
                        <p className="text-xs text-orange-700">Form will auto-close when full.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief details about the event..." className="h-24" />
                </div>

                <div className="col-span-2">
                  <ImagePickerField value={coverImageUrl} onChange={setCoverImageUrl} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingEventId ? "Save Changes" : "Publish Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isRsvpsDialogOpen} onOpenChange={setIsRsvpsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle>RSVPs: {viewRsvpsEventTitle}</DialogTitle>
                <DialogDescription>List of all registrations for this event.</DialogDescription>
              </div>
              <Button 
                onClick={() => {
                  if (rsvpsData.length === 0) {
                    alert("No data to export")
                    return
                  }
                  const headers = ["Parent Name", "Phone", "Email", "Student Name", "Student Age", "Registered At"]
                  const csvContent = [
                    headers.join(","),
                    ...rsvpsData.map(row => [
                      `"${row.parent_name || ''}"`, 
                      `"=""${row.phone || ''}"""`, 
                      `"${row.email || ''}"`, 
                      `"${row.student_name || ''}"`, 
                      row.student_age || '', 
                      `"${new Date(row.created_at).toLocaleString()}"`
                    ].join(","))
                  ].join("\n")
                  
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.setAttribute("href", url)
                  link.setAttribute("download", `RSVPs_${viewRsvpsEventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                variant="outline"
                className="mr-6 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-2" /> Download Excel CSV
              </Button>
            </DialogHeader>
            <div className="flex-1 overflow-auto border rounded-md mt-4">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
                  <TableRow>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvpsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
                      </TableCell>
                    </TableRow>
                  ) : rsvpsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No registrations yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rsvpsData.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.parent_name}</TableCell>
                        <TableCell>{rsvp.phone}</TableCell>
                        <TableCell>{rsvp.email}</TableCell>
                        <TableCell>{rsvp.student_name || "-"}</TableCell>
                        <TableCell>{rsvp.student_age || "-"}</TableCell>
                        <TableCell className="text-xs text-slate-500">{new Date(rsvp.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg">All Events</CardTitle>
          <CardDescription>A complete list of your past and upcoming events.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Event Details</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-slate-900">No events found</p>
                    <p>Click "Add New Event" to create one.</p>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((evt) => {
                  const dateObj = new Date(evt.event_date);
                  const isRegEnabled = evt.is_registration_enabled ?? true;
                  
                  return (
                    <TableRow key={evt.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="w-16 h-12 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                          {evt.cover_image_url ? (
                            <img src={evt.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <CalendarIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{evt.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{evt.description}</div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 pl-5">
                          {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!isRegEnabled ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Disabled</span>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">Active</span>
                            {evt.max_seats && <div className="text-xs text-slate-500">Max: {evt.max_seats} seats</div>}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button 
                            onClick={() => handleViewRSVPs(evt.id, evt.title)}
                            variant="outline" 
                            size="sm" 
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            title="View RSVPs"
                          >
                            <Eye className="w-4 h-4 mr-1.5" /> RSVPs
                          </Button>
                          <Button 
                            onClick={() => openEdit(evt)}
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDelete(evt.id)}
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ImagePickerField({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload')
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `public/images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('kidstime-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('kidstime-assets')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (err: any) {
      alert("Error uploading image: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3 p-4 border rounded-xl bg-slate-50">
      <Label className="font-semibold text-slate-700 block">Cover Image</Label>
      
      {value && (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {!value && (
        <>
          <div className="flex bg-slate-200/50 rounded-lg p-1 w-fit">
            <button 
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Upload Image
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('link')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Enter Link
            </button>
          </div>

          {activeTab === 'link' ? (
            <Input 
              className="focus:ring-orange-500 rounded-lg bg-white"
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="https://..."
            />
          ) : (
            <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload} 
                disabled={uploading}
                className="hidden" 
                id="file-upload-event-cover" 
              />
              <Label htmlFor="file-upload-event-cover" className="cursor-pointer flex flex-col items-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</span>
              </Label>
            </div>
          )}
        </>
      )}
    </div>
  )
}
