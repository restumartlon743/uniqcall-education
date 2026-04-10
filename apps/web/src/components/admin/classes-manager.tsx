'use client'

import { useState } from 'react'
import {
  useAdminClasses,
  useAdminSchools,
  useAdminTeachers,
} from '@/hooks/use-supabase-data'
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
  BookOpen,
} from 'lucide-react'

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

  const loading = classesLoading || schoolsLoading || teachersLoading

  const filtered = classesData.filter((c) => {
    const matchSearch =
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.teacherName || '').toLowerCase().includes(search.toLowerCase())
    const matchSchool = !filterSchool || c.schoolName === filterSchool
    const matchGrade = !filterGrade || String(c.grade) === filterGrade
    return matchSearch && matchSchool && matchGrade
  })

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            Classes ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>
                    <Badge variant="logical">{cls.grade}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {cls.academicYear}
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {cls.schoolName}
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {cls.teacherName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="creative">{cls.studentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(cls)}
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
                    colSpan={7}
                    className="text-center text-slate-400"
                  >
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
