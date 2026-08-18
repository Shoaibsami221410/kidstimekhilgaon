"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Plus, Trash2, Link as LinkIcon } from "lucide-react"

export default function SocialLinksPage() {
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('page_content').select('*').eq('id', 'global_footer').single()
      if (data && data.content && data.content.social_links) {
        setLinks(data.content.social_links)
      } else {
        // Fallback default
        setLinks([
          { platform: "Facebook", url: "https://facebook.com/kidstime" },
          { platform: "Instagram", url: "https://instagram.com/kidstime" }
        ])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data } = await supabase.from('page_content').select('content').eq('id', 'global_footer').single()
    const existingContent = data?.content || {}
    
    const { error } = await supabase.from('page_content').update({ 
      content: { ...existingContent, social_links: links } 
    }).eq('id', 'global_footer')
    
    setSaving(false)
    if (!error) {
      alert('Social Links saved successfully!')
    } else {
      alert('Error saving data.')
    }
  }

  const addLink = () => {
    setLinks([...links, { platform: "", url: "" }])
  }

  const updateLink = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const removeLink = (index: number) => {
    const newLinks = [...links]
    newLinks.splice(index, 1)
    setLinks(newLinks)
  }

  if (loading) return <div className="p-8 text-slate-500">Loading social links...</div>

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Social Media Links</h1>
          <p className="text-slate-500 mt-2">Manage the social media icons and community links displayed on the website footer.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          {links.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
              No social links added yet. Click "Add New Link" to start.
            </div>
          )}
          
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100 relative group">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Platform Name (e.g. Facebook, X, Telegram)</label>
                <Input 
                  value={link.platform}
                  onChange={(e) => updateLink(idx, "platform", e.target.value)}
                  placeholder="Platform Name"
                  className="bg-white"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                <div className="flex relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <Input 
                    value={link.url}
                    onChange={(e) => updateLink(idx, "url", e.target.value)}
                    placeholder="https://..."
                    className="pl-10 bg-white"
                  />
                </div>
              </div>
              <Button onClick={() => removeLink(idx)} variant="destructive" size="icon" className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button onClick={addLink} variant="outline" className="w-full border-dashed border-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 py-8 text-slate-600 mt-4">
            <Plus className="w-5 h-5" />
            Add New Social Link
          </Button>
        </div>
      </div>
    </div>
  )
}
