"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, PlusCircle, Pencil, Trash2, Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
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

  // New Teacher Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [courseId, setCourseId] = useState('none')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    
    // Fetch teachers (Users with role='teacher')
    const { data: userData } = await supabase
      .from("users")
      .select(`
        *,
        teachers (
          qualifications,
          experience,
          course_id
        )
      `)
      .eq('role', 'teacher')
      
    // Fetch all courses for the dropdown
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title')

    if (coursesData) setCourses(coursesData)
    
    if (userData) {
      // Map the joined data
      const mappedTeachers = userData.map(u => ({
        ...u,
        ...u.teachers
      }))
      setTeachers(mappedTeachers)
    }
    setIsLoading(false)
  }

  async function handleAddTeacher(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)

    try {
      // 1. Create a separate Supabase client that does NOT persist session
      // so it doesn't log the admin out when creating a new user!
      const supabaseAdmin = createClient()
      
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'teacher'
          }
        }
      })

      if (authError) throw authError
      
      const userId = authData.user?.id
      if (!userId) throw new Error("Failed to create auth user")

      // Note: Because of Supabase triggers or RLS, the public.users row might already be created by a trigger.
      // We will try to update it to ensure the role is set correctly.
      await supabase.from('users').update({ role: 'teacher', full_name: name }).eq('id', userId)

      // 2. Insert the teacher profile
      const selectedCourseId = courseId === 'none' ? null : courseId
      
      const { error: teacherError } = await supabase
        .from('teachers')
        .upsert({
          id: userId,
          qualifications,
          experience,
          course_id: selectedCourseId
        })

      if (teacherError) throw teacherError

      alert("Teacher added successfully!")
      setIsDialogOpen(false)
      fetchData() // Refresh list
      
      // Reset form
      setName('')
      setEmail('')
      setPassword('')
      setCourseId('none')
      setQualifications('')
      setExperience('')

    } catch (error: any) {
      alert("Error adding teacher: " + error.message)
    }
    
    setIsAdding(false)
  }

  const getCourseName = (cId: string) => {
    if (!cId) return "No Course Assigned"
    const course = courses.find(c => c.id === cId)
    return course ? course.title : "Unknown Course"
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-orange-500" />
          Teachers
        </h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)} className="h-9 bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Teacher
          </Button>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher profile and assign them to a course.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTeacher} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password (For their login)</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label className="flex items-center gap-2 font-semibold text-blue-600">
                  <BookOpen className="w-4 h-4" /> Assign Role / Course
                </Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course to teach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- No Course Assigned --</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input id="qualifications" placeholder="e.g. BFA" value={qualifications} onChange={e => setQualifications(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input id="experience" placeholder="e.g. 5 Years" value={experience} onChange={e => setExperience(e.target.value)} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={isAdding}>
                  {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Teacher
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
            <Card key={teacher.id} className="shadow-sm border-0 ring-1 ring-slate-200">
              <CardHeader className="pb-3 border-b bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{teacher.full_name}</CardTitle>
                    <CardDescription className="truncate">{teacher.email}</CardDescription>
                  </div>
                  <Link href={`/dashboard/users/${teacher.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Course</p>
                  <p className="font-medium text-blue-600">{getCourseName(teacher.course_id)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Qualifications</p>
                    <p className="truncate text-slate-700">{teacher.qualifications || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Experience</p>
                    <p className="truncate text-slate-700">{teacher.experience || "-"}</p>
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
