"use client"

import { useState, useRef, DragEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, UploadCloud, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImagePickerProps {
  value: string
  onChange: (val: string) => void
  label?: string
}

export function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload')
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }
    
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `public/images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('kidstime-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('kidstime-assets')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (err: any) {
      alert("Error uploading image: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-3 p-4 border rounded-xl bg-slate-50 relative">
      {label && <Label className="font-semibold text-slate-700 block">{label}</Label>}
      
      {value ? (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-100 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex bg-slate-200/50 rounded-lg p-1 w-fit">
            <button 
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Upload Image
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('link')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Enter Link
            </button>
          </div>

          {activeTab === 'link' ? (
            <Input 
              className="focus:ring-orange-500 rounded-lg bg-white"
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="https://..."
            />
          ) : (
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                disabled={uploading}
                className="hidden" 
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center pointer-events-none">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                ) : (
                  <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? 'text-orange-500' : 'text-slate-400'}`} />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
