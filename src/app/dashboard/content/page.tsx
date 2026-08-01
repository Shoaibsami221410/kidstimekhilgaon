"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/image-picker"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("home")
  const supabase = createClient()

  const requiredSections = [
    {
      id: 'home_hero',
      page: 'home',
      section: 'hero',
      content: {
        title_black: "Nurturing Brilliant Minds for a",
        title_black_color: "#ffffff",
        title_black_font: "Inter",
        title_gradient: "Brighter Future",
        title_gradient_color: "#f97316",
        title_gradient_font: "Inter",
        description: "Kids Time Khilgaon offers a world-class early childhood education with a holistic approach to learning, creativity, and personal development.",
        description_color: "#e2e8f0",
        description_font: "Inter",
        badge: "Admissions Open for 2026!",
        badge_color: "#ffffff",
        button_text: "Watch Demo Classes",
        button_link: "/programs",
        button_bg_color: "#f97316",
        button_text_color: "#ffffff",
        button_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"
      }
    },
    {
      id: 'home_about',
      page: 'home',
      section: 'about',
      content: {
        subtitle: 'Our Story',
        subtitle_color: "#0ea5e9",
        subtitle_font: "Inter",
        title: 'About Kids Time',
        title_color: "#dc2626",
        title_font: "Inter",
        description: 'Kids Time, launched in 2017 by Light of Hope Ltd., aims to boost children\'s creativity and prepare them as future leaders through engaging courses.',
        description_color: "#475569",
        description_font: "Inter",
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
        subtitle_color: "#0ea5e9",
        subtitle_font: "Inter",
        title: 'Kids Time Montessori Pre-School',
        title_color: "#dc2626",
        title_font: "Inter",
        description: 'At Kids Time, we believe in nurturing young minds and fostering creativity and leadership among children.',
        description_color: "#475569",
        description_font: "Inter",
        btn1_text: 'Learn More',
        btn1_link: '/montessori',
        btn1_bg_color: "#dc2626",
        btn1_text_color: "#ffffff",
        btn1_font: "Inter",
        btn2_text: 'WhatsApp',
        btn2_link: 'https://wa.me/123456789',
        btn2_bg_color: "#0ea5e9",
        btn2_text_color: "#ffffff",
        btn2_font: "Inter",
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop'
      }
    },
    {
      id: 'home_services_afterschool',
      page: 'home',
      section: 'services_afterschool',
      content: {
        subtitle: 'Our Services',
        subtitle_color: "#0ea5e9",
        subtitle_font: "Inter",
        title: 'Kids Time After-School Program',
        title_color: "#0f172a",
        title_font: "Inter",
        description: 'We offer amazing courses in our after-school program.',
        description_color: "#475569",
        description_font: "Inter",
        items: [
          {
            title: 'Drawing Course',
            title_color: "#0f172a",
            desc: 'Best Drawing Course',
            desc_color: "#475569",
            image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop'
          }
        ],
        explore_btn_text: 'Explore Courses',
        explore_btn_link: '/programs',
        explore_btn_bg_color: "#f97316",
        explore_btn_text_color: "#ffffff",
        explore_btn_font: "Inter"
      }
    },
    {
      id: 'home_community',
      page: 'home',
      section: 'community',
      content: {
        title: 'Kids Time Parent Community',
        title_color: "#0f172a",
        title_font: "Inter",
        description: 'Parents are regularly sharing their thoughts in the Facebook community group.',
        description_color: "#475569",
        description_font: "Inter",
        btn_text: 'Explore',
        btn_link: 'https://facebook.com/groups/kidstime',
        btn_bg_color: "#dc2626",
        btn_text_color: "#ffffff",
        btn_font: "Inter",
        testimonial: {
          text: 'Kids Time কে অনেক ধন্যবাদ অনলাইন ক্লাসের এই উদ্যোগের জন্য।',
          text_color: "#334155",
          text_font: "Inter",
          author: 'Kazi Iffat Ara',
          role: 'Parent',
          avatar_url: 'https://ui-avatars.com/api/?name=Kazi+Iffat+Ara&background=random'
        }
      }
    },
    {
      id: 'about_hero',
      page: 'about',
      section: 'hero',
      content: {
        title: 'Nurturing Creativity in Every Child',
        title_color: '#ffffff',
        title_font: 'Inter',
        description: 'At Kids Time Khilgaon, we believe every child is an artist, a storyteller, and an innovator waiting to be discovered.',
        description_color: '#cbd5e1',
        description_font: 'Inter',
        image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop'
      }
    },
    {
      id: 'about_mission_vision',
      page: 'about',
      section: 'mission_vision',
      content: {
        mission_title: "Our Mission",
        mission_title_color: "#0f172a",
        mission_title_font: "Inter",
        mission_desc: "To provide a safe, engaging, and highly creative environment where children can explore their imaginations. We focus on developing core skills through art, craft, and storytelling, building confidence that lasts a lifetime.",
        mission_desc_color: "#475569",
        mission_desc_font: "Inter",
        vision_title: "Our Vision",
        vision_title_color: "#0f172a",
        vision_title_font: "Inter",
        vision_desc: "To be the leading creative development center in Bangladesh, where every child's unique talent is recognized, nurtured, and celebrated.",
        vision_desc_color: "#475569",
        vision_desc_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
      }
    },
    {
      id: 'about_features',
      page: 'about',
      section: 'features',
      content: {
        title: "Why Kids Time Khilgaon?",
        title_color: "#0f172a",
        title_font: "Inter",
        description: "We offer a unique blend of creative learning methodologies tailored for early childhood development.",
        description_color: "#475569",
        description_font: "Inter",
        items: [
          { title: "Expert Instructors", desc: "Our teachers are highly trained professionals passionate about early childhood education and creative arts." },
          { title: "Interactive Curriculum", desc: "Every lesson is designed to be highly interactive, ensuring children remain engaged and excited to learn." },
          { title: "Safe Environment", desc: "We provide a secure, welcoming, and child-friendly physical and digital environment." },
          { title: "Hybrid Learning", desc: "Flexibility of both on-center physical classes and engaging live online sessions." },
          { title: "Continuous Feedback", desc: "Parents receive regular updates, assignments, and progress reports through our dedicated dashboard." },
          { title: "Holistic Development", desc: "Focusing not just on art, but on cognitive, motor, and social skills development." }
        ]
      }
    },
    {
      id: 'programs_hero',
      page: 'programs',
      section: 'hero',
      content: {
        title_cyan: "Live",
        title_cyan_color: "#00b4ff",
        title_cyan_font: "Inter",
        title_red: "Online Course For Kids",
        title_red_color: "#ef4444",
        title_red_font: "Inter",
        subtitle: "Creativity has no bound! Unleash your child's creativity with the ultimate online course for kids from anywhere.",
        subtitle_color: "#00b4ff",
        subtitle_font: "Inter",
        description: "We are offering the Best Online Drawing Courses, Crafting Classes, Spoken English For Kids & Singapore Math Online. Your child now can join these courses through online from anywhere in the country or abroad while sitting at home.",
        description_color: "#334155",
        description_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"
      }
    },
    {
      id: 'facilities_hero',
      page: 'facilities',
      section: 'hero',
      content: {
        title: "Our Campus & Facilities",
        title_color: "#ffffff",
        title_font: "Inter",
        description: "Explore the safe, inspiring, and fully-equipped spaces where your child's creativity comes to life.",
        description_color: "#cbd5e1",
        description_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
      }
    },
    {
      id: 'facilities_list',
      page: 'facilities',
      section: 'list',
      content: {
        facilities: [
          {
            title: "Interactive Classrooms",
            icon: "MonitorPlay",
            description: "Equipped with smart boards and child-friendly digital tools to make learning interactive and highly engaging.",
            image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
          },
          {
            title: "Art Studio",
            icon: "Brush",
            description: "A dedicated space filled with canvases, non-toxic paints, and endless craft supplies where kids can get messy and creative.",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop"
          },
          {
            title: "Parent Lounge",
            icon: "Coffee",
            description: "A comfortable waiting area for parents with complimentary Wi-Fi, coffee, and a clear view of the classrooms.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          },
          {
            title: "Safety First",
            icon: "ShieldCheck",
            description: "24/7 CCTV surveillance, child-safe furniture, secure entry systems, and strict pickup policies to ensure absolute safety.",
            image: "/safety-first.png"
          }
        ]
      }
    },
    {
      id: 'teachers_hero',
      page: 'teachers',
      section: 'hero',
      content: {
        title: "Our Expert Teachers",
        title_color: "#0f172a",
        title_font: "Inter",
        description: "Meet the passionate educators dedicated to nurturing your child's creativity.",
        description_color: "#475569",
        description_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"
      }
    },
    {
      id: 'gallery_hero',
      page: 'gallery',
      section: 'hero',
      content: {
        title: "Moments of Joy",
        title_color: "#0f172a",
        title_font: "Inter",
        description: "Glimpses of joy, creativity, and learning at Kids Time Khilgaon.",
        description_color: "#475569",
        description_font: "Inter"
      }
    },
    {
      id: 'teachers_hero',
      page: 'teachers',
      section: 'hero',
      content: {
        title: "Our Expert Teachers",
        title_color: "#0f172a",
        title_font: "Inter",
        description: "Meet the passionate educators dedicated to nurturing your child's creativity.",
        description_color: "#475569",
        description_font: "Inter",
        image_url: ""
      }
    },
    {
      id: 'teachers_list',
      page: 'teachers',
      section: 'list',
      content: {
        teachers: [
          {
            name: "John Doe",
            role: "Creative Educator",
            qualifications: "B.Ed, M.Sc in Mathematics",
            experience: "5 Years",
            certifications: "Certified Early Childhood Educator",
            image_url: ""
          }
        ]
      }
    },
    {
      id: 'contact_hero',
      page: 'contact',
      section: 'hero',
      content: {
        title: "Get in Touch",
        title_color: "#ffffff",
        title_font: "Inter",
        description: "Have questions about our programs, admissions, or anything else? We'd love to hear from you.",
        description_color: "#cbd5e1",
        description_font: "Inter",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"
      }
    },
    {
      id: 'contact_info',
      page: 'contact',
      section: 'info',
      content: {
        title: "Contact Information",
        title_color: "#0f172a",
        title_font: "Inter",
        description: "Our friendly team is always here to help. Reach out to us through any of the following methods or drop by our center.",
        description_color: "#475569",
        description_font: "Inter",
        address: `Block C, Road 12, House 45
Khilgaon, Dhaka 1219
Bangladesh`,
        phone: `Franchisee Owner - Jiaul Haque
+880 1685-729549

Coordinator - Junaida Islam
+880 1625-626227`,
        hours: "Friday - Saturday: 9:00 AM - 6:00 PM"
      }
    },
    {
      id: 'global_footer',
      page: 'global',
      section: 'footer',
      content: {
        about_text: 'Bangladesh\'s largest creative school — building confident, creative, and future-ready children since 2017.',
        about_text_color: "#cbd5e1",
        about_text_font: "Inter",
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
    const mergedContent = requiredSections.map(req => {
      const existing = data?.find(d => d.id === req.id)
      if (existing) {
        // Deep merge existing content with required defaults
        return {
          ...existing,
          content: { ...req.content, ...existing.content }
        }
      }
      return req
    })

    if (!error && data) {
      const existingIds = data.map(d => d.id)
      const missingSections = requiredSections.filter(s => !existingIds.includes(s.id))
      
      if (missingSections.length > 0) {
        console.log("Seeding missing sections:", missingSections.map(s => s.id))
        const { error: insertError } = await supabase.from("page_content").insert(missingSections)
        if (!insertError) {
          // Re-fetch after seeding
          const { data: newData } = await supabase.from("page_content").select("*")
          if (newData) {
            const finalMerged = requiredSections.map(req => {
              const existing = newData.find(d => d.id === req.id)
              return existing ? { ...existing, content: { ...req.content, ...existing.content } } : req
            })
            setContent(finalMerged)
          }
        } else {
          console.error("Error seeding content:", insertError)
          setContent(mergedContent)
        }
      } else {
        setContent(mergedContent)
      }
    }
    setLoading(false)
  }

  const handleSave = async (id: string, updatedContentObj: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("page_content")
        .update({ content: updatedContentObj })
        .eq("id", id)

      if (error) throw error
      alert("Content saved successfully!")
    } catch (error: any) {
      alert("Error saving content: " + error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
  }

  const homeContent = content.filter(c => c.page === "home")
  const aboutContent = content.filter(c => c.page === "about")
  const globalContent = content.filter(c => c.page === "global")

  const pages = [
    { id: "home", label: "Home Page" },
    { id: "about", label: "About Us" },
    { id: "programs", label: "Programs" },
    { id: "facilities", label: "Facilities" },
    { id: "teachers", label: "Teachers" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact Us" },
    { id: "global", label: "Global Settings" },
  ]

  const activeContent = content.filter(c => c.page === activeTab)

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website Content</h1>
        <p className="text-slate-500 mt-2">Manage the text and content of your public pages.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-6">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === p.id ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 w-full">
          <h2 className="text-2xl font-bold text-slate-800">{pages.find(p => p.id === activeTab)?.label} Content</h2>
          {activeContent.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              No sections defined for this page yet.
            </div>
          ) : (
            activeContent.map((item) => (
              <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function DynamicField({ fieldKey, value, onChange }: { fieldKey: string, value: any, onChange: (val: any) => void }) {
  const label = fieldKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())

  if (typeof value === "string") {
    if (fieldKey.includes("image") || fieldKey.includes("thumbnail") || fieldKey.includes("avatar")) {
      return (
        <div className="space-y-1">
          <ImagePicker value={value} onChange={onChange} label={label} />
        </div>
      )
    }
    if (fieldKey.includes("color")) {
      return (
        <div className="space-y-1">
          <Label>{label}</Label>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={value || "#000000"} 
              onChange={e => onChange(e.target.value)}
              className="w-12 h-10 p-1 rounded-lg border cursor-pointer"
            />
            <Input 
              value={value} 
              onChange={e => onChange(e.target.value)} 
              className="w-32 uppercase font-mono"
            />
          </div>
        </div>
      )
    }
    if (fieldKey.includes("font")) {
      return (
        <div className="space-y-1">
          <Label>{label}</Label>
          <Input 
            list="fonts-list"
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder="Select or type a font..."
          />
          <datalist id="fonts-list">
            <option value="Inter" />
            <option value="Roboto" />
            <option value="Playfair Display" />
            <option value="Montserrat" />
            <option value="Outfit" />
            <option value="Poppins" />
            <option value="system-ui" />
            <option value="serif" />
            <option value="monospace" />
          </datalist>
        </div>
      )
    }
    if (fieldKey.includes("description") || fieldKey.includes("text") || fieldKey === "desc") {
      return (
        <div className="space-y-1">
          <Label>{label}</Label>
          <Textarea 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="h-24"
          />
        </div>
      )
    }
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Input value={value} onChange={e => onChange(e.target.value)} />
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-4 border rounded-xl p-4 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">{label}</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => {
              const emptyItem = value.length > 0 ? 
                Object.fromEntries(Object.keys(value[0]).map(k => [k, ""])) : 
                {}
              onChange([...value, emptyItem])
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
        
        {value.map((item, index) => (
          <div key={index} className="relative p-4 border rounded-lg bg-white shadow-sm space-y-4">
            <button
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="font-semibold text-sm text-slate-500 mb-2 border-b pb-2">Item {index + 1}</div>
            
            {Object.keys(item).map(subKey => (
              <DynamicField 
                key={subKey} 
                fieldKey={subKey} 
                value={item[subKey]} 
                onChange={(newSubVal) => {
                  const newArray = [...value]
                  newArray[index] = { ...newArray[index], [subKey]: newSubVal }
                  onChange(newArray)
                }} 
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-4 border rounded-xl p-4 bg-slate-50/50">
        <Label className="text-lg font-semibold">{label}</Label>
        {Object.keys(value).map(subKey => (
          <DynamicField 
            key={subKey} 
            fieldKey={subKey} 
            value={value[subKey]} 
            onChange={(newSubVal) => {
              onChange({ ...value, [subKey]: newSubVal })
            }} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={String(value)} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function ContentEditorCard({ item, onSave, saving }: { item: any, onSave: any, saving: boolean }) {
  const [formData, setFormData] = useState<any>(item.content || {})

  return (
    <Card>
      <CardHeader className="bg-slate-50 border-b pb-4">
        <CardTitle className="capitalize text-xl">{item.section} Section</CardTitle>
        <CardDescription>ID: {item.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        {Object.keys(formData).map(key => (
          <DynamicField 
            key={key} 
            fieldKey={key} 
            value={formData[key]} 
            onChange={(newVal) => setFormData({ ...formData, [key]: newVal })} 
          />
        ))}

      </CardContent>
      <div className="p-6 pt-0">
        <Button 
          onClick={() => onSave(item.id, formData)} 
          disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 py-6 text-lg rounded-xl"
        >
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
