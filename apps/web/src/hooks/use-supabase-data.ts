'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────

export interface StudentData {
  id: string
  name: string
  avatarUrl: string | null
  archetype: {
    code: string
    name: string
    cluster: string
  }
  progress: number
  level: number
  vark: string
  status: 'active' | 'needs_attention'
  cognitiveParams: {
    analytical: number
    creative: number
    linguistic: number
    kinesthetic: number
    social: number
    observation: number
    intuition: number
  }
  engagement: number[]
  xp: number
  lastActive: string
  joinedDate: string
  streak: number
  varkProfile: Record<string, number> | null
  school: string
  className: string
}

export interface GroupData {
  id: string
  name: string
  memberIds: string[]
  synergyScore: number
  project: string | null
}

export interface TaskData {
  id: string
  title: string
  description: string
  type: 'individual' | 'group'
  targetArchetype: string | null
  dueDate: string
  xpReward: number
  submissionsCount: number
  totalExpected: number
  status: string
  knowledgeField: string
  createdAt: string
}

export interface ActivityData {
  id: string
  type: 'submission' | 'new_student' | 'achievement' | 'alert'
  message: string
  timestamp: string
  studentName?: string
}

// ─── Helpers ──────────────────────────────────────────────────

export function getDominantVark(varkProfile: Record<string, number> | null): string {
  if (!varkProfile || Object.keys(varkProfile).length === 0) return 'R'
  const entries = Object.entries(varkProfile)
  const dominant = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))
  const varkMap: Record<string, string> = {
    visual: 'V',
    auditory: 'A',
    readWrite: 'R',
    read_write: 'R',
    kinesthetic: 'K',
  }
  return varkMap[dominant[0]] || dominant[0].charAt(0).toUpperCase()
}

export function computeLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}

function mapStudentRow(raw: Record<string, any>): StudentData {
  const profile = raw.profiles
  const archetype = raw.archetypes
  const cp = raw.cognitive_params || {}
  const cls = raw.classes

  const archetypeName = archetype?.name_en
    ? archetype.name_en.startsWith('The ')
      ? archetype.name_en
      : `The ${archetype.name_en}`
    : 'Unknown'

  return {
    id: raw.id,
    name: profile?.full_name || 'Unknown',
    avatarUrl: profile?.avatar_url || null,
    archetype: {
      code: archetype?.code || 'THINKER',
      name: archetypeName,
      cluster: archetype?.cluster || '',
    },
    progress: raw.mastery_level || 0,
    level: computeLevel(raw.total_xp || 0),
    vark: getDominantVark(raw.vark_profile),
    status: (raw.mastery_level || 0) < 50 ? 'needs_attention' : 'active',
    cognitiveParams: {
      analytical: cp.analytical || 0,
      creative: cp.creative || 0,
      linguistic: cp.linguistic || 0,
      kinesthetic: cp.kinesthetic || 0,
      social: cp.social || 0,
      observation: cp.observation || 0,
      intuition: cp.intuition || 0,
    },
    engagement: [],
    xp: raw.total_xp || 0,
    lastActive: 'N/A',
    joinedDate: profile?.created_at?.split('T')[0] || '',
    streak: raw.current_streak || 0,
    varkProfile: raw.vark_profile || null,
    school: cls?.schools?.name || '',
    className: cls?.name || '',
  }
}

export function getDistributionFromStudents(students: StudentData[]) {
  const counts: Record<string, number> = {}
  for (const s of students) {
    const name = s.archetype.name
    counts[name] = (counts[name] ?? 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    code:
      students.find((s) => s.archetype.name === name)?.archetype.code ?? '',
  }))
}

// ─── Hook 1: Current User ─────────────────────────────────────

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase!.auth.getUser()
      if (!authUser) {
        setLoading(false)
        return
      }
      setUser(authUser)

      const { data: profileData } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData)
      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, profile, loading }
}

// ─── Hook 2: Teacher Students ─────────────────────────────────

export function useTeacherStudents(teacherId: string) {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !teacherId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchStudents() {
      const { data: classes } = await supabase!
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId)

      const classIds =
        classes?.map((c: Record<string, any>) => c.id) || []
      if (classIds.length === 0) {
        setStudents([])
        setLoading(false)
        return
      }

      const { data } = await supabase!
        .from('students')
        .select('*, profiles(*), archetypes(*), classes(name, schools(name))')
        .in('class_id', classIds)

      setStudents(data ? data.map(mapStudentRow) : [])
      setLoading(false)
    }

    fetchStudents()
  }, [teacherId])

  return { students, loading }
}

