import { HomeClient } from "@/components/home-client"
import { createClient } from "@/lib/supabase/server"

// Revalidate every hour, or you can leave it out for dynamic rendering
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch home page content
  const { data: content, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page", "home")

  // Fetch real courses from the DB
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .limit(3) // Fetch top 3 courses for the home page

  return <HomeClient content={content || []} courses={courses || []} />
}
