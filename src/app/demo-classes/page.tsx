import { DemoClassFlow } from "@/components/demo-class-flow"

export const metadata = {
  title: "Demo Classes | Kids Time Khilgaon",
  description: "Watch demo classes and activities before enrolling.",
}

export default function DemoClassesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Experience Our Classes</h1>
          <p className="text-lg text-slate-600">Register below to get instant access to our premium demo library, featuring recorded classes, storytelling, and fun activities.</p>
        </div>
        <DemoClassFlow />
      </div>
    </div>
  )
}
