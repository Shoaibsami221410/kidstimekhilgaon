"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Banknote, AlertCircle, CheckCircle2 } from "lucide-react"

const supabase = createClient()

export default function ParentFeesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      // In a real scenario, we join with students associated with the parent
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: true })
      
      if (data) {
        setInvoices(data)
      }
      setLoading(false)
    }
    fetchInvoices()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fees & Invoices</h1>
        <p className="text-slate-500">Manage your child's tuition and admission fees securely.</p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Payment History & Due Invoices</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
              <p>No invoices found. All clear!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 
                      invoice.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{invoice.type}</h4>
                      <p className="text-sm text-slate-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="font-bold text-xl text-slate-900">৳ {invoice.amount.toLocaleString()}</p>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                        invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    {invoice.status !== 'Paid' && (
                      <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-800">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm">Payments are processed securely via SSLCommerz. Mobile banking (bKash, Nagad) is supported.</p>
      </div>
    </div>
  )
}
