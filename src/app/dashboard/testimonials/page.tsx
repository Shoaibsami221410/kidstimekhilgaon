"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Save, Plus, Loader2, MessageSquare } from "lucide-react"
import { clearSiteCache } from "@/app/actions"

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // New Testimonial Form State
  const [newAuthor, setNewAuthor] = useState("")
  const [newRole, setNewRole] = useState("Parent")
  const [newText, setNewText] = useState("")
  const [newAvatar, setNewAvatar] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    const { data } = await supabase
      .from("page_content")
      .select("content")
      .eq("id", "testimonials")
      .single()

    if (data?.content?.items) {
      setItems(data.content.items)
    } else {
      setItems([])
    }
    setLoading(false)
  }

  // Handle instant delete
  const handleDelete = async (idToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    setDeletingId(idToDelete)
    const updatedItems = items.filter((item) => item.id !== idToDelete)

    const { error } = await supabase
      .from("page_content")
      .update({
        content: { items: updatedItems },
      })
      .eq("id", "testimonials")

    if (error) {
      alert("Error deleting comment: " + error.message)
      setDeletingId(null)
      return
    }

    setItems(updatedItems)
    await clearSiteCache()
    setDeletingId(null)
  }

  // Handle editing fields
  const handleUpdateItem = (index: number, field: string, value: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  // Save all modifications
  const handleSaveAll = async () => {
    setSaving(true)
    const { error } = await supabase
      .from("page_content")
      .update({
        content: { items },
      })
      .eq("id", "testimonials")

    if (error) {
      alert("Error saving: " + error.message)
    } else {
      await clearSiteCache()
      alert("All changes saved successfully!")
    }
    setSaving(false)
  }

  // Add new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthor.trim()) {
      alert("Please enter the Author Name.")
      return
    }
    if (!newText.trim()) {
      alert("Please enter the Comment text.")
      return
    }

    const newItem = {
      id: `t${Date.now()}`,
      author: newAuthor.trim(),
      role: newRole.trim() || "Parent",
      text: newText.trim(),
      avatar_url:
        newAvatar.trim() ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(newAuthor.trim())}&background=random`,
    }

    const updated = [...items, newItem]
    setSaving(true)

    const { error } = await supabase
      .from("page_content")
      .update({
        content: { items: updated },
      })
      .eq("id", "testimonials")

    if (error) {
      alert("Error adding comment: " + error.message)
    } else {
      setItems(updated)
      setNewAuthor("")
      setNewRole("Parent")
      setNewText("")
      setNewAvatar("")
      await clearSiteCache()
      alert("New comment added successfully!")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p>Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-bold text-slate-900">Parent Testimonials</h1>
          </div>
          <p className="text-slate-500 mt-2">
            Manage the parent comments displayed in the "Why Kids Time?" section on the website.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 self-start sm:self-auto px-6 py-2.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </Button>
        )}
      </div>

      <div className="grid gap-8">
        {/* Existing Comments List */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Existing Comments ({items.length})</CardTitle>
            <CardDescription>
              Edit existing comments or click Delete to remove them instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No comments found. Add your first comment below!</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className="relative p-6 border rounded-xl bg-slate-50/60 hover:bg-slate-50 transition-colors border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Comment #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5 h-8 px-3"
                    >
                      {deletingId === item.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Author Name</label>
                      <Input
                        value={item.author || ""}
                        onChange={(e) => handleUpdateItem(index, "author", e.target.value)}
                        placeholder="e.g. Farhana Rahman"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Role</label>
                      <Input
                        value={item.role || ""}
                        onChange={(e) => handleUpdateItem(index, "role", e.target.value)}
                        placeholder="e.g. Parent"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Comment</label>
                    <Textarea
                      value={item.text || ""}
                      onChange={(e) => handleUpdateItem(index, "text", e.target.value)}
                      className="h-24 bg-white"
                      placeholder="Comment text..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Avatar Image URL (Optional)
                    </label>
                    <Input
                      value={item.avatar_url || ""}
                      onChange={(e) => handleUpdateItem(index, "avatar_url", e.target.value)}
                      placeholder="https://..."
                      className="bg-white"
                    />
                  </div>
                </div>
              ))
            )}

            {items.length > 0 && (
              <div className="pt-4">
                <Button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save All Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Comment */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" />
              Add a New Comment
            </CardTitle>
            <CardDescription>
              Create a new testimonial from a parent or student to feature on the website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddComment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Author Name *</label>
                  <Input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Parent Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Role</label>
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Parent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Comment *</label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Write the comment here..."
                  className="h-24"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Avatar Image URL (Optional)
                </label>
                <Input
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  placeholder="Leave empty for auto-generated avatar"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
