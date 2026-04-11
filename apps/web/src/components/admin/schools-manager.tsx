'use client'

import { useState, useMemo } from 'react'
import { useAdminSchools } from '@/hooks/use-supabase-data'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
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
  MapPin,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'

function SortHeader({ column, children }: { column: { getToggleSortingHandler: () => undefined | ((e: unknown) => void); getIsSorted: () => false | 'asc' | 'desc' }; children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-1 hover:text-white transition-colors"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )
}

export function SchoolsManager() {
  const { schools, loading, refetch } = useAdminSchools()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<Record<string, any> | null>(null)
  const [formName, setFormName] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function openAdd() {
    setEditingSchool(null)
    setFormName('')
    setFormAddress('')
    setSaveError(null)
    setDialogOpen(true)
  }

  function openEdit(school: Record<string, any>) {
    setEditingSchool(school)
    setFormName(school.name)
    setFormAddress(school.address || '')
    setSaveError(null)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!formName.trim()) return
    setSaving(true)
    setSaveError(null)

    const supabase = createClient()
    if (!supabase) {
      setSaveError('Cannot connect to server.')
      setSaving(false)
      return
    }

    if (editingSchool) {
      const { error } = await supabase
        .from('schools')
        .update({ name: formName.trim(), address: formAddress.trim() || null })
        .eq('id', editingSchool.id)
      if (error) {
        setSaveError('Failed to update: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('schools')
        .insert({ name: formName.trim(), address: formAddress.trim() || null })
      if (error) {
        setSaveError('Failed to create: ' + error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setDialogOpen(false)
    refetch()
  }

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortHeader column={column}>Name</SortHeader>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ getValue }) => (
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'teacherCount',
        header: ({ column }) => <SortHeader column={column}>Teachers</SortHeader>,
        cell: ({ getValue }) => (
          <Badge variant="logical">{getValue() as number}</Badge>
        ),
      },
      {
        accessorKey: 'studentCount',
        header: ({ column }) => <SortHeader column={column}>Students</SortHeader>,
        cell: ({ getValue }) => (
          <Badge variant="creative">{getValue() as number}</Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <SortHeader column={column}>Created</SortHeader>,
        cell: ({ getValue }) => {
          const val = getValue() as string | null
          return (
            <span className="text-sm text-slate-400">
              {val ? new Date(val).toLocaleDateString() : 'N/A'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => openEdit(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data: schools,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const rows = table.getRowModel().rows

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
        <CardContent className="pt-4">
          {schools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Inbox className="h-8 w-8 mb-2" />
              <p className="text-sm">No schools yet.</p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center text-slate-500 py-8">
                        No results match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between border-t border-white/[0.06] px-3 pt-3 mt-2">
                  <p className="text-xs text-slate-500">
                    {table.getFilteredRowModel().rows.length} total
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="px-2 text-xs text-slate-400">
                      {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
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
          {saveError && (
            <p className="text-sm text-red-400">{saveError}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editingSchool ? 'Save Changes' : 'Add School'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
