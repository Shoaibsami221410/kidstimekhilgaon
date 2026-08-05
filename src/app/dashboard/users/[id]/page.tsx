"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, User as UserIcon, BookOpen } from "lucide-react"
import Link from "next/link"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  // React 19+ requires unwrapping params if it's a promise, but in Next.js 14 Client Components useParams is synchronous.
  const userId = params.id as string
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [teacherProfile, setTeacherProfile] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Teacher specific state
  const [courseId, setCourseId] = useState<string>('none')
  const [qualifications, setQualifications] = useState('')
  const [experience, setExperience] = useState('')

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return
      
      // Fetch user basic info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
        
      if (userData) {
        setUser(userData)
        
        // If user is a teacher, fetch teacher profile
        if (userData.role === 'teacher') {
          const { data: teacherData } = await supabase
            .from('teachers')
            .select('*')
            .eq('id', userId)
            .single()
            
          if (teacherData) {
            setTeacherProfile(teacherData)
            setCourseId(teacherData.course_id || 'none')
            setQualifications(teacherData.qualifications || '')
            setExperience(teacherData.experience || '')
          }
          
          // Also fetch all courses for the dropdown
          const { data: coursesData } = await supabase
            .from('courses')
            .select('id, title')
            
          if (coursesData) {
            setCourses(coursesData)
          }
        }
      } else {
        alert("User not found!")
        router.push("/dashboard/users")
      }
      setLoading(false)
    }
    
    fetchUserData()
  }, [userId, router])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const role = formData.get('role') as string

    // Update basic user profile
    const { error: userError } = await supabase
      .from('users')
      .update({ full_name, phone, role })
      .eq('id', userId)

    if (userError) {
      alert("Error updating user: " + userError.message)
      setIsSaving(false)
      return
    }

    // If role is teacher, update/upsert teacher profile
    if (role === 'teacher') {
      const selectedCourseId = courseId === 'none' ? null : courseId
      
      const { error: teacherError } = await supabase
        .from('teachers')
        .upsert({ 
          id: userId,
          qualifications,
          experience,
          course_id: selectedCourseId
        })
        
      if (teacherError) {
        alert("Error updating teacher profile: " + teacherError.message)
        setIsSaving(false)
        return
      }
    }

    setIsSaving(false)
    alert("User profile updated successfully!")
    router.push("/dashboard/users")
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit User</h1>
          <p className="text-slate-500 text-sm">Update profile and permissions.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center gap-3 py-4">
              <UserIcon className="w-5 h-5 text-slate-500" />
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email} disabled className="bg-slate-50 text-slate-500" />
                <p className="text-xs text-slate-400">Email cannot be changed.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" defaultValue={user?.full_name} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={user?.phone || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={user?.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {user?.role === 'teacher' && (
            <Card className="shadow-sm border-0 ring-1 ring-blue-200 bg-blue-50/30">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 flex flex-row items-center gap-3 py-4">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-blue-900">Teacher Assignments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Assigned Course</Label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- No Course Assigned --</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Assigning a course will make this teacher appear on the course's public details page.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input 
                    id="qualifications" 
                    value={qualifications} 
                    onChange={e => setQualifications(e.target.value)} 
                    placeholder="e.g. B.F.A in Fine Arts" 
                    className="bg-white" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input 
                    id="experience" 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)} 
                    placeholder="e.g. 5+ Years Teaching Kids" 
                    className="bg-white" 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isSaving} className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
