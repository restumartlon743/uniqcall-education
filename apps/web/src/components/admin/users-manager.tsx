'use client'

import { useState, useMemo } from 'react'
import {
  useAdminTeachers,
  useAdminStudents,
  useAdminParents,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  Upload,
  GraduationCap,
  Users,
  UserCheck,
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

function getAssessmentBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-300">Completed</Badge>
    case 'in_progress':
      return <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-300">In Progress</Badge>
    case 'not_started':
    default:
      return <Badge className="border-slate-500/30 bg-slate-500/15 text-slate-300">Not Started</Badge>
  }
}

function getOnboardingBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-300">Completed</Badge>
    case 'pending':
    default:
      return <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-300">Pending</Badge>
  }
}

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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <Inbox className="h-8 w-8 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

function DataTable<T>({
  data,
  columns,
  globalFilter,
  pageSize = 10,
}: {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  globalFilter: string
  pageSize?: number
}) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const rows = table.getRowModel().rows

  if (data.length === 0) {
    return <EmptyState message="No data available." />
  }

  return (
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
  )
}

export function UsersManager() {
  const [search, setSearch] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addRole, setAddRole] = useState<'teacher' | 'parent'>('teacher')

  // Add teacher form
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [teacherSchool, setTeacherSchool] = useState('')

  // Supabase data
  const { teachers, loading: teachersLoading } = useAdminTeachers()
  const { students, loading: studentsLoading } = useAdminStudents()
  const { parents, loading: parentsLoading } = useAdminParents()

  const teacherColumns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortHeader column={column}>Name</SortHeader>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'specialization',
        header: ({ column }) => <SortHeader column={column}>Specialization</SortHeader>,
        cell: ({ getValue }) => {
          const val = getValue() as string
          return val ? (
            <span className="text-sm text-slate-300">{val}</span>
          ) : (
            <span className="text-xs text-slate-500">N/A</span>
          )
        },
      },
      {
        accessorKey: 'employee_id',
        header: 'Employee ID',
        cell: ({ getValue }) => {
          const val = getValue() as string
          return val ? (
            <span className="text-sm text-slate-400">{val}</span>
          ) : (
            <span className="text-xs text-slate-500">N/A</span>
          )
        },
      },
    ],
    []
  )

  const studentColumns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortHeader column={column}>Name</SortHeader>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
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
        accessorKey: 'className',
        header: 'Class',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-300">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'archetype',
        header: 'Archetype',
        cell: ({ getValue }) => {
          const val = getValue() as string | null
          return val ? (
            <Badge
              variant={
                val.toLowerCase() as
                  | 'thinker'
                  | 'creator'
                  | 'engineer'
                  | 'storyteller'
              }
            >
              {val}
            </Badge>
          ) : (
            <span className="text-xs text-slate-500">Not assessed</span>
          )
        },
      },
      {
        accessorKey: 'assessmentStatus',
        header: 'Assessment',
        cell: ({ getValue }) => getAssessmentBadge(getValue() as string),
      },
      {
        accessorKey: 'onboardingStatus',
        header: 'Onboarding',
        cell: ({ getValue }) => getOnboardingBadge(getValue() as string),
      },
    ],
    []
  )

  const parentColumns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortHeader column={column}>Name</SortHeader>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => {
          const val = getValue() as string
          return val ? (
            <span className="text-sm text-slate-400">{val}</span>
          ) : (
            <span className="text-xs text-slate-500">N/A</span>
          )
        },
      },
      {
        accessorKey: 'linkedChildren',
        header: 'Linked Children',
        cell: ({ getValue }) => {
          const children = getValue() as string[]
          return children.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {children.map((child) => (
                <Badge key={child} variant="social">{child}</Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-500">No children linked</span>
          )
        },
        enableSorting: false,
      },
    ],
    []
  )

  function openAddTeacher() {
    setAddRole('teacher')
    setTeacherName('')
    setTeacherEmail('')
    setTeacherSchool('')
    setAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Search + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Upload className="h-4 w-4" data-icon="inline-start" />
            Import CSV
          </Button>
          <Button onClick={openAddTeacher} className="gap-1.5">
            <Plus className="h-4 w-4" data-icon="inline-start" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teachers">
        <TabsList>
          <TabsTrigger value="teachers" className="gap-1.5">
            <GraduationCap className="h-4 w-4" />
            Teachers ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-1.5">
            <Users className="h-4 w-4" />
            Students ({students.length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="gap-1.5">
            <UserCheck className="h-4 w-4" />
            Parents ({parents.length})
          </TabsTrigger>
        </TabsList>

        {/* Teachers Tab */}
        <TabsContent value="teachers">
          {teachersLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="pt-4">
                <DataTable
                  data={teachers}
                  columns={teacherColumns}
                  globalFilter={search}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          {studentsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="pt-4">
                <DataTable
                  data={students}
                  columns={studentColumns}
                  globalFilter={search}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Parents Tab */}
        <TabsContent value="parents">
          {parentsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="pt-4">
                <DataTable
                  data={parents}
                  columns={parentColumns}
                  globalFilter={search}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogClose onClose={() => setAddDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            {addRole === 'teacher'
              ? 'Add a new teacher to the platform.'
              : 'Generate an invite code for a parent.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={addRole}
              onChange={(e) =>
                setAddRole(e.target.value as 'teacher' | 'parent')
              }
            >
              <SelectOption value="teacher">Teacher</SelectOption>
              <SelectOption value="parent">Parent</SelectOption>
            </Select>
          </div>

          {addRole === 'teacher' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  placeholder="e.g. Pak Ahmad"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="teacher@school.id"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-school">School</Label>
                <Input
                  id="user-school"
                  placeholder="School name"
                  value={teacherSchool}
                  onChange={(e) => setTeacherSchool(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg border-l-2 border-l-cyan-500 border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-sm text-cyan-300">
                An invite code will be generated for the parent. They can use
                this code to sign up and link to their child&apos;s account.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="rounded-md bg-white/10 px-3 py-1.5 font-mono text-sm text-white">
                  INV-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </code>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setAddDialogOpen(false)}>
            {addRole === 'teacher' ? 'Add Teacher' : 'Generate Code'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