// ─── Hook 3: Teacher Classes ──────────────────────────────────

export function useTeacherClasses(teacherId: string) {
  const [classes, setClasses] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = useCallback(async () => {
    const supabase = createClient()
    if (!supabase || !teacherId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('classes')
      .select('*, schools(name)')
      .eq('teacher_id', teacherId)

    setClasses(data || [])
    setLoading(false)
  }, [teacherId])

  useEffect(() => { fetchClasses() }, [fetchClasses])

  return { classes, loading, refetch: fetchClasses }
}

// ─── Hook 4: Teacher Groups ──────────────────────────────────

export function useTeacherGroups(teacherId: string) {
  const [groups, setGroups] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !teacherId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchGroups() {
      const { data: classes } = await supabase!
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId)

      const classIds =
        classes?.map((c: Record<string, any>) => c.id) || []
      if (classIds.length === 0) {
        setGroups([])
        setLoading(false)
        return
      }

      const { data } = await supabase!
        .from('peer_groups')
        .select('*, peer_group_members(student_id)')
        .in('class_id', classIds)

      if (data) {
        setGroups(
          data.map((g: Record<string, any>) => ({
            id: g.id,
            name: g.name,
            memberIds:
              g.peer_group_members?.map(
                (m: Record<string, any>) => m.student_id
              ) || [],
            synergyScore: g.synergy_score || 0,
            project: null,
          }))
        )
      }
      setLoading(false)
    }

    fetchGroups()
  }, [teacherId])

  return { groups, loading }
}

// ─── Hook 5: Teacher Tasks ───────────────────────────────────

export function useTeacherTasks(teacherId: string) {
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const supabase = createClient()
    if (!supabase || !teacherId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('tasks')
      .select('*, task_submissions(id), classes(students(id))')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })

    if (data) {
      setTasks(
        data.map((t: Record<string, any>) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          type:
            t.task_type === 'group'
              ? ('group' as const)
              : ('individual' as const),
          targetArchetype: t.target_archetype || null,
          dueDate: t.due_date || '',
          xpReward: t.xp_reward || 0,
          submissionsCount: t.task_submissions?.length || 0,
          totalExpected: t.classes?.students?.length || 0,
          status:
            t.due_date && new Date(t.due_date) < new Date()
              ? 'completed'
              : 'active',
          knowledgeField: t.knowledge_field || '',
          createdAt: t.created_at || '',
        }))
      )
    }
    setLoading(false)
  }, [teacherId])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  return { tasks, loading, refetch: fetchTasks }
}

// ─── Hook 6: Teacher Activities ──────────────────────────────

export function useTeacherActivities(teacherId: string) {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !teacherId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchActivities() {
      const { data } = await supabase!
        .from('notifications')
        .select('*')
        .eq('user_id', teacherId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setActivities(
          data.map((n: Record<string, any>) => ({
            id: n.id,
            type: (n.type as ActivityData['type']) || 'submission',
            message: n.body || n.title || '',
            timestamp: timeAgo(n.created_at),
            studentName: n.data?.student_name,
          }))
        )
      }
      setLoading(false)
    }

    fetchActivities()
  }, [teacherId])

  return { activities, loading }
}

// ─── Hook 7: Student Data ────────────────────────────────────

export function useStudentData(studentId: string) {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [archetype, setArchetype] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !studentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchStudent() {
      const { data } = await supabase!
        .from('students')
        .select('*, profiles(*), archetypes(*), classes(name, schools(name))')
        .eq('id', studentId)
        .single()

      if (data) {
        setStudent(mapStudentRow(data))
        setArchetype(data.archetypes)
      }
      setLoading(false)
    }

    fetchStudent()
  }, [studentId])

  return { student, archetype, loading }
}

// ─── Hook 8: Student Badges ─────────────────────────────────

