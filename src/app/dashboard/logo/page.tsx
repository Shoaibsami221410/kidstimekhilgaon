"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePicker } from "@/components/image-picker"
import { Save, Loader2, Sparkles, RotateCcw, CheckCircle2 } from "lucide-react"
import { clearSiteCache } from "@/app/actions"

export default function WebsiteLogoPage() {
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function fetchCurrentLogo() {
      setLoading(false)
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("id", "global_footer")
        .single()

      if (data?.content?.site_logo) {
        setLogoUrl(data.content.site_logo)
      } else {
        setLogoUrl("/logo.png")
      }
      setLoading(false)
    }
    fetchCurrentLogo()
  }, [])

  const handleSaveLogo = async () => {
    if (!logoUrl) {
      alert("Please provide or upload a logo.")
      return
    }

    setSaving(true)
    setSavedSuccess(false)

    try {
      // 1. Fetch current content
      const { data: currentRecord } = await supabase
        .from("page_content")
        .select("content")
        .eq("id", "global_footer")
        .single()

      const existingContent = currentRecord?.content || {}

      // 2. Update with new logo
      const { error } = await supabase
        .from("page_content")
        .update({
          content: {
            ...existingContent,
            site_logo: logoUrl,
          },
        })
        .eq("id", "global_footer")

      if (error) throw error

      // 3. Clear Next.js cache so it appears immediately everywhere
      await clearSiteCache()

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
      alert("Website logo updated successfully! The new logo is now live across the website.")
    } catch (err: any) {
      alert("Error saving logo: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleResetToDefault = () => {
    if (confirm("Reset logo back to the original default Kids Time logo?")) {
      setLogoUrl("/logo.png")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p>Loading website logo settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-bold text-slate-900">Website Logo</h1>
          </div>
          <p className="text-slate-500 mt-2">
            Upload or change the primary logo displayed across the Header, Footer, Admin Panel, and Parent Portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetToDefault}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-100"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Default
          </Button>
          <Button
            onClick={handleSaveLogo}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 px-6"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Logo
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">
            Logo saved successfully! The change is now active across all website headers and sidebars.
          </p>
        </div>
      )}

      {/* Main Upload / URL Box */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Logo Image Source</CardTitle>
          <CardDescription>
            You can either upload an image file from your computer (PNG, JPG, SVG, WebP) or enter an external image URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImagePicker
            value={logoUrl}
            onChange={(newVal) => setLogoUrl(newVal)}
            label="Website Logo File / Link"
          />

          <div className="pt-2">
            <Button
              onClick={handleSaveLogo}
              disabled={saving}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save & Apply Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Previews */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Live Previews</CardTitle>
          <CardDescription>
            See exactly how your selected logo will look across different sections of the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Header / Navbar Preview (Light Theme)
            </span>
            <div className="p-4 bg-white border rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl || "/logo.png"}
                  alt="Logo Header Preview"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:flex gap-4 text-xs font-semibold text-slate-600">
                <span>Home</span>
                <span>Programs</span>
                <span>Facilities</span>
                <span>Contact</span>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Dashboard & Parent Sidebar Preview (Dark Theme)
            </span>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4">
              <img
                src={logoUrl || "/logo.png"}
                alt="Logo Sidebar Preview"
                className="h-10 w-auto bg-white rounded p-1 object-contain"
              />
              <span className="text-slate-400 text-xs font-mono">Sidebar Menu Header</span>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Footer Preview
            </span>
            <div className="p-6 bg-[#3f3f3f] rounded-xl flex flex-col gap-2">
              <img
                src={logoUrl || "/logo.png"}
                alt="Logo Footer Preview"
                className="h-14 w-auto object-contain object-left"
              />
              <p className="text-sky-400 text-xs">A brand of Light of Hope Ltd.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
