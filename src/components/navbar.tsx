"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu, User as UserIcon, Search, Bell, LogOut, ChevronDown, LayoutDashboard } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"

/**
 * Navigation Bar Component
 * Includes public links, user dashboard dropdown, and mobile-responsive Trial Class call-to-action
 */
export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Auth error:", error)
          setUser(null)
          setUserData(null)
          return
        }

        if (data?.user) {
          setUser(data.user)
          // Fetch role from DB
          const { data: dbUser } = await supabase
            .from('users')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single()
          
          const userRole = dbUser?.role || data.user.user_metadata?.role || 'parent'
          const fullName = dbUser?.full_name || data.user.user_metadata?.full_name || 'User'
          
          // FIX: If JWT metadata is out of sync with DB, update it!
          // This ensures middleware (which relies on JWT) always has the correct role
          if (dbUser && dbUser.role && data.user.user_metadata?.role !== dbUser.role) {
            await supabase.auth.updateUser({
              data: { role: dbUser.role }
            })
          }
          
          setUserData({ full_name: fullName, role: userRole })
        } else {
          setUser(null)
          setUserData(null)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setUser(null)
        setUserData(null)
      }
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUser()
      } else {
        setUser(null)
        setUserData(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsMobileMenuOpen(false)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/facilities", label: "Facilities" },
    { href: "/teachers", label: "Teachers" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ]

  const parentLinks = [
    { href: "/parent", label: "Dashboard Overview" },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/trial-classes", label: "Trial Classes" },
    { href: "/dashboard/users", label: "User Management" },
    { href: "/dashboard/courses", label: "LMS Courses" },
    { href: "/dashboard/events", label: "Events" },
    { href: "/dashboard/gallery", label: "Gallery" },
    { href: "/dashboard/content", label: "Website Content" },
    { href: "/dashboard/testimonials", label: "Testimonials" },
  ]

  const activeRole = userData?.role || user?.user_metadata?.role || 'parent'
  const isAdmin = activeRole === 'admin' || activeRole === 'super_admin'
  const dashboardPath = isAdmin ? '/dashboard' : '/parent'
  const dashboardLinks = isAdmin ? adminLinks : parentLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Kids Time Logo" className="h-12 md:h-14 w-auto object-contain" />
        </Link>
        
        <nav className="hidden xl:flex gap-8">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-bold transition-colors hover:text-red-500 ${
                pathname === link.href ? "text-red-600" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4">


          {user ? (
            <>


              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 sm:border-l sm:pl-4 sm:ml-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="text-sm max-w-[150px] truncate flex items-center gap-1">
                    <p className="font-medium text-slate-900 leading-none truncate">Welcome, {userData?.full_name}</p>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden py-1 z-50">
                    <Link 
                      href={dashboardPath}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/programs" className="hidden sm:block">
              <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold px-6 border-none shadow-md">
                Trial Class
              </Button>
            </Link>
          )}
          
          {/* Mobile Navigation */}
          <div className="xl:hidden flex items-center gap-2">
            <button 
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 text-slate-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto p-6">
                <SheetTitle className="text-left font-bold text-xl mb-6 pr-8">
                  <img src="/logo.png" alt="Kids Time Logo" className="h-10 w-auto" />
                </SheetTitle>
                
                {userData && (
                  <div className="mb-6 pb-6 border-b">
                    <p className="text-sm text-slate-500 mb-2">Welcome back,</p>
                    <p className="font-bold text-lg text-slate-900">{userData.full_name}</p>
                  </div>
                )}

                <nav className="flex flex-col gap-4">
                  {/* Dashboard Links for Mobile (Shown if logged in) */}
                  {userData && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Dashboard</h4>
                      <div className="flex flex-col gap-3">
                        {dashboardLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-base font-medium transition-colors hover:text-blue-600 ${
                              pathname === link.href ? "text-blue-600" : "text-slate-600"
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Menu</h4>
                    <div className="flex flex-col gap-3">
                      {publicLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`text-base font-medium transition-colors hover:text-primary ${
                            pathname === link.href ? "text-primary" : "text-slate-600"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-6 border-t pt-6">

                    
                    {user ? (
                      <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4">
                        <LogOut className="w-4 h-4 mr-2" /> Log out
                      </Button>
                    ) : (
                      <Link href="/programs" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50">
                          Trial Class
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
