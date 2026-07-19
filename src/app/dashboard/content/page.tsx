"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<any[]>([])
  const supabase = createClient()

  const requiredSections = [
    {
      id: 'home_about',
      page: 'home',
      section: 'about',
      content: {
        subtitle: 'Our Story',
        title: 'About Kids Time',
        description: 'Kids Time, launched in 2017 by Light of Hope Ltd., aims to boost children\'s creativity and prepare them as future leaders through engaging courses. We offer an after-school program that includes Crafting, Drawing, Spoken English, and Singapore Math. Additionally, we have a pre-school program titled Kids Time Montessori School. With over 4000 graduates, Kids Time focuses on nurturing young minds and fostering their creativity and leadership skills.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop'
      }
    },
    {
      id: 'home_services_montessori',
      page: 'home',
      section: 'services_montessori',
      content: {
        subtitle: 'Our Services',
        title: 'Kids Time Montessori Pre-School',
        description: 'At Kids Time, we believe in nurturing young minds and fostering creativity and leadership among children. Kids Time is pioneering the Montessori method in Bangladesh\'s pre-school with its first campus in Dhanmondi. Our Montessori-inspired curriculum is designed to spark curiosity, ignite creativity, and empower children to become confident, independent learners.',
        btn1_text: 'Learn More',
        btn1_link: '/montessori',
        btn2_text: 'WhatsApp',
        btn2_link: 'https://wa.me/123456789',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop'
      }
    },
    {
      id: 'home_services_afterschool',
      page: 'home',
      section: 'services_afterschool',
      content: {
        subtitle: 'Our Services',
        title: 'Kids Time After-School Program',
        description: 'We offer amazing courses in our after-school program, including Crafting, Drawing, Singapore Math, and Spoken English. Your child can join these courses online from anywhere in the country or abroad, right from home. Additionally, these courses are available at our Dhanmondi and Khilgaon centers.',
        items: [
          {
            title: 'Drawing Course',
            desc: 'Best Drawing Course for 5-12 Years Old Childrens',
            image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop'
          },
          {
            title: 'Singapore Math Course',
            desc: 'World\'s Best Math Course for 5-8 Years Old Bangladesh Childrens',
            image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop'
          },
          {
            title: 'Spoken English Course',
            desc: 'International Spoken English Course for 5-8 Years Old Childrens',
            image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop'
          }
        ],
        explore_btn_text: 'Explore Courses',
        explore_btn_link: '/programs'
      }
    },
    {
      id: 'home_community',
      page: 'home',
      section: 'community',
      content: {
        title: 'Kids Time Parent Community',
        description: 'Parents are regularly sharing their thoughts, child\'s activity, their creative task etc. in the Facebook community group.',
        btn_text: 'Explore',
        btn_link: 'https://facebook.com/groups/kidstime',
        testimonial: {
          text: 'Kids Time কে অনেক ধন্যবাদ অনলাইন ক্লাসের এই উদ্যোগের জন্য। ক্লাসগুলো করার পর থেকে ফারহানের ইলেক্ট্রিক ডিভাইসের প্রতি আগ্রহ একদমই নেই! ফারহান এখন প্রতি সপ্তাহে অপেক্ষা করে Kids Time এর ক্লাসগুলোর জন্য!',
          author: 'Kazi Iffat Ara',
          role: 'Parent',
          avatar_url: 'https://ui-avatars.com/api/?name=Kazi+Iffat+Ara&background=random'
        }
      }
    },
    {
      id: 'global_footer',
      page: 'global',
      section: 'footer',
      content: {
        about_text: 'Bangladesh\'s largest creative school — building confident, creative, and future-ready children since 2017.',
        company_links: [
          { title: 'About Us', link: '/about' },
          { title: 'Contact Us', link: '/contact' },
          { title: 'Our Teachers', link: '/teachers' },
          { title: 'Gallery', link: '/gallery' },
          { title: 'Articles', link: '/articles' }
        ],
        branches: [
          {
            name: 'Dhanmondi Branch',
            address: 'Level 5, House 6/1A, Rezina Garden, Road 5A, Dhanmondi, Dhaka-1209'
          },
          {
            name: 'Khilgaon Branch',
            address: 'Academia School, Holding 891, Block C, Malibagh Chowdhurypara Road, Khilgaon, Dhaka-1219'
          }
        ]
      }
    }
  ]

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const { data, error } = await supabase.from("page_content").select("*")
    if (!error && data) {
      const existingIds = data.map(d => d.id)
      const missingSections = requiredSections.filter(s => !existingIds.includes(s.id))
      
      if (missingSections.length > 0) {
        console.log("Seeding missing sections:", missingSections.map(s => s.id))
        const { error: insertError } = await supabase.from("page_content").insert(missingSections)
        if (!insertError) {
          // Re-fetch after seeding
          const { data: newData } = await supabase.from("page_content").select("*")
          if (newData) setContent(newData)
        } else {
          console.error("Error seeding content:", insertError)
          setContent(data)
        }
      } else {
        setContent(data)
      }
    }
    setLoading(false)
  }

  const handleSave = async (id: string, newContent: string) => {
    setSaving(true)
    try {
      const parsedContent = JSON.parse(newContent)
      const { error } = await supabase
        .from("page_content")
        .update({ content: parsedContent })
        .eq("id", id)

      if (error) throw error
      alert("Content saved successfully!")
    } catch (error: any) {
      alert("Error saving content. Make sure it is valid JSON. " + error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
  }

  const homeContent = content.filter(c => c.page === "home")
  const aboutContent = content.filter(c => c.page === "about")
  const globalContent = content.filter(c => c.page === "global")

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website Content</h1>
        <p className="text-slate-500 mt-2">Manage the text and content of your public pages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Page Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Home Page</h2>
          {homeContent.map((item) => (
            <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
          ))}
        </div>

        {/* About Page Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">About Page</h2>
          {aboutContent.map((item) => (
            <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
          ))}
        </div>

        {/* Global Content */}
        <div className="space-y-6 md:col-span-2">
          <h2 className="text-2xl font-bold">Global Content (Header/Footer)</h2>
          {globalContent.map((item) => (
            <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentEditorCard({ item, onSave, saving }: { item: any, onSave: any, saving: boolean }) {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(item.content, null, 2))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{item.section} Section</CardTitle>
        <CardDescription>ID: {item.id}</CardDescription>
        {item.id === 'home_hero' && (
          <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <strong>Tip for Hero Image:</strong> To add an image, include <code>"image_url": "https://..."</code> in the JSON. The recommended image size is <strong>800x600 pixels (4:3 ratio)</strong> for the best display.
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
        />
        <Button 
          onClick={() => onSave(item.id, jsonValue)} 
          disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
