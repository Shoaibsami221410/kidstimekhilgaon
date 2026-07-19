"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const { data, error } = await supabase.from("page_content").select("*")
    if (!error && data) {
      setContent(data)
    }
    setLoading(false)
  }

  const handleSave = async (id: string, newContent: string) => {
    setSaving(true)
    try {
      const parsedContent = JSON.parse(newContent)
      const { error } = await supabase
        .from("page_content")
        .update({ content: parsedContent })
        .eq("id", id)

      if (error) throw error
      alert("Content saved successfully!")
    } catch (error: any) {
      alert("Error saving content. Make sure it is valid JSON. " + error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
  }

  const homeContent = content.filter(c => c.page === "home")
  const aboutContent = content.filter(c => c.page === "about")

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website Content</h1>
        <p className="text-slate-500 mt-2">Manage the text and content of your public pages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Page Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Home Page</h2>
          {homeContent.map((item) => (
            <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
          ))}
        </div>

        {/* About Page Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">About Page</h2>
          {aboutContent.map((item) => (
            <ContentEditorCard key={item.id} item={item} onSave={handleSave} saving={saving} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentEditorCard({ item, onSave, saving }: { item: any, onSave: any, saving: boolean }) {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(item.content, null, 2))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{item.section} Section</CardTitle>
        <CardDescription>ID: {item.id}</CardDescription>
        {item.id === 'home_hero' && (
          <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <strong>Tip for Hero Image:</strong> To add an image, include <code>"image_url": "https://..."</code> in the JSON. The recommended image size is <strong>800x600 pixels (4:3 ratio)</strong> for the best display.
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
        />
        <Button 
          onClick={() => onSave(item.id, jsonValue)} 
          disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
