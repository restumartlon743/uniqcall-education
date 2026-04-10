'use client'

import { useState } from 'react'
import { useAdminSchools } from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  Pencil,
  Building2,
  MapPin,
} from 'lucide-react'

export function SchoolsManager() {
  const { schools, loading } = useAdminSchools()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<Record<string, any> | null>(null)
  const [formName, setFormName] = useState('')
  const [formAddress, setFormAddress] = useState('')

  const filtered = schools.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.address || '').toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditingSchool(null)
    setFormName('')
    setFormAddress('')
    setDialogOpen(true)
  }

  function openEdit(school: Record<string, any>) {
    setEditingSchool(school)
    setFormName(school.name)
    setFormAddress(school.address || '')
    setDialogOpen(true)
  }

  function handleSave() {
    if (!formName.trim() || !formAddress.trim()) return
    // In a real app this would call a Supabase insert/update
    setDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" data-icon="inline-start" />
          Add School
        </Button>
      </div>

      {/* Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-400" />
            Schools ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {school.address}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="logical">{school.teacherCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="creative">{school.studentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {school.createdAt ? new Date(school.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(school)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-400"
                  >
                    No schools found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogClose onClose={() => setDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>
            {editingSchool ? 'Edit School' : 'Add School'}
          </DialogTitle>
          <DialogDescription>
            {editingSchool
              ? 'Update school information.'
              : 'Enter the details for the new school.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input
              id="school-name"
              placeholder="e.g. SMA Negeri 2 Surabaya"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-address">Address</Label>
            <Input
              id="school-address"
              placeholder="e.g. Jl. Pemuda No. 10, Surabaya"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingSchool ? 'Save Changes' : 'Add School'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
