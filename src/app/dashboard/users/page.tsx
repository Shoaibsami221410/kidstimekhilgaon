"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCog, PlusCircle, RefreshCcw } from "lucide-react"

export default function UserManagementPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setUsers(data || [])
    }
    setIsLoading(false)
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'super_admin': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">Super Admin</Badge>
      case 'admin': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Admin</Badge>
      case 'teacher': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">Teacher</Badge>
      case 'parent': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Parent</Badge>
      case 'student': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">Student</Badge>
      default: return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-orange-500" />
          User Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" className="h-9 px-3">
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button className="h-9 bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg">System Users</CardTitle>
          <CardDescription>Manage all teachers, parents, admins, and students in the platform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Joined Date</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading users...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No users found. New signups will appear here.</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {user.full_name}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Edit
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
  )
}
