"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, ClipboardCheck, MessageSquare, Banknote, LogOut, CalendarCheck } from "lucide-react"

export function ParentSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/parent", icon: LayoutDashboard, label: "Overview" },
    { href: "/parent/attendance", icon: CalendarCheck, label: "Attendance Tracker" },
    { href: "/parent/assignments", icon: BookOpen, label: "Assignments" },
    { href: "/parent/admissions", icon: ClipboardCheck, label: "Admissions Status" },
    { href: "/parent/fees", icon: Banknote, label: "Fees & Invoices" },
    { href: "/parent/messages", icon: MessageSquare, label: "Messages" },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="text-xl font-bold text-white">
          Kids Time <span className="text-blue-500">Parent</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/parent" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-blue-500/10 text-blue-500 font-medium" 
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
