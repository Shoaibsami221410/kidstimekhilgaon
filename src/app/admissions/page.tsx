import { AdmissionForm } from "@/components/admission-form"

export const metadata = {
  title: "Admissions | Kids Time Khilgaon",
  description: "Apply for admission to Kids Time Khilgaon Preschool.",
}

export default function AdmissionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Admissions Application</h1>
          <p className="text-lg text-slate-600">Please complete the application form below. Our admissions team will review your application and contact you shortly.</p>
        </div>
        <AdmissionForm />
      </div>
    </div>
  )
}