export function useStudentBadges(studentId: string) {
  const [badges, setBadges] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !studentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchBadges() {
      const { data } = await supabase!
        .from('student_badges')
        .select('*, badges(*)')
        .eq('student_id', studentId)
        .order('earned_at', { ascending: false })

      setBadges(
        data?.map((sb: Record<string, any>) => ({
          id: sb.badge_id,
          name: sb.badges?.name || '',
          description: sb.badges?.description || '',
          icon_url: sb.badges?.icon_url || '',
          category: sb.badges?.category || '',
          earned_at: sb.earned_at,
        })) || []
      )
      setLoading(false)
    }

    fetchBadges()
  }, [studentId])

  return { badges, loading }
}

// ─── Hook 9: Student Missions ────────────────────────────────

export function useStudentMissions(studentId: string) {
  const [missions, setMissions] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !studentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchMissions() {
      const { data } = await supabase!
        .from('daily_missions')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false })
        .limit(10)

      setMissions(data || [])
      setLoading(false)
    }

    fetchMissions()
  }, [studentId])

  return { missions, loading }
}

// ─── Hook 10: Student Quests ─────────────────────────────────

export function useStudentQuests(studentId: string) {
  const [quests, setQuests] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !studentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchQuests() {
      const { data } = await supabase!
        .from('student_quest_progress')
        .select('*, career_quest_nodes(*)')
        .eq('student_id', studentId)

      setQuests(
        data?.map((q: Record<string, any>) => ({
          id: q.node_id,
          title: q.career_quest_nodes?.title || '',
          description: q.career_quest_nodes?.description || '',
          status: q.status,
          xp_reward: q.career_quest_nodes?.xp_reward || 0,
          order_index: q.career_quest_nodes?.order_index || 0,
          completed_at: q.completed_at,
        })) || []
      )
      setLoading(false)
    }

    fetchQuests()
  }, [studentId])

  return { quests, loading }
}

// ─── Hook 11: Parent Children ────────────────────────────────

export function useParentChildren(parentId: string) {
  const [children, setChildren] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !parentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchChildren() {
      const { data: links } = await supabase!
        .from('parent_student')
        .select('student_id')
        .eq('parent_id', parentId)

      const studentIds =
        links?.map((l: Record<string, any>) => l.student_id) || []
      if (studentIds.length === 0) {
        setChildren([])
        setLoading(false)
        return
      }

      const { data } = await supabase!
        .from('students')
        .select('*, profiles(*), archetypes(*), classes(name, schools(name))')
        .in('id', studentIds)

      setChildren(data ? data.map(mapStudentRow) : [])
      setLoading(false)
    }

    fetchChildren()
  }, [parentId])

  return { children, loading }
}

// ─── Hook 12: Parent Messages ────────────────────────────────

export function useParentMessages(parentId: string) {
  const [messages, setMessages] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !parentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchMessages() {
      const { data } = await supabase!
        .from('messages')
        .select(
          '*, sender:profiles!sender_id(full_name, avatar_url), receiver:profiles!receiver_id(full_name, avatar_url)'
        )
        .or(`sender_id.eq.${parentId},receiver_id.eq.${parentId}`)
        .order('created_at', { ascending: false })
        .limit(50)

      setMessages(data || [])
      setLoading(false)
    }

    fetchMessages()
  }, [parentId])

  return { messages, loading }
}

// ─── Hook 13: Admin Stats ────────────────────────────────────

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalParents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    async function fetchStats() {
      const [schools, teachers, students, parents] = await Promise.all([
        supabase!.from('schools').select('id', { count: 'exact', head: true }),
        supabase!
          .from('teachers')
          .select('id', { count: 'exact', head: true }),
        supabase!
          .from('students')
          .select('id', { count: 'exact', head: true }),
        supabase!
          .from('parents')
          .select('id', { count: 'exact', head: true }),
      ])

      setStats({
        totalSchools: schools.count || 0,
        totalTeachers: teachers.count || 0,
        totalStudents: students.count || 0,
        totalParents: parents.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

// ─── Hook 14: Admin Schools ──────────────────────────────────

export function useAdminSchools() {
  const [schools, setSchools] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSchools = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('schools')
      .select('*, classes(id, teacher_id, students(id))')
      .order('name')

    setSchools(
      data?.map((s: Record<string, any>) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        logo_url: s.logo_url,
        teacherCount: new Set(
          s.classes
            ?.map((c: Record<string, any>) => c.teacher_id)
            .filter(Boolean)
        ).size,
        studentCount:
          s.classes?.reduce(
            (sum: number, c: Record<string, any>) =>
              sum + (c.students?.length || 0),
            0
          ) || 0,
        createdAt: s.created_at,
      })) || []
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchSchools() }, [fetchSchools])

  return { schools, loading, refetch: fetchSchools }
}

