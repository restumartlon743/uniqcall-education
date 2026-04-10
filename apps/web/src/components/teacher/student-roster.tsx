'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  MOCK_STUDENTS,
  getArchetypeBadgeVariant,
  getProgressColor,
} from '@/lib/mock-data'
import type { MockStudent } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { StudentDetailPanel } from '@/components/teacher/student-detail-panel'
import { Search, AlertTriangle } from 'lucide-react'

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

export function StudentRoster() {
  const [search, setSearch] = useState('')
  const [archetypeFilter, setArchetypeFilter] = useState('All Archetypes')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedStudent, setSelectedStudent] = useState<MockStudent | null>(
    null
  )

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesArchetype =
        archetypeFilter === 'All Archetypes' ||
        s.archetype.name === archetypeFilter
      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && s.status === 'active') ||
        (statusFilter === 'Needs Attention' && s.status === 'needs_attention')
      return matchesSearch && matchesArchetype && matchesStatus
    })
  }, [search, archetypeFilter, statusFilter])

  return (
    <div className="flex gap-0">
      {/* Main Roster */}
      <div
        className={cn(
          'flex-1 space-y-4 transition-all duration-300',
          selectedStudent ? 'pr-0' : ''
        )}
      >
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
          <Select
            value={archetypeFilter}
            onChange={(e) => setArchetypeFilter(e.target.value)}
            className="w-[180px]"
          >
            {ARCHETYPE_OPTIONS.map((opt) => (
              <SelectOption key={opt} value={opt}>
                {opt}
              </SelectOption>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[160px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <SelectOption key={opt} value={opt}>
                {opt}
              </SelectOption>
            ))}
          </Select>
        </div>

        {/* Data Table */}
        <div className="glass overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Archetype</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>VARK</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const isNeedsAttention =
                  student.status === 'needs_attention'
                const isSelected = selectedStudent?.id === student.id
                return (
                  <TableRow
                    key={student.id}
                    className={cn(
                      'cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.08)]',
                      isNeedsAttention &&
                        'bg-amber-500/5 hover:bg-amber-500/10',
                      isSelected &&
                        'bg-purple-500/10 hover:bg-purple-500/15 border-l-2 border-l-purple-500'
                    )}
                    onClick={() => setSelectedStudent(student)}
                  >
                    {/* Name + Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500/30 to-cyan-500/30 text-xs font-bold text-white">
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Level {student.level} · {student.xp} XP
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Archetype Badge */}
                    <TableCell>
                      <Badge
                        variant={getArchetypeBadgeVariant(
                          student.archetype.code
                        )}
                      >
                        {student.archetype.name}
                      </Badge>
                    </TableCell>

                    {/* Progress Bar */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.progress}
                          className="w-24"
                          indicatorClassName={cn(
                            'bg-linear-to-r',
                            getProgressColor(student.progress)
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>

                    {/* VARK Tag */}
                    <TableCell>
                      <Badge variant="vark">{student.vark}</Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {isNeedsAttention ? (
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs">Needs Attention</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-xs">Active</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No students found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
