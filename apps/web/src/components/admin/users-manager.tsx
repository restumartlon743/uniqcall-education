'use client'

import { useState } from 'react'
import {
  useAdminTeachers,
  useAdminStudents,
  useAdminParents,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  Upload,
  GraduationCap,
  Users,
  UserCheck,
} from 'lucide-react'

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

  const filteredTeachers = teachers.filter(
    (t) =>
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.specialization || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.employee_id || '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredStudents = students.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.schoolName || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.className || '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredParents = parents.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.linkedChildren || []).some((c: string) =>
        c.toLowerCase().includes(search.toLowerCase())
      )
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
            Teachers ({filteredTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-1.5">
            <Users className="h-4 w-4" />
            Students ({filteredStudents.length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="gap-1.5">
            <UserCheck className="h-4 w-4" />
            Parents ({filteredParents.length})
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Employee ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {t.specialization || <span className="text-xs text-slate-500">N/A</span>}
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {t.employee_id || <span className="text-xs text-slate-500">N/A</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-slate-400"
                      >
                        No teachers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Archetype</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Onboarding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {s.schoolName}
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {s.className}
                      </TableCell>
                      <TableCell>
                        {s.archetype ? (
                          <Badge
                            variant={
                              (s.archetype as string).toLowerCase() as
                                | 'thinker'
                                | 'creator'
                                | 'engineer'
                                | 'storyteller'
                            }
                          >
                            {s.archetype}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Not assessed
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getAssessmentBadge(s.assessmentStatus)}
                      </TableCell>
                      <TableCell>
                        {getOnboardingBadge(s.onboardingStatus)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-400"
                      >
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-400" />
                Parents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Linked Children</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {p.phone || <span className="text-xs text-slate-500">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(p.linkedChildren || []).length > 0 ? (
                            p.linkedChildren.map((child: string) => (
                              <Badge key={child} variant="social">
                                {child}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">
                              No children linked
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredParents.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-slate-400"
                      >
                        No parents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
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
