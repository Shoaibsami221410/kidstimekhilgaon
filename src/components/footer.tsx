import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-200 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kids Time <span className="text-orange-500">Khilgaon</span></h3>
            <p className="text-sm text-slate-400">
              Nurturing young minds with creativity, care, and quality education in a safe environment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-orange-400">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-orange-400">Programs</Link></li>
              <li><Link href="/admissions" className="hover:text-orange-400">Admissions</Link></li>
              <li><Link href="/demo-classes" className="hover:text-orange-400">Demo Classes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-orange-400">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-orange-400">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-400">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="not-italic text-sm text-slate-400 space-y-2">
              <p>123 Preschool Ave,</p>
              <p>Khilgaon, Dhaka</p>
              <p>Email: info@kidstimekhilgaon.com</p>
              <p>Phone: +880 1234 567890</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Kids Time Khilgaon. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
