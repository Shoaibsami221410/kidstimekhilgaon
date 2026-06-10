"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, ClipboardCheck, Calendar, GraduationCap, FileText, MessageSquare, Banknote, CreditCard, Image as ImageIcon } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/admissions", icon: ClipboardCheck, label: "Admissions" },
    { href: "/dashboard/attendance", icon: Calendar, label: "Attendance" },
    { href: "/dashboard/assignments", icon: FileText, label: "Assignments" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { href: "/dashboard/fees", icon: Banknote, label: "Fee Management" },
    { href: "/dashboard/users", icon: Users, label: "User Management" },
    { href: "/dashboard/courses", icon: BookOpen, label: "LMS Courses" },
    { href: "/dashboard/classes", icon: GraduationCap, label: "Live Classes" },
    { href: "/dashboard/events", icon: Calendar, label: "Events" },
    { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/dashboard/finance", icon: CreditCard, label: "Finance" },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="text-xl font-bold text-white">
          Kids Time <span className="text-orange-500">Admin</span>
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
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
