'use client'

import { useState, useMemo } from 'react'
import {
  useAdminClasses,
  useAdminSchools,
  useAdminTeachers,
} from '@/hooks/use-supabase-data'
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
import { Select, SelectOption } from '@/components/ui/select'
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

export function ClassesManager() {
  const { classes: classesData, loading: classesLoading } = useAdminClasses()
  const { schools, loading: schoolsLoading } = useAdminSchools()
  const { teachers, loading: teachersLoading } = useAdminTeachers()

  const [search, setSearch] = useState('')
  const [filterSchool, setFilterSchool] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Record<string, any> | null>(null)

  const [formName, setFormName] = useState('')
  const [formGrade, setFormGrade] = useState<string>('10')
  const [formYear, setFormYear] = useState('2025/2026')
  const [formSchool, setFormSchool] = useState('')
  const [formTeacher, setFormTeacher] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const isLoading = classesLoading || schoolsLoading || teachersLoading

  const filteredData = useMemo(() => {
    return classesData.filter((c) => {
      const matchSchool = !filterSchool || c.schoolName === filterSchool
      const matchGrade = !filterGrade || String(c.grade) === filterGrade
      return matchSchool && matchGrade
    })
  }, [classesData, filterSchool, filterGrade])

  function openAdd() {
    setEditingClass(null)
    setFormName('')
    setFormGrade('10')
    setFormYear('2025/2026')
    setFormSchool(schools[0]?.id ?? '')
    setFormTeacher('')
    setDialogOpen(true)
  }

  function openEdit(cls: Record<string, any>) {
    setEditingClass(cls)
    setFormName(cls.name)
    setFormGrade(String(cls.grade))
    setFormYear(cls.academicYear)
    setFormSchool(cls.schoolId || '')
    setFormTeacher(cls.teacherName)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!formName.trim() || !formSchool) return
    // In a real app this would call a Supabase insert/update
    setDialogOpen(false)
  }

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortHeader column={column}>Class Name</SortHeader>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'grade',
        header: ({ column }) => <SortHeader column={column}>Grade</SortHeader>,
        cell: ({ getValue }) => (
          <Badge variant="logical">{getValue() as number}</Badge>
        ),
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-400">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'schoolName',
        header: ({ column }) => <SortHeader column={column}>School</SortHeader>,
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-300">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'teacherName',
        header: 'Teacher',
        cell: ({ getValue }) => {
          const val = getValue() as string
          return val ? (
            <span className="text-sm text-slate-300">{val}</span>
          ) : (
            <span className="text-xs text-slate-500">Unassigned</span>
          )
        },
      },
      {
        accessorKey: 'studentCount',
        header: ({ column }) => <SortHeader column={column}>Students</SortHeader>,
        cell: ({ getValue }) => (
          <Badge variant="creative">{getValue() as number}</Badge>
        ),
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
    data: filteredData,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const rows = table.getRowModel().rows

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            className="w-48"
          >
            <SelectOption value="">All Schools</SelectOption>
            {schools.map((s) => (
              <SelectOption key={s.id} value={s.name}>
                {s.name}
              </SelectOption>
            ))}
          </Select>
          <Select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="w-32"
          >
            <SelectOption value="">All Grades</SelectOption>
            <SelectOption value="10">Grade 10</SelectOption>
            <SelectOption value="11">Grade 11</SelectOption>
            <SelectOption value="12">Grade 12</SelectOption>
          </Select>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" data-icon="inline-start" />
          Create Class
        </Button>
      </div>

      {/* Table */}
      <Card className="glass">
        <CardContent className="pt-4">
          {classesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Inbox className="h-8 w-8 mb-2" />
              <p className="text-sm">No classes yet.</p>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogClose onClose={() => setDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>
            {editingClass ? 'Edit Class' : 'Create Class'}
          </DialogTitle>
          <DialogDescription>
            {editingClass
              ? 'Update class information.'
              : 'Fill in the details for the new class.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class-name">Class Name</Label>
            <Input
              id="class-name"
              placeholder="e.g. Kelas 10-B"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-grade">Grade</Label>
              <Select
                id="class-grade"
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
              >
                <SelectOption value="10">10</SelectOption>
                <SelectOption value="11">11</SelectOption>
                <SelectOption value="12">12</SelectOption>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-year">Academic Year</Label>
              <Input
                id="class-year"
                placeholder="2025/2026"
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class-school">School</Label>
            <Select
              id="class-school"
              value={formSchool}
              onChange={(e) => setFormSchool(e.target.value)}
            >
              <SelectOption value="">Select school</SelectOption>
              {schools.map((s) => (
                <SelectOption key={s.id} value={s.id}>
                  {s.name}
                </SelectOption>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class-teacher">Assign Teacher</Label>
            <Select
              id="class-teacher"
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
            >
              <SelectOption value="">Select teacher</SelectOption>
              {teachers.map((t) => (
                <SelectOption key={t.id} value={t.name}>
                  {t.name}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingClass ? 'Save Changes' : 'Create Class'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
