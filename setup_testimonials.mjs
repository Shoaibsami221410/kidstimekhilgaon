import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTestimonials() {
  console.log("Seeding testimonials into page_content...")
  
  const initialTestimonials = [
    {
      id: "t1",
      author: 'Kazi Iffat Ara',
      role: 'Parent',
      text: 'Kids Time কে অনেক ধন্যবাদ অনলাইন ক্লাসের এই উদ্যোগের জন্য। ক্লাসগুলো করার পর থেকে ফারহানের ইলেক্ট্রিক ডিভাইসের প্রতি আগ্রহ একদমই নেই! ফারহান এখন প্রতি সপ্তাহে অপেক্ষা করে Kids Time এর ক্লাসগুলোর জন্য!',
      avatar_url: 'https://ui-avatars.com/api/?name=Kazi+Iffat+Ara&background=random'
    },
    {
      id: "t2",
      author: 'Farhana Rahman',
      role: 'Parent',
      text: 'খুব চমৎকার একটা উদ্যোগ। আমার মেয়ে ড্রয়িং ক্লাসে অনেক মজা করে। টিচাররা খুব যত্ন সহকারে শেখান।',
      avatar_url: 'https://ui-avatars.com/api/?name=Farhana+Rahman&background=random'
    },
    {
      id: "t3",
      author: 'Rafiqul Islam',
      role: 'Parent',
      text: 'My son loves the Singapore Math course. The way they teach makes it very easy to understand complex problems. Highly recommended!',
      avatar_url: 'https://ui-avatars.com/api/?name=Rafiqul+Islam&background=random'
    }
  ]

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
