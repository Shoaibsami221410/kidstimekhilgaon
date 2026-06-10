"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ImageIcon } from "lucide-react"

const supabase = createClient()

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const categories = ["All", "Activities", "Events", "Classroom", "Student Life"]

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setImages(data)
      } else if (error) {
        console.error(error)
      }
      setLoading(false)
    }
    
    fetchGallery()
  }, [])

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory)

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700">
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Moments of Joy</h1>
          <p className="text-lg text-slate-300 mb-8">
            Take a look at the beautiful moments captured inside our classrooms and events.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 ? (
             <div className="text-center text-slate-500 py-12">
               <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <p className="text-xl">No images found in this category.</p>
             </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((img) => (
                <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <img 
                    src={img.image_url} 
                    alt={img.title || "Gallery image"}
                    className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-2">
                      {img.category}
                    </span>
                    {img.title && (
                      <h3 className="text-white font-bold text-lg">{img.title}</h3>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
