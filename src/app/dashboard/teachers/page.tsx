"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, PlusCircle, Pencil, Trash2, Loader2, BookOpen } from "lucide-react"
import { ImagePicker } from "@/components/image-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TeachersAdminPage() {
  const supabase = createClient()
  const [teachers, setTeachers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // New Teacher Form State
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [courseId, setCourseId] = useState('none')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('')
  const [certifications, setCertifications] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    
    // Fetch from the new teacher_profiles table
    const { data: teacherData } = await supabase
      .from("teacher_profiles")
      .select("*")
      .order('created_at', { ascending: false })
      
    // Fetch all courses for the dropdown
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title')

    if (coursesData) setCourses(coursesData)
    if (teacherData) setTeachers(teacherData)
      
    setIsLoading(false)
  }

  function openAddModal() {
    setEditingId(null)
    setName('')
    setRole('')
    setImageUrl('')
    setCourseId('none')
    setQualifications('')
    setExperience('')
    setCertifications('')
    setIsDialogOpen(true)
  }

  function openEditModal(teacher: any) {
    setEditingId(teacher.id)
    setName(teacher.name || '')
    setRole(teacher.role || '')
    setImageUrl(teacher.image_url || '')
    setCourseId(teacher.course_id || 'none')
    setQualifications(teacher.qualifications || '')
    setExperience(teacher.experience || '')
    setCertifications(teacher.certifications || '')
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this teacher profile?")) return
    
    await supabase.from('teacher_profiles').delete().eq('id', id)
    fetchData()
  }

  async function handleSaveTeacher(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)

    try {
      const selectedCourseId = courseId === 'none' ? null : courseId
      
      const payload = {
        name,
        role,
        image_url: imageUrl,
        qualifications,
        experience,
        certifications,
        course_id: selectedCourseId
      }

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('teacher_profiles')
          .update(payload)
          .eq('id', editingId)
          
        if (error) throw error
        alert("Teacher updated successfully!")
      } else {
        // Insert new
        const { error } = await supabase
          .from('teacher_profiles')
          .insert([payload])
          
        if (error) throw error
        alert("Teacher added successfully!")
      }

      setIsDialogOpen(false)
      fetchData() // Refresh list

    } catch (error: any) {
      alert("Error saving teacher: " + error.message)
    }
    
    setIsAdding(false)
  }

  const getCourseName = (cId: string) => {
    if (!cId) return "No Course Assigned"
    const course = courses.find(c => c.id === cId)
    return course ? course.title : "Unknown Course"
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-orange-500" />
          Teachers
        </h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={openAddModal} className="h-9 bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Teacher
          </Button>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
              <DialogDescription>
                Create a public profile for this teacher. No login account will be created.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveTeacher} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Salman" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Title</Label>
                  <Input id="role" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Junior Art Teacher" />
                </div>
              </div>
              
              <div className="space-y-2">
                <ImagePicker 
                  value={imageUrl} 
                  onChange={setImageUrl} 
                  label="Image URL" 
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label className="flex items-center gap-2 font-semibold text-blue-600">
                  <BookOpen className="w-4 h-4" /> Assign to Course Page
                </Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- No Course Assigned --</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">This will automatically display their profile on the selected course details page.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input id="experience" placeholder="e.g. 5 Years" value={experience} onChange={e => setExperience(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input id="certifications" placeholder="e.g. Certified Early Childhood Educator" value={certifications} onChange={e => setCertifications(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input id="qualifications" placeholder="e.g. B.Ed, M.Sc in Mathematics" value={qualifications} onChange={e => setQualifications(e.target.value)} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={isAdding}>
                  {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingId ? "Update Teacher" : "Save Teacher"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed text-slate-500">
            No teachers found. Click "Add Teacher" to create one.
          </div>
        ) : (
          teachers.map(teacher => (
            <Card key={teacher.id} className="shadow-sm border-0 ring-1 ring-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b bg-slate-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                      {teacher.image_url ? (
                        <img src={teacher.image_url} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg bg-orange-100">
                          {teacher.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <CardDescription className="font-medium text-orange-500">{teacher.role || "Teacher"}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button onClick={() => openEditModal(teacher)} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(teacher.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Course</p>
                  <p className="font-medium text-slate-700">{getCourseName(teacher.course_id)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Experience</p>
                    <p className="truncate text-slate-700">{teacher.experience || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Qualifications</p>
                    <p className="truncate text-slate-700">{teacher.qualifications || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
