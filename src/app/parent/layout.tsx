import { ParentSidebar } from "@/components/parent-sidebar"

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      <ParentSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
