import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default async function TestimonialsPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect("/login")
  }

  // Fetch existing testimonials from page_content
  const { data, error } = await supabase
    .from("page_content")
    .select("content")
    .eq("id", "testimonials")
    .single()

  let items: any[] = data?.content?.items || []

  // If no testimonials exist in DB, insert some defaults
  if (!data) {
    items = [
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
    
    // Auto-seed
    await supabase.from("page_content").upsert({
      id: "testimonials",
      page: "home",
      section: "community",
      content: { items }
    })
  }

  // Define the form action for updating testimonials
  async function updateTestimonials(formData: FormData) {
    "use server"
    const supabase = await createClient()

    // Parse the form data arrays
    const ids = formData.getAll('id') as string[]
    const authors = formData.getAll('author') as string[]
    const roles = formData.getAll('role') as string[]
    const texts = formData.getAll('text') as string[]
    const avatar_urls = formData.getAll('avatar_url') as string[]

    const newItems = ids.map((id, index) => ({
      id,
      author: authors[index],
      role: roles[index],
      text: texts[index],
      avatar_url: avatar_urls[index] || `https://ui-avatars.com/api/?name=${encodeURIComponent(authors[index])}&background=random`
    }))

    // Handle new testimonial addition (if author field is filled in the "Add New" row)
    const newAuthor = formData.get('new_author') as string
    if (newAuthor && newAuthor.trim() !== '') {
      newItems.push({
        id: `t${Date.now()}`,
        author: newAuthor,
        role: (formData.get('new_role') as string) || 'Parent',
        text: (formData.get('new_text') as string) || '',
        avatar_url: (formData.get('new_avatar_url') as string) || `https://ui-avatars.com/api/?name=${encodeURIComponent(newAuthor)}&background=random`
      })
    }

    await supabase.from('page_content').upsert({
      id: 'testimonials',
      page: 'home',
      section: 'community',
      content: { items: newItems }
    })

    redirect('/dashboard/testimonials') // Reload to reflect changes
  }

  async function deleteTestimonial(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const idToDelete = formData.get('delete_id') as string
    
    const { data } = await supabase.from("page_content").select("content").eq("id", "testimonials").single()
    const currentItems = data?.content?.items || []
    
    const newItems = currentItems.filter((item: any) => item.id !== idToDelete)

    await supabase.from('page_content').upsert({
      id: 'testimonials',
      page: 'home',
      section: 'community',
      content: { items: newItems }
    })
    
    redirect('/dashboard/testimonials')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Parent Testimonials</h1>
        <p className="text-slate-500 mt-2">Manage the parent comments that appear in the "Why Kids Time?" section on the Home Page.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Existing Comments</CardTitle>
            <CardDescription>Edit or remove comments currently displayed on the website.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateTestimonials} className="space-y-8">
              {items.map((item, index) => (
                <div key={item.id} className="relative p-6 border rounded-xl bg-slate-50/50 space-y-4">
                  <div className="absolute top-4 right-4">
                    <button formAction={deleteTestimonial} name="delete_id" value={item.id} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                  <input type="hidden" name="id" value={item.id} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Author Name</label>
                      <Input name="author" defaultValue={item.author} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Role</label>
                      <Input name="role" defaultValue={item.role} required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Comment</label>
                    <Textarea name="text" defaultValue={item.text} className="h-24" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Avatar Image URL (Optional)</label>
                    <Input name="avatar_url" defaultValue={item.avatar_url} />
                  </div>
                </div>
              ))}

              <div className="pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Add a New Comment</h3>
                <div className="p-6 border border-dashed rounded-xl space-y-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Author Name</label>
                      <Input name="new_author" placeholder="e.g. Kazi Iffat Ara" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Role</label>
                      <Input name="new_role" placeholder="e.g. Parent" defaultValue="Parent" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Comment</label>
                    <Textarea name="new_text" placeholder="Write the comment here..." className="h-24" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Avatar Image URL (Optional)</label>
                    <Input name="new_avatar_url" placeholder="Leave empty for auto-generated avatar" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg rounded-xl">
                Save All Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
