"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, ClipboardCheck, Calendar, GraduationCap, FileText, MessageSquare, Banknote, CreditCard, Image as ImageIcon, Link as LinkIcon, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [siteLogo, setSiteLogo] = useState<string>("/logo.png")

  useEffect(() => {
    async function loadLogo() {
      const supabase = createClient()
      const { data } = await supabase.from('page_content').select('content').eq('id', 'global_footer').single()
      if (data?.content?.site_logo) {
        setSiteLogo(data.content.site_logo)
      }
    }
    loadLogo()
  }, [])

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/trial-classes", icon: ClipboardCheck, label: "Trial Classes" },
    { href: "/dashboard/users", icon: Users, label: "User Management" },
    { href: "/dashboard/courses", icon: BookOpen, label: "LMS Courses" },
    { href: "/dashboard/teachers", icon: GraduationCap, label: "Teachers" },
    { href: "/dashboard/events", icon: Calendar, label: "Events" },
    { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/dashboard/content", icon: LayoutDashboard, label: "Website Content" },
    { href: "/dashboard/logo", icon: Sparkles, label: "Website Logo" },
    { href: "/dashboard/testimonials", icon: MessageSquare, label: "Testimonials" },
    { href: "/dashboard/social-links", icon: LinkIcon, label: "Social Links" },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex sticky top-16 h-[calc(100vh-64px)]">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center">
          <img src={siteLogo || "/logo.png"} alt="Kids Time Logo" className="h-10 w-auto bg-white rounded p-1 object-contain" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-orange-500/10 text-orange-500 font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <ul className="space-y-1">
          <li>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