// ─── Hook 15: Admin Classes ──────────────────────────────────

export function useAdminClasses() {
  const [classes, setClasses] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('classes')
      .select('*, schools(name), students(id)')
      .order('name')

    setClasses(
      data?.map((c: Record<string, any>) => ({
        id: c.id,
        name: c.name,
        grade: c.grade,
        academicYear: c.academic_year,
        schoolId: c.school_id || '',
        schoolName: c.schools?.name || '',
        teacherId: c.teacher_id || '',
        teacherName: '',
        studentCount: c.students?.length || 0,
      })) || []
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchClasses() }, [fetchClasses])

  return { classes, loading, refetch: fetchClasses }
}

// ─── Hook 16: Admin Teachers ─────────────────────────────────

export function useAdminTeachers() {
  const [teachers, setTeachers] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTeachers = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('teachers')
      .select('*, profiles(full_name)')

    setTeachers(
      data?.map((t: Record<string, any>) => ({
        id: t.id,
        name: t.profiles?.full_name || '',
        specialization: t.specialization || '',
        employee_id: t.employee_id || '',
      })) || []
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchTeachers() }, [fetchTeachers])

  return { teachers, loading, refetch: fetchTeachers }
}

// ─── Hook 17: Admin Students ─────────────────────────────────

export function useAdminStudents() {
  const [students, setStudents] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('students')
      .select(
        '*, profiles(full_name), archetypes(code, name_en), classes(name, schools(name))'
      )

    setStudents(
      data?.map((s: Record<string, any>) => ({
        id: s.id,
        name: s.profiles?.full_name || '',
        schoolName: s.classes?.schools?.name || '',
        className: s.classes?.name || '',
        archetype: s.archetypes?.code || null,
        assessmentStatus: s.onboarding_completed
          ? 'completed'
          : 'not_started',
        onboardingStatus: s.onboarding_completed ? 'completed' : 'pending',
      })) || []
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  return { students, loading, refetch: fetchStudents }
}

// ─── Hook 18: Admin Parents ──────────────────────────────────

export function useAdminParents() {
  const [parents, setParents] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchParents = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data } = await supabase
      .from('parents')
      .select(
        '*, profiles(full_name), parent_student(students(profiles(full_name)))'
      )

    setParents(
      data?.map((p: Record<string, any>) => ({
        id: p.id,
        name: p.profiles?.full_name || '',
        phone: p.phone || '',
        linkedChildren:
          p.parent_student?.map(
            (ps: Record<string, any>) =>
              ps.students?.profiles?.full_name || ''
          ) || [],
      })) || []
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchParents() }, [fetchParents])

  return { parents, loading, refetch: fetchParents }
}

// ─── Types: Leaderboard ──────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  studentId: string
  name: string
  avatarUrl: string | null
  archetypeCode: string
  archetypeName: string
  totalXp: number
  level: number
  streak: number
}

// ─── Hook 19: Leaderboard ────────────────────────────────────

export function useLeaderboard(classId?: string, schoolId?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchLeaderboard() {
      let query = supabase!
        .from('students')
        .select('*, profiles(full_name, avatar_url), archetypes(code, name_en), classes(id, school_id)')
        .order('total_xp', { ascending: false })
        .limit(100)

      if (classId) {
        query = query.eq('class_id', classId)
      }

      const { data } = await query

      let filtered = data || []
      if (schoolId && !classId) {
        filtered = filtered.filter(
          (s: Record<string, any>) => s.classes?.school_id === schoolId
        )
      }

      setLeaderboard(
        filtered.map((s: Record<string, any>, i: number) => ({
          rank: i + 1,
          studentId: s.id,
          name: s.profiles?.full_name || 'Unknown',
          avatarUrl: s.profiles?.avatar_url || null,
          archetypeCode: s.archetypes?.code || 'THINKER',
          archetypeName: s.archetypes?.name_en || 'Unknown',
          totalXp: s.total_xp || 0,
          level: computeLevel(s.total_xp || 0),
          streak: s.current_streak || 0,
        }))
      )
      setLoading(false)
    }

    fetchLeaderboard()
  }, [classId, schoolId])

  return { leaderboard, loading }
}
