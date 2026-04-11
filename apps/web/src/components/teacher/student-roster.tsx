'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  getArchetypeBadgeVariant,
  getProgressColor,
} from '@/lib/mock-data'
import {
  useCurrentUser,
  useTeacherStudents,
} from '@/hooks/use-supabase-data'
import type { StudentData } from '@/hooks/use-supabase-data'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { StudentDetailPanel } from '@/components/teacher/student-detail-panel'
import {
  Search,
  AlertTriangle,
  Users,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'

const ARCHETYPE_OPTIONS = [
  'All Archetypes',
  'The Thinker',
  'The Engineer',
  'The Guardian',
  'The Strategist',
  'The Creator',
  'The Shaper',
  'The Storyteller',
  'The Performer',
  'The Healer',
  'The Diplomat',
  'The Explorer',
  'The Mentor',
  'The Visionary',
]

const STATUS_OPTIONS = ['All Status', 'Active', 'Needs Attention']

const columnHelper = createColumnHelper<StudentData>()

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') return <ChevronUp className="ml-1 h-3.5 w-3.5 text-purple-400" />
  if (sorted === 'desc') return <ChevronDown className="ml-1 h-3.5 w-3.5 text-purple-400" />
  return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-slate-500" />
}

export function StudentRoster() {
  const { user, loading: userLoading } = useCurrentUser()
  const { students, loading: studentsLoading } = useTeacherStudents(user?.id ?? '')
  const loading = userLoading || studentsLoading

  const [search, setSearch] = useState('')
  const [archetypeFilter, setArchetypeFilter] = useState('All Archetypes')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchesArchetype =
        archetypeFilter === 'All Archetypes' || s.archetype.name === archetypeFilter
      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && s.status === 'active') ||
        (statusFilter === 'Needs Attention' && s.status === 'needs_attention')
      return matchesSearch && matchesArchetype && matchesStatus
    })
  }, [search, archetypeFilter, statusFilter, students])

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500/30 to-cyan-500/30 text-xs font-bold text-white">
              {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-white">{student.name}</p>
              <p className="text-xs text-muted-foreground">Level {student.level} · {student.xp} XP</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor((row) => row.archetype.name, {
      id: 'archetype',
      header: 'Archetype',
      cell: ({ row }) => (
        <Badge variant={getArchetypeBadgeVariant(row.original.archetype.code)}>
          {row.original.archetype.name}
        </Badge>
      ),
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: ({ getValue }) => {
        const progress = getValue()
        return (
          <div className="flex items-center gap-2">
            <Progress
              value={progress}
              className="w-24"
              indicatorClassName={cn('bg-linear-to-r', getProgressColor(progress))}
            />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('vark', {
      header: 'VARK',
      cell: ({ getValue }) => <Badge variant="vark">{getValue()}</Badge>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const isNeedsAttention = getValue() === 'needs_attention'
        return isNeedsAttention ? (
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Needs Attention</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs">Active</span>
          </div>
        )
      },
    }),
  ], [])

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Users className="h-12 w-12 mb-4 opacity-50" />
        <p>No students enrolled yet</p>
      </div>
    )
  }

  return (
    <div className="flex gap-0">
      <div className={cn('flex-1 space-y-4 transition-all duration-300', selectedStudent ? 'pr-0' : '')}>
        {/* Filter Bar */}
        <div className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={archetypeFilter} onChange={(e) => setArchetypeFilter(e.target.value)} className="w-[180px]">
            {ARCHETYPE_OPTIONS.map((opt) => (
              <SelectOption key={opt} value={opt}>{opt}</SelectOption>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[160px]">
            {STATUS_OPTIONS.map((opt) => (
              <SelectOption key={opt} value={opt}>{opt}</SelectOption>
            ))}
          </Select>
        </div>

        {/* Data Table */}
        <div className="glass overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon sorted={header.column.getIsSorted()} />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  const student = row.original
                  const isNeedsAttention = student.status === 'needs_attention'
                  const isSelected = selectedStudent?.id === student.id
                  return (
                    <TableRow
                      key={row.id}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isNeedsAttention && 'bg-amber-500/5 hover:bg-amber-500/10',
                        isSelected && 'bg-purple-500/10 hover:bg-purple-500/15 border-l-2 border-l-purple-500'
                      )}
                      onClick={() => setSelectedStudent(student)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                    No students found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                {'-'}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredStudents.length
                )}
                {' '}of {filteredStudents.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStudent && (
        <StudentDetailPanel
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}
