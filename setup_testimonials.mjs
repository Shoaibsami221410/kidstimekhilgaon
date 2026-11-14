import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTestimonials() {
  console.log("Seeding testimonials into page_content...")
  
  const initialTestimonials = []

  const { error } = await supabase.from('page_content').upsert({
    id: 'testimonials',
    page: 'home',
    section: 'community',
    content: { items: initialTestimonials }
  })

  if (error) {
    console.error("Error seeding testimonials:", error)
  } else {
    console.log("Successfully seeded testimonials!")
  }
}

setupTestimonials()
