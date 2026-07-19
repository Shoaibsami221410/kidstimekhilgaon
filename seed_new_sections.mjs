import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key to bypass RLS for inserts

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const newSections = [
  {
    id: 'home_about',
    page: 'home',
    section: 'about',
    content: {
      subtitle: 'Our Story',
      title: 'About Kids Time',
      description: 'Kids Time, launched in 2017 by Light of Hope Ltd., aims to boost children\'s creativity and prepare them as future leaders through engaging courses. We offer an after-school program that includes Crafting, Drawing, Spoken English, and Singapore Math. Additionally, we have a pre-school program titled Kids Time Montessori School. With over 4000 graduates, Kids Time focuses on nurturing young minds and fostering their creativity and leadership skills.',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop'
    }
  },
  {
    id: 'home_services_montessori',
    page: 'home',
    section: 'services_montessori',
    content: {
      subtitle: 'Our Services',
      title: 'Kids Time Montessori Pre-School',
      description: 'At Kids Time, we believe in nurturing young minds and fostering creativity and leadership among children. Kids Time is pioneering the Montessori method in Bangladesh\'s pre-school with its first campus in Dhanmondi. Our Montessori-inspired curriculum is designed to spark curiosity, ignite creativity, and empower children to become confident, independent learners.',
      btn1_text: 'Learn More',
      btn1_link: '/montessori',
      btn2_text: 'WhatsApp',
      btn2_link: 'https://wa.me/123456789',
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop'
    }
  },
  {
    id: 'home_services_afterschool',
    page: 'home',
    section: 'services_afterschool',
    content: {
      subtitle: 'Our Services',
      title: 'Kids Time After-School Program',
      description: 'We offer amazing courses in our after-school program, including Crafting, Drawing, Singapore Math, and Spoken English. Your child can join these courses online from anywhere in the country or abroad, right from home. Additionally, these courses are available at our Dhanmondi and Khilgaon centers.',
      items: [
        {
          title: 'Drawing Course',
          desc: 'Best Drawing Course for 5-12 Years Old Childrens',
          image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop'
        },
        {
          title: 'Singapore Math Course',
          desc: 'World\'s Best Math Course for 5-8 Years Old Bangladesh Childrens',
          image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop'
        },
        {
          title: 'Spoken English Course',
          desc: 'International Spoken English Course for 5-8 Years Old Childrens',
          image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      explore_btn_text: 'Explore Courses',
      explore_btn_link: '/programs'
    }
  },
  {
    id: 'home_community',
    page: 'home',
    section: 'community',
    content: {
      title: 'Kids Time Parent Community',
      description: 'Parents are regularly sharing their thoughts, child\'s activity, their creative task etc. in the Facebook community group.',
      btn_text: 'Explore',
      btn_link: 'https://facebook.com/groups/kidstime',
      testimonial: {
        text: 'Kids Time কে অনেক ধন্যবাদ অনলাইন ক্লাসের এই উদ্যোগের জন্য। ক্লাসগুলো করার পর থেকে ফারহানের ইলেক্ট্রিক ডিভাইসের প্রতি আগ্রহ একদমই নেই! ফারহান এখন প্রতি সপ্তাহে অপেক্ষা করে Kids Time এর ক্লাসগুলোর জন্য!',
        author: 'Kazi Iffat Ara',
        role: 'Parent',
        avatar_url: 'https://ui-avatars.com/api/?name=Kazi+Iffat+Ara&background=random'
      }
    }
  },
  {
    id: 'global_footer',
    page: 'global',
    section: 'footer',
    content: {
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
  }
]

async function seed() {
  for (const section of newSections) {
    const { data, error } = await supabase
      .from('page_content')
      .upsert(section, { onConflict: 'id' })
    
    if (error) {
      console.error(`Error inserting ${section.id}:`, error)
    } else {
      console.log(`Successfully inserted/updated ${section.id}`)
    }
  }
}

seed()
