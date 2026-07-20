"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PlayCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  parentName: z.string().min(2, "Name must be at least 2 characters"),
  parentPhone: z.string().min(10, "Valid phone number required"),
  parentEmail: z.string().email("Valid email required"),
  childName: z.string().min(2, "Child name must be at least 2 characters"),
  childAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 10, {
    message: "Age must be between 1 and 9",
  }),
})

type DemoClass = {
  id: string
  title: string
  type: string
  duration: string
  thumbnail: string
}

const demoClasses: DemoClass[] = [
  { id: "1", title: "Fun with Phonics", type: "Recorded Class", duration: "15 mins", thumbnail: "bg-blue-100" },
  { id: "2", title: "Colors and Shapes", type: "Practice Activity", duration: "10 mins", thumbnail: "bg-rose-100" },
  { id: "3", title: "The Hungry Caterpillar", type: "Storytelling", duration: "12 mins", thumbnail: "bg-green-100" },
  { id: "4", title: "Finger Painting Basics", type: "Art Activity", duration: "20 mins", thumbnail: "bg-amber-100" },
]

/**
 * Demo Class Flow Component
 * Handles the parent registration form and granting access to demo videos
 */
export function DemoClassFlow() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [completedClasses, setCompletedClasses] = useState<string[]>([])
  const [showEnrollPopup, setShowEnrollPopup] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      childName: "",
      childAge: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, save to Supabase public.demo_completions here
    console.log(values)
    setIsRegistered(true)
  }

  function handleWatch(id: string) {
    if (!completedClasses.includes(id)) {
      const newCompleted = [...completedClasses, id]
      setCompletedClasses(newCompleted)
      
      // If they completed 2 or more, show popup
      if (newCompleted.length === 2) {
        setTimeout(() => setShowEnrollPopup(true), 2000)
      }
    }
  }

  if (!isRegistered) {
    return (
      <Card className="shadow-lg border-orange-100">
        <CardHeader className="bg-orange-50/50 border-b pb-8">
          <CardTitle className="text-2xl">Registration Required</CardTitle>
          <CardDescription className="text-base">Please fill out this short form to access the Demo Library.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01700000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Age</FormLabel>
                      <FormControl>
                        <Input placeholder="4" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-lg h-12">
                Access Demo Library
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {demoClasses.map((demo) => {
          const isCompleted = completedClasses.includes(demo.id)
          return (
            <Card key={demo.id} className="overflow-hidden group">
              <div className={`h-40 w-full ${demo.thumbnail} flex items-center justify-center relative`}>
                <PlayCircle className="w-16 h-16 text-slate-700 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{demo.title}</h3>
                    <p className="text-sm text-slate-500">{demo.type}</p>
                  </div>
                  <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded">{demo.duration}</span>
                </div>
                <Button 
                  onClick={() => handleWatch(demo.id)} 
                  variant={isCompleted ? "outline" : "default"}
                  className={`w-full ${!isCompleted ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                >
                  {isCompleted ? "Watch Again" : "Watch Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showEnrollPopup} onOpenChange={setShowEnrollPopup}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <DialogTitle className="text-2xl mb-2 text-center">Great Job!</DialogTitle>
            <DialogDescription className="text-base text-center">
              You've completed some of our demo classes. Would you like to enroll your child in Kids Time Khilgaon?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={() => router.push('/admissions')} className="bg-orange-500 hover:bg-orange-600 h-12 text-lg">
              Enroll Now
            </Button>
            <Button onClick={() => window.location.href='tel:+8801234567890'} variant="outline" className="h-12 text-lg">
              Contact Counselor
            </Button>
            <Button onClick={() => setShowEnrollPopup(false)} variant="ghost" className="text-slate-500">
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
