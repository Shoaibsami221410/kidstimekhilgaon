import { HomeClient } from "@/components/home-client"
import { createClient } from "@/lib/supabase/server"

// Revalidate every hour, or you can leave it out for dynamic rendering
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch all data in parallel
  const [
    { data: content, error },
    { data: courses },
    { data: testimonialsData }
  ] = await Promise.all([
    supabase.from("page_content").select("*").eq("page", "home"),
    supabase.from("courses").select("*").order('created_at', { ascending: false }),
    supabase.from("page_content").select("content").eq("id", "testimonials").single()
  ])

  const testimonials = testimonialsData?.content?.items || []

  return <HomeClient content={content || []} courses={courses || []} testimonials={testimonials} />
}
