/**
 * Global Footer Component
 * Renders the main site footer including social links (Facebook, Instagram, Youtube),
 * branch locations, and company information.
 */
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MapPin } from "lucide-react"
import { FacebookIcon, InstagramIcon, getPlatformIcon } from "@/components/social-icons"

export async function Footer() {
  const supabase = await createClient()
  const { data: footerRaw } = await supabase.from("page_content").select("content").eq("id", "global_footer").single()
  
  const footerData = footerRaw?.content || {
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
    ],
    social_links: []
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
            <div className="flex flex-col gap-2">
              <img src="/logo.png" alt="Kids Time Logo" className="h-16 w-auto object-contain object-left" />
              <p className="text-sky-500 text-xs">A brand of Light of Hope Ltd.</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerData.about_text}
            </p>
            <div className="flex gap-4 flex-wrap">
              {footerData.social_links?.map((link: any, i: number) => (
                <Link key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer" title={link.platform} className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                  {getPlatformIcon(link.platform, "w-5 h-5")}
                </Link>
              ))}
              {/* Fallback if no links in DB */}
              {(!footerData.social_links || footerData.social_links.length === 0) && (
                <>
                  <Link href="https://facebook.com/kidstime" target="_blank" className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                    <FacebookIcon className="w-5 h-5" />
                  </Link>
                  <Link href="https://instagram.com/kidstime" target="_blank" className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                    <InstagramIcon className="w-5 h-5" />
                  </Link>
                </>
              )}
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
