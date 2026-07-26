"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as LucideIcons from "lucide-react"
import { Loader2, Save, Trash2, PlusCircle, UploadCloud } from "lucide-react"
import ColorPicker from 'react-best-gradient-color-picker'

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const supabase = createClient()

  const requiredSections = [
    {
      id: 'home_hero',
      page: 'home',
      section: 'hero',
      content: {
        title_black: "Nurturing Brilliant Minds for a",
        title_gradient: "Brighter Future",
        description: "Kids Time Khilgaon offers a world-class early childhood education with a holistic approach to learning, creativity, and personal development.",
        badge: "Admissions Open for 2026!",
        button_text: "Watch Demo Classes",
        button_link: "/programs",
        image_url: ""
      }
    },
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
    },
    {
      id: 'about_hero',
      page: 'about',
      section: 'hero',
      content: {
        title: "Nurturing Creativity in Every Child",
        description: "At Kids Time Khilgaon, we believe every child is an artist, a storyteller, and an innovator waiting to be discovered.",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
      }
    },
    {
      id: 'about_mission_vision',
      page: 'about',
      section: 'mission_vision',
      content: {
        mission_title: "Our Mission",
        mission_desc: "To provide a safe, engaging, and highly creative environment where children can explore their imaginations. We focus on developing core skills through art, craft, and storytelling, building confidence that lasts a lifetime.",
        vision_title: "Our Vision",
        vision_desc: "To be the leading creative development center in Bangladesh, where every child's unique talent is recognized, nurtured, and celebrated.",
        image_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
      }
    },
    {
      id: 'about_features',
      page: 'about',
      section: 'features',
      content: {
        title: "Why Kids Time Khilgaon?",
        description: "We offer a unique blend of creative learning methodologies tailored for early childhood development.",
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
      id: 'facilities_hero',
      page: 'facilities',
      section: 'hero',
      content: {
        title: "Our Campus & Facilities",
        description: "Explore the safe, inspiring, and fully-equipped spaces where your child's creativity comes to life.",
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
      id: 'contact_hero',
      page: 'contact',
      section: 'hero',
      content: {
        title: "Get in Touch",
        description: "Have questions about our programs, admissions, or anything else? We'd love to hear from you."
      }
    },
    {
      id: 'contact_info',
      page: 'contact',
      section: 'info',
      content: {
        title: "Contact Information",
        description: "Our friendly team is always here to help. Reach out to us through any of the following methods or drop by our center.",
        address: "Block C, Road 12, House 45\nKhilgaon, Dhaka 1219\nBangladesh",
        phone: "Franchisee Owner - Jiaul Haque\n+880 1685-729549\n\nCoordinator - Junaida Islam\n+880 1625-626227",
        hours: "Friday - Saturday: 9:00 AM - 6:00 PM"
      }
    },
    {
      id: 'programs_hero',
      page: 'programs',
      section: 'hero',
      content: {
        title_cyan: "Live",
        title_red: "Online Course For Kids",
        subtitle: "Creativity has no bound! Unleash your child's creativity with the ultimate online course for kids from anywhere.",
        description: "We are offering the Best Online Drawing Courses, Crafting Classes, Spoken English For Kids & Singapore Math Online. Your child now can join these courses through online from anywhere in the country or abroad while sitting at home."
      }
    },
    {
      id: 'gallery_hero',
      page: 'gallery',
      section: 'hero',
      content: {
        title: "Moments of Joy",
        description: "Take a look at the beautiful moments captured inside our classrooms and events."
      }
    },
    {
      id: 'events_hero',
      page: 'events',
      section: 'hero',
      content: {
        title: "Upcoming Events",
        description: "Join us for exciting activities, workshops, and celebrations at Kids Time Khilgaon."
      }
    },
    {
      id: 'teachers_hero',
      page: 'teachers',
      section: 'hero',
      content: {
        title: "Our Expert Teachers",
        description: "Meet the passionate educators dedicated to nurturing your child's creativity."
      }
    },
    {
      id: 'admissions_hero',
      page: 'admissions',
      section: 'hero',
      content: {
        title: "Admissions Application",
        description: "Please complete the application form below. Our admissions team will review your application and contact you shortly."
      }
    },
    {
      id: 'demo_hero',
      page: 'demo',
      section: 'hero',
      content: {
        title: "Experience Our Classes",
        description: "Register below to get instant access to our premium demo library, featuring recorded classes, storytelling, and fun activities."
      }
    }
  ]

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const { data, error } = await supabase.from("page_content").select("*")
    if (!error && data) {
      setContent(data)
    }
    setLoading(false)
  }

  const handleSave = async (id: string, newContent: string) => {
    setSaving(true)
    try {
      const parsedContent = JSON.parse(newContent)
      const sectionToSave = requiredSections.find(s => s.id === id)
      if (!sectionToSave) throw new Error("Section not found")
      
      const { error } = await supabase
        .from("page_content")
        .upsert({ 
          id, 
          page: sectionToSave.page,
          section: sectionToSave.section,
          content: parsedContent 
        }, { onConflict: 'id' })

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

  // Map over requiredSections so EVERYTHING shows up, even if not seeded in DB yet
  const getSections = (page: string) => requiredSections.filter(s => s.page === page).map(s => {
    const dbItem = content.find(c => c.id === s.id)
    return {
      ...s,
      content: dbItem ? dbItem.content : null // Use null so DynamicFormEditorCard relies on defaultContent
    }
  })

  const tabs = [
    { id: 'home', label: 'Home Page', icon: 'Home' },
    { id: 'about', label: 'About Page', icon: 'Info' },
    { id: 'facilities', label: 'Facilities', icon: 'Building' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
    { id: 'programs', label: 'Programs', icon: 'GraduationCap' },
    { id: 'gallery', label: 'Gallery', icon: 'Image' },
    { id: 'events', label: 'Events', icon: 'Calendar' },
    { id: 'teachers', label: 'Teachers', icon: 'Users' },
    { id: 'admissions', label: 'Admissions', icon: 'FileText' },
    { id: 'demo', label: 'Demo Classes', icon: 'PlayCircle' },
    { id: 'global', label: 'Global Settings', icon: 'Settings' }
  ]

  const activeSections = getSections(activeTab)

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website Content</h1>
        <p className="text-slate-500 mt-2">Manage the text and content of your public pages.</p>
      </div>

      <div className="flex flex-1 flex-col md:flex-row gap-8 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 space-y-1">
          {tabs.map(tab => {
            const Icon = (LucideIcons as any)[tab.icon] || LucideIcons.FileText
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            
            {activeSections.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {activeSections.map((item) => (
                  <DynamicFormEditorCard 
                    key={item.id} 
                    item={item} 
                    defaultContent={requiredSections.find(s => s.id === item.id)?.content} 
                    onSave={handleSave} 
                    saving={saving} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <LucideIcons.LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No sections defined for this page yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DynamicFormEditorCard({ item, defaultContent, onSave, saving }: { item: any, defaultContent?: any, onSave: any, saving: boolean }) {
  const initial = typeof item.content === 'object' && item.content !== null ? item.content : {}
  const def = typeof defaultContent === 'object' && defaultContent !== null ? defaultContent : {}
  
  // Scrub garbage keys from the database that aren't in our schema
  const scrubbedInitial = { ...initial }
  Object.keys(scrubbedInitial).forEach(key => {
    if (!(key in def)) {
      delete scrubbedInitial[key]
    }
  })

  const [contentState, setContentState] = useState<any>({ ...def, ...scrubbedInitial })

  const handleSaveClick = () => {
    onSave(item.id, JSON.stringify(contentState, null, 2))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{item.section} Section</CardTitle>
        <CardDescription>ID: {item.id}</CardDescription>
        {item.id === 'home_hero' && (
          <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <strong>Tip for Hero Image:</strong> To add an image, include <code>image_url</code>. Recommended size is <strong>800x600 pixels (4:3 ratio)</strong> for the best display.
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <DynamicFormNode data={contentState} onChange={setContentState} />
        
        <Button 
          onClick={handleSaveClick} 
          disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 mt-6"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}

function ColorPickerField({ keyName, value, onChange }: { keyName: string, value: string, onChange: (val: string) => void }) {
  const [showPicker, setShowPicker] = useState(false)
  const defaultColor = value || 'rgba(255, 255, 255, 1)'
  return (
    <div className="space-y-2 relative">
      <Label className="capitalize font-semibold text-slate-700">{keyName.replace(/_/g, ' ')}</Label>
      <div className="flex gap-2 items-center">
        <div 
          className="w-10 h-10 rounded-lg border shadow-sm cursor-pointer" 
          style={{ background: defaultColor }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <Input 
          className="focus:ring-orange-500 rounded-lg flex-1"
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="e.g. #ff0000 or linear-gradient(...)"
        />
      </div>
      {showPicker && (
        <div className="absolute top-full left-0 z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border w-[320px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-700">Choose Color</span>
            <Button size="sm" variant="ghost" onClick={() => setShowPicker(false)}>Close</Button>
          </div>
          <ColorPicker value={defaultColor} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

function IconPickerField({ keyName, value, onChange }: { keyName: string, value: string, onChange: (val: string) => void }) {
  const [showPicker, setShowPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const iconNames = Object.keys(LucideIcons).filter(k => k !== 'createLucideIcon' && k !== 'default' && k !== 'lucideReact')
  const filteredIcons = iconNames.filter(k => k.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50)
  
  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle

  return (
    <div className="space-y-2 relative">
      <Label className="capitalize font-semibold text-slate-700">{keyName.replace(/_/g, ' ')}</Label>
      <div className="flex gap-2 items-center">
        <div 
          className="w-10 h-10 rounded-lg border shadow-sm cursor-pointer flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700" 
          onClick={() => setShowPicker(!showPicker)}
        >
          <CurrentIcon className="w-5 h-5" />
        </div>
        <Input 
          className="focus:ring-orange-500 rounded-lg flex-1"
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="e.g. ShieldCheck"
        />
      </div>
      {showPicker && (
        <div className="absolute top-full left-0 z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border w-[320px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-700">Choose Icon</span>
            <Button size="sm" variant="ghost" onClick={() => setShowPicker(false)}>Close</Button>
          </div>
          <Input 
            autoFocus
            className="mb-3"
            placeholder="Search icons..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-1">
            {filteredIcons.map(iconName => {
              const Icon = (LucideIcons as any)[iconName]
              return (
                <div 
                  key={iconName} 
                  className="p-2 border rounded hover:bg-slate-100 cursor-pointer flex items-center justify-center text-slate-600"
                  onClick={() => {
                    onChange(iconName)
                    setShowPicker(false)
                  }}
                  title={iconName}
                >
                  <Icon className="w-5 h-5" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ImagePickerField({ keyName, value, onChange }: { keyName: string, value: string, onChange: (val: string) => void }) {
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('upload')
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
    <div className="space-y-3">
      <Label className="capitalize font-semibold text-slate-700">{keyName.replace(/_/g, ' ')}</Label>
      
      {value && (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Upload Image
        </button>
        <button 
          onClick={() => setActiveTab('link')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Enter Link
        </button>
      </div>

      {activeTab === 'link' ? (
        <Input 
          className="focus:ring-orange-500 rounded-lg"
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="https://..."
        />
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            className="hidden" 
            id={`file-upload-${keyName}`} 
          />
          <Label htmlFor={`file-upload-${keyName}`} className="cursor-pointer flex flex-col items-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <span className="text-sm font-medium text-slate-700">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </span>
            <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
          </Label>
        </div>
      )}
    </div>
  )
}

function DynamicFormNode({ data, onChange }: { data: any, onChange: (newData: any) => void }) {
  if (typeof data !== 'object' || data === null) return null;

  return (
    <div className="space-y-5 w-full">
      {Object.entries(data).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="space-y-4 border rounded-xl p-4 bg-slate-100/50">
              <h3 className="font-bold text-lg capitalize text-slate-700">{key.replace(/_/g, ' ')}</h3>
              {value.map((arrItem, idx) => (
                <div key={idx} className="p-5 border rounded-xl bg-white space-y-4 relative group shadow-sm transition-all hover:shadow-md">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    onClick={() => {
                      const newArr = [...value]
                      newArr.splice(idx, 1)
                      onChange({ ...data, [key]: newArr })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <DynamicFormNode 
                    data={arrItem} 
                    onChange={(newItemData) => {
                      const newArr = [...value]
                      newArr[idx] = newItemData
                      onChange({ ...data, [key]: newArr })
                    }} 
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed bg-white text-slate-600 hover:text-slate-900" onClick={() => {
                const newArr = [...value]
                const template = newArr.length > 0 ? Object.keys(newArr[0]).reduce((acc:any, k) => { acc[k] = typeof newArr[0][k] === 'string' ? "" : null; return acc }, {}) : {}
                newArr.push(template)
                onChange({ ...data, [key]: newArr })
              }}>
                <PlusCircle className="w-4 h-4 mr-2" /> Add New {key.replace(/s$/, '')}
              </Button>
            </div>
          )
        } else if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="space-y-4 border rounded-xl p-4 bg-slate-50">
              <h3 className="font-semibold text-lg capitalize text-slate-800">{key.replace(/_/g, ' ')}</h3>
              <DynamicFormNode 
                data={value} 
                onChange={(newObj) => onChange({ ...data, [key]: newObj })} 
              />
            </div>
          )
        } else {
          // String, number, boolean
          const isColor = key.toLowerCase().includes('color');
          const isIcon = key.toLowerCase() === 'icon';
          const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('thumbnail');
          const isLongText = key.includes('desc') || key.includes('text') || (typeof value === 'string' && value.length > 100);
          
          if (isColor) {
            return (
              <ColorPickerField 
                key={key} 
                keyName={key} 
                value={value as string} 
                onChange={(newColor) => onChange({ ...data, [key]: newColor })} 
              />
            )
          }

          if (isIcon) {
            return (
              <IconPickerField 
                key={key} 
                keyName={key} 
                value={value as string} 
                onChange={(newIcon) => onChange({ ...data, [key]: newIcon })} 
              />
            )
          }

          if (isImage) {
            return (
              <ImagePickerField 
                key={key} 
                keyName={key} 
                value={value as string} 
                onChange={(newImage) => onChange({ ...data, [key]: newImage })} 
              />
            )
          }

          return (
            <div key={key} className="space-y-2">
              <Label className="capitalize font-semibold text-slate-700">{key.replace(/_/g, ' ')}</Label>
              {isLongText ? (
                <textarea 
                  className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]" 
                  rows={4}
                  value={value as string} 
                  onChange={(e) => onChange({ ...data, [key]: e.target.value })} 
                />
              ) : (
                <Input 
                  className="focus:ring-orange-500 rounded-lg"
                  value={value as string} 
                  onChange={(e) => onChange({ ...data, [key]: e.target.value })} 
                />
              )}
            </div>
          )
        }
      })}
    </div>
  )
}

