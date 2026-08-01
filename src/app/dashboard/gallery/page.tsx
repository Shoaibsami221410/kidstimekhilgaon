"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Trash2, Plus, Loader2 } from "lucide-react"
import { ImagePicker } from "@/components/image-picker"

export default function GalleryAdminPage() {
  const supabase = createClient()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Activities")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    setLoading(true)
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) setImages(data)
    setLoading(false)
  }

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl) return alert("Image URL is required")
    
    setIsSaving(true)
    const { error } = await supabase.from('galleries').insert([{
      title,
      category,
      image_url: imageUrl
    }])
    
    setIsSaving(false)
    if (!error) {
      setTitle("")
      setImageUrl("")
      fetchImages()
    } else {
      alert("Error adding image: " + error.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return
    setDeletingId(id)
    const { error } = await supabase.from('galleries').delete().eq('id', id)
    if (!error) {
      fetchImages()
    } else {
      alert("Error deleting image: " + error.message)
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500" />
          Gallery Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm border-0 ring-1 ring-slate-200 h-fit">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" />
              Add New Image
            </CardTitle>
            <CardDescription>Upload a new image to the public gallery.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddImage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title / Caption</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Summer Camp 2024" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activities">Activities</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Classroom">Classroom</SelectItem>
                    <SelectItem value="Student Life">Student Life</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <ImagePicker 
                  label="Image"
                  value={imageUrl}
                  onChange={setImageUrl}
                />
              </div>
              
              <Button type="submit" disabled={isSaving || !imageUrl} className="w-full bg-orange-500 hover:bg-orange-600">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Add to Gallery"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Gallery Images</CardTitle>
              <CardDescription>Manage existing images</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : images.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No images found in the gallery.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map(img => (
                  <div key={img.id} className="group relative border rounded-xl overflow-hidden bg-slate-100 aspect-square">
                    <img src={img.image_url} alt={img.title || "Gallery"} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white font-medium mb-1 line-clamp-1">{img.title || "No Title"}</p>
                      <span className="text-xs text-orange-200 bg-orange-900/50 px-2 py-1 rounded-full mb-3">{img.category}</span>
                      
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                      >
                        {deletingId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
