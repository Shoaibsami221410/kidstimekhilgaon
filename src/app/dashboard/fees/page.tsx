"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText, Download, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react"

export default function FeeManagementPage() {
  const supabase = createClient()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [students, setStudents] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Metrics
  const [collected, setCollected] = useState(0)
  const [pending, setPending] = useState(0)
  const [overdue, setOverdue] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    
    // Fetch students for the dropdown
    // For demo purposes if students table is empty, we just fetch admissions to show names
    const { data: studentData } = await supabase.from('students').select('*')
    if (studentData && studentData.length > 0) {
      setStudents(studentData)
    } else {
      // Fallback to admissions if no formal students exist yet so the dropdown isn't empty
      const { data: adms } = await supabase.from('admissions').select('id, student_first_name, student_last_name')
      setStudents(adms?.map(a => ({ id: a.id, first_name: a.student_first_name, last_name: a.student_last_name })) || [])
    }

    // Fetch invoices
    const { data: invoiceData, error } = await supabase
      .from('invoices')
      .select(`
        *,
        students (first_name, last_name)
      `)
      .order('created_at', { ascending: false })

    if (!error && invoiceData) {
      setInvoices(invoiceData)
      
      // Calculate metrics
      let tCollected = 0
      let tPending = 0
      let tOverdue = 0
      
      invoiceData.forEach(inv => {
        if (inv.status === 'Paid') tCollected += Number(inv.amount)
        if (inv.status === 'Pending') tPending += Number(inv.amount)
        if (inv.status === 'Overdue') tOverdue += Number(inv.amount)
      })
      
      setCollected(tCollected)
      setPending(tPending)
      setOverdue(tOverdue)
    }
    
    setIsLoading(false)
  }

  const handleGenerateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)
    
    const formData = new FormData(e.currentTarget)
    const studentId = formData.get('student_id') as string
    const type = formData.get('type') as string
    const amount = formData.get('amount') as string
    const dueDate = formData.get('due_date') as string

    // Insert into Supabase
    const { error } = await supabase.from('invoices').insert([
      {
        student_id: studentId.includes('-') ? null : studentId, // Handle fake IDs if from admissions fallback
        type,
        amount: Number(amount),
        due_date: dueDate,
        status: 'Pending'
      }
    ])

    setIsGenerating(false)
    if (!error) {
      setShowSuccess(true)
      fetchData() // Refresh list
      setTimeout(() => setShowSuccess(false), 3000)
      e.currentTarget.reset()
    } else {
      console.error(error)
      // Usually would show error toast here
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return "bg-green-100 text-green-700 hover:bg-green-100"
      case 'Pending': return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case 'Overdue': return "bg-red-100 text-red-700 hover:bg-red-100"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Management</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Collected</p>
              <h3 className="text-2xl font-bold text-slate-900">৳ {collected.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Invoices</p>
              <h3 className="text-2xl font-bold text-slate-900">৳ {pending.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-slate-900">৳ {overdue.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Invoice Generator Form */}
        <Card className="xl:col-span-1 shadow-sm border-0 ring-1 ring-slate-200 h-fit">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-orange-500" />
              Generate Invoice
            </CardTitle>
            <CardDescription>Create a new invoice for a student.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-green-600">
                <CheckCircle2 className="w-12 h-12 mb-2" />
                <h3 className="text-lg font-bold text-center">Invoice Generated!</h3>
                <p className="text-xs text-slate-500 text-center mt-1">Parents have been notified via SMS/Email.</p>
              </div>
            ) : (
              <form onSubmit={handleGenerateInvoice} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select name="student_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                      ))}
                      {students.length === 0 && <SelectItem value="placeholder" disabled>No students found</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Fee Type</Label>
                  <Select name="type" required defaultValue="Monthly Tuition">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly Tuition">Monthly Tuition</SelectItem>
                      <SelectItem value="Admission Fee">Admission Fee</SelectItem>
                      <SelectItem value="Material Fee">Books & Materials</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (৳)</Label>
                    <Input name="amount" type="number" placeholder="5000" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input name="due_date" type="date" required />
                  </div>
                </div>

                <Button type="submit" disabled={isGenerating || students.length === 0} className="w-full bg-orange-500 hover:bg-orange-600">
                  {isGenerating ? "Generating..." : "Generate & Send"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Invoice List */}
        <Card className="xl:col-span-2 shadow-sm border-0 ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search invoice..." className="w-[200px] h-9 text-sm" />
              <Button variant="outline" size="sm" className="h-9">Filter</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading invoices...</TableCell>
                  </TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">No invoices generated yet.</TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-slate-600 text-xs">{invoice.id.substring(0,8).toUpperCase()}</TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {invoice.students ? `${invoice.students.first_name} ${invoice.students.last_name}` : "Unknown Student"}
                      </TableCell>
                      <TableCell className="text-slate-600">{invoice.type}</TableCell>
                      <TableCell className="font-semibold text-slate-900">৳ {invoice.amount}</TableCell>
                      <TableCell className="text-slate-600">{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
