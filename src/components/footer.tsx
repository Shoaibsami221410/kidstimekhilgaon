/**
 * Global Footer Component
 * Renders the main site footer including social links,
 * branch locations, and company information.
 */
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MapPin } from "lucide-react"

// Social Icons as SVGs since lucide-react doesn't include brand icons
const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const Youtube = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
)

export async function Footer() {
  const supabase = await createClient()
  const { data } = await supabase.from("page_content").select("content").eq("id", "global_footer").single()
  
  const footerData = data?.content || {
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

  return (
    <footer className="w-full bg-[#3f3f3f] text-slate-300">
      {/* Top Border Line (Red and Blue) */}
      <div className="flex h-2 w-full">
        <div className="w-1/2 bg-red-600 h-full"></div>
        <div className="w-1/2 bg-sky-500 h-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white font-bold p-2 rounded flex items-center justify-center w-12 h-12 text-xl leading-none">
                Kids<br/>Time
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Kids Time BD</h3>
                <p className="text-sky-500 text-xs">A brand of Light of Hope Ltd.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerData.about_text}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              {footerData.company_links?.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.link || "#"} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Our Branches</h4>
            <div className="space-y-8">
              {footerData.branches?.map((branch: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm mb-1">{branch.name}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                      {branch.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
