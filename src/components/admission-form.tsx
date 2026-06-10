"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo } from "react"

const supabase = createClient()

const formSchema = z.object({
  studentFirstName: z.string().min(2, "Required"),
  studentLastName: z.string().min(2, "Required"),
  dob: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  fatherName: z.string().min(2, "Required"),
  motherName: z.string().min(2, "Required"),
  phone: z.string().min(10, "Required"),
  email: z.string().email("Valid email required"),
  programType: z.string().min(1, "Required"),
  subjects: z.array(z.string()).default([]),
  // Files are normally handled via FormData and Supabase Storage
  birthCertificate: z.any().optional(),
  studentPhoto: z.any().optional(),
  guardianNid: z.any().optional(),
})

export function AdmissionForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null)

  useEffect(() => {
    async function loadCourses() {
      const { data } = await supabase.from('courses').select('id, title, program_type, min_age, max_age')
      if (data) setAvailableCourses(data)
    }
    loadCourses()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentFirstName: "",
      studentLastName: "",
      dob: "",
      gender: "",
      fatherName: "",
      motherName: "",
      phone: "",
      email: "",
      programType: "",
      subjects: [],
    },
  })

  const dobValue = form.watch("dob")
  
  useEffect(() => {
    if (dobValue) {
      const dobDate = new Date(dobValue)
      const today = new Date()
      let age = today.getFullYear() - dobDate.getFullYear()
      const m = today.getMonth() - dobDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--
      }
      setCalculatedAge(age)
    } else {
      setCalculatedAge(null)
    }
  }, [dobValue])

  const eligibleCourses = useMemo(() => {
    if (calculatedAge === null) return availableCourses
    return availableCourses.filter(course => {
      const min = course.min_age || 0
      const max = course.max_age || 99
      return calculatedAge >= min && calculatedAge <= max
    })
  }, [availableCourses, calculatedAge])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setErrorMsg("")
    
    try {
      // Helper to upload a file to Supabase storage
      const uploadFile = async (fileList: any, pathPrefix: string) => {
        if (!fileList || fileList.length === 0) return null
        
        const file = fileList[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${pathPrefix}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('kidstime-assets')
          .upload(filePath, file)
          
        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('kidstime-assets').getPublicUrl(filePath)
        return data.publicUrl
      }

      // Upload the three documents concurrently if they exist
      const [birthCertUrl, photoUrl, nidUrl] = await Promise.all([
        uploadFile(values.birthCertificate, 'admissions/birth_certs'),
        uploadFile(values.studentPhoto, 'admissions/photos'),
        uploadFile(values.guardianNid, 'admissions/nids')
      ])

      // Insert data into Supabase
      const { data, error } = await supabase.from('admissions').insert([
        {
          student_first_name: values.studentFirstName,
          student_last_name: values.studentLastName,
          dob: values.dob,
          gender: values.gender,
          father_name: values.fatherName,
          mother_name: values.motherName,
          phone: values.phone,
          email: values.email,
          program_type: values.programType,
          subjects: values.subjects,
          birth_certificate_url: birthCertUrl,
          student_photo_url: photoUrl,
          guardian_nid_url: nidUrl,
          status: 'Pending'
        }
      ])

      if (error) throw error

      setIsSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An error occurred during submission.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="shadow-lg border-green-100 text-center py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl">Application Received!</CardTitle>
          <p className="text-slate-600 max-w-md">
            Thank you for applying. We have received your application and will review it shortly. You will receive an email update regarding your status.
          </p>
          <Button onClick={() => window.location.href='/'} className="mt-4 bg-orange-500 hover:bg-orange-600">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-orange-500">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-xl">Student Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="studentFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Child's first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Child's last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || null}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-6">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Father's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mother's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 01712345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-6">Program Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="programType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || null}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Live">Live (Online)</SelectItem>
                          <SelectItem value="On-Center">On-Center (Physical)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Select Courses</FormLabel>
                        <p className="text-[0.8rem] text-slate-500">
                          {calculatedAge === null 
                            ? "Please enter your child's Date of Birth first to see eligible courses."
                            : `Showing programs eligible for Age ${calculatedAge}.`}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {eligibleCourses.length === 0 && calculatedAge !== null ? (
                          <div className="flex items-center gap-2 p-3 text-sm text-amber-600 bg-amber-50 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            No programs currently available for this age group.
                          </div>
                        ) : (
                          eligibleCourses.map((course) => (
                            <FormField
                              key={course.id}
                              control={form.control}
                              name="subjects"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={course.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(course.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, course.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== course.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal flex flex-col">
                                      <span>{course.title}</span>
                                      <span className="text-xs text-slate-400 mt-0.5">
                                        {course.program_type === 'junior' ? 'Junior Program (4-7)' : course.program_type === 'senior' ? 'Senior Program (8-12)' : 'All Ages'}
                                      </span>
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-6">Required Documents</h3>
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="birthCertificate"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Birth Certificate (PDF/Image)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentPhoto"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Student Passport Photo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianNid"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Guardian NID Copy</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mt-4 text-sm font-medium">
                Error saving application: {errorMsg}
              </div>
            )}
            
            <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-lg h-14 mt-8">
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
