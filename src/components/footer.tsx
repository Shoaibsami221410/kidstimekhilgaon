/**
 * Global Footer Component
 * Renders the main site footer including social links (Facebook, Instagram, Youtube),
 * branch locations, and company information.
 */
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MapPin } from "lucide-react"

// Social Icons as SVGs
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
)
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
)
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
)
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
)
const MessengerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
)
const DefaultIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.svg.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
)

const getPlatformIcon = (name: string, className?: string) => {
  const n = name.toLowerCase()
  if (n.includes('facebook')) return <FacebookIcon className={className} />
  if (n.includes('instagram')) return <InstagramIcon className={className} />
  if (n.includes('youtube')) return <YoutubeIcon className={className} />
  if (n.includes('twitter') || n.includes('x')) return <TwitterIcon className={className} />
  if (n.includes('telegram')) return <TelegramIcon className={className} />
  if (n.includes('messenger')) return <MessengerIcon className={className} />
  if (n.includes('whatsapp')) return <WhatsAppIcon className={className} />
  return <DefaultIcon className={className} />
}

export async function Footer() {
  const supabase = await createClient()
  const [ { data: footerRaw }, { data: socialRaw } ] = await Promise.all([
    supabase.from("page_content").select("content").eq("id", "global_footer").single(),
    supabase.from("page_content").select("content").eq("id", "social_links").single()
  ])
  
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
            <div className="flex flex-col gap-2">
              <img src="/logo.png" alt="Kids Time Logo" className="h-16 w-auto object-contain object-left" />
              <p className="text-sky-500 text-xs">A brand of Light of Hope Ltd.</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerData.about_text}
            </p>
            <div className="flex gap-4 flex-wrap">
              {socialRaw?.content?.links?.map((link: any, i: number) => (
                <Link key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer" title={link.platform} className="w-10 h-10 bg-slate-700 hover:bg-red-600 transition-colors flex items-center justify-center rounded text-white">
                  {getPlatformIcon(link.platform, "w-5 h-5")}
                </Link>
              ))}
              {/* Fallback if no links in DB */}
              {(!socialRaw?.content?.links || socialRaw.content.links.length === 0) && (
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
