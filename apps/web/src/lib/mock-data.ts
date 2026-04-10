// ─── Types ────────────────────────────────────────────────────

export type ArchetypeCode =
  | 'THINKER'
  | 'ENGINEER'
  | 'GUARDIAN'
  | 'STRATEGIST'
  | 'CREATOR'
  | 'SHAPER'
  | 'STORYTELLER'
  | 'PERFORMER'
  | 'HEALER'
  | 'DIPLOMAT'
  | 'EXPLORER'
  | 'MENTOR'
  | 'VISIONARY'

export type VarkTag = 'V' | 'A' | 'R' | 'K'

export type StudentStatus = 'active' | 'needs_attention'

export interface MockStudent {
  id: string
  name: string
  avatarUrl: string | null
  archetype: {
    code: ArchetypeCode
    name: string
    cluster: string
  }
  progress: number
  level: number
  vark: VarkTag
  status: StudentStatus
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
}

export interface MockGroup {
  id: string
  name: string
  memberIds: string[]
  synergyScore: number
  project: string | null
}

export interface MockTask {
  id: string
  title: string
  description: string
  type: 'individual' | 'group'
  targetArchetype: ArchetypeCode | null
  dueDate: string
  xpReward: number
  submissionsCount: number
  totalExpected: number
  status: 'active' | 'completed' | 'draft'
  knowledgeField: string
  createdAt: string
}

export interface MockActivity {
  id: string
  type: 'submission' | 'new_student' | 'achievement' | 'alert'
  message: string
  timestamp: string
  studentName?: string
}

// ─── Archetype Helpers ────────────────────────────────────────

export const ARCHETYPE_COLORS: Record<string, string> = {
  THINKER: '#8B5CF6',
  ENGINEER: '#06B6D4',
  GUARDIAN: '#3B82F6',
  STRATEGIST: '#6366F1',
  CREATOR: '#EC4899',
  SHAPER: '#F97316',
  STORYTELLER: '#F59E0B',
  PERFORMER: '#F43F5E',
  HEALER: '#10B981',
  DIPLOMAT: '#14B8A6',
  EXPLORER: '#84CC16',
  MENTOR: '#0EA5E9',
  VISIONARY: '#7C3AED',
}

export function getArchetypeBadgeVariant(code: string) {
  return code.toLowerCase() as
    | 'thinker'
    | 'engineer'
    | 'guardian'
    | 'strategist'
    | 'creator'
    | 'shaper'
    | 'storyteller'
    | 'performer'
    | 'healer'
    | 'diplomat'
    | 'explorer'
    | 'mentor'
    | 'visionary'
}

export function getProgressColor(value: number): string {
  if (value >= 70) return 'from-emerald-500 to-cyan-500'
  if (value >= 40) return 'from-amber-500 to-yellow-500'
  return 'from-red-500 to-orange-500'
}

export const ARCHETYPE_INTERVENTIONS: Record<string, string[]> = {
  THINKER: [
    'Assign research-based analytical task',
    'Provide advanced theoretical reading materials',
    'Schedule 1-on-1 discussion on hypotheses',
    'Pair with a Creator for balanced perspective',
  ],
  ENGINEER: [
    'Assign hands-on building/prototyping project',
    'Provide system design challenge',
    'Schedule lab or workshop session',
    'Pair with a Strategist for planning skills',
  ],
  GUARDIAN: [
    'Assign case studies on ethics & policy',
    'Provide debate/discussion framework',
    'Schedule peer mediation practice',
    'Pair with an Explorer for new perspectives',
  ],
  STRATEGIST: [
    'Assign leadership simulation exercise',
    'Provide strategic planning case study',
    'Schedule team project management role',
    'Pair with a Thinker for deep analysis',
  ],
  CREATOR: [
    'Assign open-ended creative project',
    'Provide visual design challenge',
    'Schedule brainstorming workshop',
    'Pair with an Engineer for execution skills',
  ],
  SHAPER: [
    'Assign architecture/spatial design task',
    'Provide model-building exercise',
    'Schedule hands-on crafting session',
    'Pair with a Creator for visual inspiration',
  ],
  STORYTELLER: [
    'Assign narrative writing or presentation',
    'Provide storytelling framework resources',
    'Schedule public speaking practice',
    'Pair with a Diplomat for audience awareness',
  ],
  PERFORMER: [
    'Assign live presentation or performance',
    'Provide improvisation exercises',
    'Schedule creative expression workshop',
    'Pair with a Storyteller for narrative depth',
  ],
  HEALER: [
    'Assign empathy-building case studies',
    'Provide community service project',
    'Schedule counseling skills practice',
    'Pair with a Guardian for systematic approach',
  ],
  DIPLOMAT: [
    'Assign cross-cultural communication task',
    'Provide negotiation simulation',
    'Schedule facilitation practice',
    'Pair with a Storyteller for persuasion skills',
  ],
  EXPLORER: [
    'Assign field research or observation project',
    'Provide discovery-based learning tasks',
    'Schedule outdoor or experiential activity',
    'Pair with a Thinker for analytical depth',
  ],
  MENTOR: [
    'Assign peer tutoring responsibility',
    'Provide teaching practice exercises',
    'Schedule mentoring session with juniors',
    'Pair with a Healer for emotional awareness',
  ],
  VISIONARY: [
    'Assign future-scenario planning project',
    'Provide innovation challenge',
    'Schedule trend analysis workshop',
    'Pair with an Engineer for feasibility check',
  ],
}

// ─── Mock Students ────────────────────────────────────────────

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: '1',
    name: 'Andi Pratama',
    avatarUrl: null,
    archetype: { code: 'THINKER', name: 'The Thinker', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 78,
    level: 5,
    vark: 'R',
    status: 'active',
    cognitiveParams: {
      analytical: 85, creative: 45, linguistic: 60,
      kinesthetic: 35, social: 40, observation: 70, intuition: 65,
    },
    engagement: [80, 65, 90, 55, 70, 40, 30],
    xp: 2450,
    lastActive: '2 hours ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    avatarUrl: null,
    archetype: { code: 'CREATOR', name: 'The Creator', cluster: 'CREATIVE_EXPRESSIVE' },
    progress: 85,
    level: 6,
    vark: 'V',
    status: 'active',
    cognitiveParams: {
      analytical: 40, creative: 90, linguistic: 55,
      kinesthetic: 50, social: 60, observation: 65, intuition: 70,
    },
    engagement: [90, 85, 75, 80, 70, 60, 45],
    xp: 3100,
    lastActive: '30 minutes ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    avatarUrl: null,
    archetype: { code: 'ENGINEER', name: 'The Engineer', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 42,
    level: 3,
    vark: 'K',
    status: 'needs_attention',
    cognitiveParams: {
      analytical: 70, creative: 35, linguistic: 30,
      kinesthetic: 75, social: 25, observation: 60, intuition: 40,
    },
    engagement: [40, 30, 55, 20, 35, 15, 10],
    xp: 980,
    lastActive: '3 days ago',
    joinedDate: '2026-01-16',
  },
  {
    id: '4',
    name: 'Maya Putri Lestari',
    avatarUrl: null,
    archetype: { code: 'STORYTELLER', name: 'The Storyteller', cluster: 'CREATIVE_EXPRESSIVE' },
    progress: 91,
    level: 7,
    vark: 'A',
    status: 'active',
    cognitiveParams: {
      analytical: 50, creative: 60, linguistic: 88,
      kinesthetic: 30, social: 75, observation: 45, intuition: 55,
    },
    engagement: [95, 90, 85, 88, 80, 70, 55],
    xp: 3800,
    lastActive: '1 hour ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '5',
    name: 'Rizki Hidayat',
    avatarUrl: null,
    archetype: { code: 'STRATEGIST', name: 'The Strategist', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 73,
    level: 5,
    vark: 'R',
    status: 'active',
    cognitiveParams: {
      analytical: 72, creative: 50, linguistic: 55,
      kinesthetic: 35, social: 65, observation: 48, intuition: 70,
    },
    engagement: [75, 70, 80, 60, 65, 50, 35],
    xp: 2200,
    lastActive: '4 hours ago',
    joinedDate: '2026-01-16',
  },
  {
    id: '6',
    name: 'Dewi Anggraini',
    avatarUrl: null,
    archetype: { code: 'HEALER', name: 'The Healer', cluster: 'SOCIAL_HUMANITARIAN' },
    progress: 88,
    level: 6,
    vark: 'A',
    status: 'active',
    cognitiveParams: {
      analytical: 45, creative: 40, linguistic: 60,
      kinesthetic: 35, social: 85, observation: 78, intuition: 65,
    },
    engagement: [85, 80, 90, 75, 70, 55, 40],
    xp: 2900,
    lastActive: '1 hour ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '7',
    name: 'Fajar Ramadhan',
    avatarUrl: null,
    archetype: { code: 'GUARDIAN', name: 'The Guardian', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 35,
    level: 2,
    vark: 'R',
    status: 'needs_attention',
    cognitiveParams: {
      analytical: 60, creative: 25, linguistic: 45,
      kinesthetic: 30, social: 55, observation: 50, intuition: 40,
    },
    engagement: [35, 20, 40, 15, 25, 10, 5],
    xp: 650,
    lastActive: '5 days ago',
    joinedDate: '2026-01-17',
  },
  {
    id: '8',
    name: 'Lina Marlina',
    avatarUrl: null,
    archetype: { code: 'PERFORMER', name: 'The Performer', cluster: 'CREATIVE_EXPRESSIVE' },
    progress: 82,
    level: 6,
    vark: 'V',
    status: 'active',
    cognitiveParams: {
      analytical: 35, creative: 78, linguistic: 50,
      kinesthetic: 65, social: 72, observation: 40, intuition: 68,
    },
    engagement: [88, 82, 78, 85, 75, 65, 50],
    xp: 2750,
    lastActive: '3 hours ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '9',
    name: 'Hendra Wijaya',
    avatarUrl: null,
    archetype: { code: 'EXPLORER', name: 'The Explorer', cluster: 'SOCIAL_HUMANITARIAN' },
    progress: 67,
    level: 4,
    vark: 'K',
    status: 'active',
    cognitiveParams: {
      analytical: 50, creative: 45, linguistic: 35,
      kinesthetic: 72, social: 40, observation: 82, intuition: 60,
    },
    engagement: [65, 60, 70, 55, 75, 80, 45],
    xp: 1800,
    lastActive: '6 hours ago',
    joinedDate: '2026-01-16',
  },
  {
    id: '10',
    name: 'Nisa Fitriani',
    avatarUrl: null,
    archetype: { code: 'DIPLOMAT', name: 'The Diplomat', cluster: 'SOCIAL_HUMANITARIAN' },
    progress: 79,
    level: 5,
    vark: 'A',
    status: 'active',
    cognitiveParams: {
      analytical: 48, creative: 42, linguistic: 70,
      kinesthetic: 30, social: 80, observation: 55, intuition: 65,
    },
    engagement: [82, 78, 85, 70, 68, 55, 42],
    xp: 2350,
    lastActive: '2 hours ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '11',
    name: 'Arif Kurniawan',
    avatarUrl: null,
    archetype: { code: 'SHAPER', name: 'The Shaper', cluster: 'CREATIVE_EXPRESSIVE' },
    progress: 71,
    level: 5,
    vark: 'V',
    status: 'active',
    cognitiveParams: {
      analytical: 58, creative: 75, linguistic: 35,
      kinesthetic: 55, social: 38, observation: 62, intuition: 48,
    },
    engagement: [70, 65, 75, 60, 68, 45, 35],
    xp: 2100,
    lastActive: '5 hours ago',
    joinedDate: '2026-01-16',
  },
  {
    id: '12',
    name: 'Putri Handayani',
    avatarUrl: null,
    archetype: { code: 'MENTOR', name: 'The Mentor', cluster: 'SOCIAL_HUMANITARIAN' },
    progress: 86,
    level: 6,
    vark: 'R',
    status: 'active',
    cognitiveParams: {
      analytical: 55, creative: 42, linguistic: 72,
      kinesthetic: 30, social: 82, observation: 50, intuition: 58,
    },
    engagement: [88, 85, 82, 78, 75, 62, 48],
    xp: 2850,
    lastActive: '1 hour ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '13',
    name: 'Dimas Aditya',
    avatarUrl: null,
    archetype: { code: 'VISIONARY', name: 'The Visionary', cluster: 'SOCIAL_HUMANITARIAN' },
    progress: 38,
    level: 2,
    vark: 'K',
    status: 'needs_attention',
    cognitiveParams: {
      analytical: 55, creative: 68, linguistic: 40,
      kinesthetic: 45, social: 35, observation: 50, intuition: 78,
    },
    engagement: [30, 25, 45, 20, 35, 10, 8],
    xp: 580,
    lastActive: '4 days ago',
    joinedDate: '2026-01-17',
  },
  {
    id: '14',
    name: 'Rina Wulandari',
    avatarUrl: null,
    archetype: { code: 'THINKER', name: 'The Thinker', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 92,
    level: 7,
    vark: 'R',
    status: 'active',
    cognitiveParams: {
      analytical: 92, creative: 48, linguistic: 65,
      kinesthetic: 28, social: 35, observation: 75, intuition: 70,
    },
    engagement: [95, 88, 92, 85, 82, 60, 50],
    xp: 3950,
    lastActive: '45 minutes ago',
    joinedDate: '2026-01-15',
  },
  {
    id: '15',
    name: 'Ahmad Fauzi',
    avatarUrl: null,
    archetype: { code: 'ENGINEER', name: 'The Engineer', cluster: 'LOGICAL_SYSTEMIC' },
    progress: 74,
    level: 5,
    vark: 'K',
    status: 'active',
    cognitiveParams: {
      analytical: 68, creative: 40, linguistic: 32,
      kinesthetic: 78, social: 30, observation: 65, intuition: 42,
    },
    engagement: [72, 68, 78, 62, 70, 48, 35],
    xp: 2180,
    lastActive: '3 hours ago',
    joinedDate: '2026-01-16',
  },
  {
    id: '16',
    name: 'Sari Indah Permata',
    avatarUrl: null,
    archetype: { code: 'CREATOR', name: 'The Creator', cluster: 'CREATIVE_EXPRESSIVE' },
    progress: 69,
    level: 4,
    vark: 'V',
    status: 'active',
    cognitiveParams: {
      analytical: 38, creative: 82, linguistic: 48,
      kinesthetic: 55, social: 52, observation: 58, intuition: 65,
    },
    engagement: [68, 72, 65, 70, 62, 50, 38],
    xp: 1920,
    lastActive: '4 hours ago',
    joinedDate: '2026-01-16',
  },
]

// ─── Mock Groups ──────────────────────────────────────────────

export const MOCK_GROUPS: MockGroup[] = [
  {
    id: 'g1',
    name: 'Alpha Innovators',
    memberIds: ['1', '2', '9', '13'],
    synergyScore: 87,
    project: 'Sustainable City Design',
  },
  {
    id: 'g2',
    name: 'Logic Masters',
    memberIds: ['3', '5', '14', '15'],
    synergyScore: 92,
    project: 'Scientific Method Research',
  },
  {
    id: 'g3',
    name: 'Creative Force',
    memberIds: ['4', '8', '11', '16'],
    synergyScore: 85,
    project: 'Digital Storytelling Campaign',
  },
  {
    id: 'g4',
    name: 'Social Impact',
    memberIds: ['6', '7', '10', '12'],
    synergyScore: 78,
    project: 'Community Outreach Program',
  },
]

// ─── Mock Tasks ───────────────────────────────────────────────

export const MOCK_TASKS: MockTask[] = [
  {
    id: 't1',
    title: 'Research Essay: Scientific Method',
    description: 'Write a 1000-word essay analyzing the scientific method and its application in daily life.',
    type: 'individual',
    targetArchetype: 'THINKER',
    dueDate: '2026-04-13',
    xpReward: 100,
    submissionsCount: 13,
    totalExpected: 16,
    status: 'active',
    knowledgeField: 'ALAM',
    createdAt: '2026-04-05',
  },
  {
    id: 't2',
    title: 'Group Project: Sustainable City',
    description: 'Design a sustainable city model incorporating environmental, social, and economic factors.',
    type: 'group',
    targetArchetype: null,
    dueDate: '2026-04-17',
    xpReward: 250,
    submissionsCount: 2,
    totalExpected: 4,
    status: 'active',
    knowledgeField: 'SOSIAL',
    createdAt: '2026-04-03',
  },
  {
    id: 't3',
    title: 'VARK Reading: Indonesian Literature',
    description: 'Read and analyze a short story from Indonesian literature with VARK-adapted responses.',
    type: 'individual',
    targetArchetype: null,
    dueDate: '2026-04-11',
    xpReward: 50,
    submissionsCount: 10,
    totalExpected: 16,
    status: 'active',
    knowledgeField: 'HUMANIORA',
    createdAt: '2026-04-07',
  },
  {
    id: 't4',
    title: 'Collaborative Debate Prep',
    description: 'Prepare arguments and counterpoints for the upcoming class debate on renewable energy.',
    type: 'group',
    targetArchetype: 'STORYTELLER',
    dueDate: '2026-04-15',
    xpReward: 150,
    submissionsCount: 2,
    totalExpected: 4,
    status: 'active',
    knowledgeField: 'SOSIAL',
    createdAt: '2026-04-06',
  },
  {
    id: 't5',
    title: 'Career Exploration Report',
    description: 'Research 3 professions aligned with your archetype and write a comparison report.',
    type: 'individual',
    targetArchetype: null,
    dueDate: '2026-04-20',
    xpReward: 120,
    submissionsCount: 5,
    totalExpected: 16,
    status: 'active',
    knowledgeField: 'SOSIAL',
    createdAt: '2026-04-08',
  },
]

// ─── Mock Activity ────────────────────────────────────────────

export const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: 'a1',
    type: 'submission',
    message: 'Maya Putri submitted "Research Essay: Scientific Method"',
    timestamp: '10 minutes ago',
    studentName: 'Maya Putri Lestari',
  },
  {
    id: 'a2',
    type: 'achievement',
    message: 'Rina Wulandari unlocked "Deep Diver" badge',
    timestamp: '1 hour ago',
    studentName: 'Rina Wulandari',
  },
  {
    id: 'a3',
    type: 'alert',
    message: 'Fajar Ramadhan has been inactive for 5 days',
    timestamp: '2 hours ago',
    studentName: 'Fajar Ramadhan',
  },
  {
    id: 'a4',
    type: 'submission',
    message: 'Siti Nurhaliza submitted "VARK Reading: Indonesian Literature"',
    timestamp: '3 hours ago',
    studentName: 'Siti Nurhaliza',
  },
  {
    id: 'a5',
    type: 'achievement',
    message: 'Alpha Innovators group reached 87% synergy score',
    timestamp: '5 hours ago',
  },
  {
    id: 'a6',
    type: 'alert',
    message: 'Dimas Aditya engagement dropped below 30%',
    timestamp: '6 hours ago',
    studentName: 'Dimas Aditya',
  },
  {
    id: 'a7',
    type: 'submission',
    message: 'Ahmad Fauzi submitted "Career Exploration Report"',
    timestamp: '8 hours ago',
    studentName: 'Ahmad Fauzi',
  },
]

// ─── Reports Data ─────────────────────────────────────────────

export const WEEKLY_PROGRESS = [
  { week: 'Week 1', mastery: 45, engagement: 52 },
  { week: 'Week 2', mastery: 48, engagement: 55 },
  { week: 'Week 3', mastery: 52, engagement: 60 },
  { week: 'Week 4', mastery: 55, engagement: 58 },
  { week: 'Week 5', mastery: 60, engagement: 65 },
  { week: 'Week 6', mastery: 63, engagement: 68 },
  { week: 'Week 7', mastery: 68, engagement: 72 },
  { week: 'Week 8', mastery: 72, engagement: 75 },
]

export function getArchetypeDistribution() {
  const counts: Record<string, number> = {}
  for (const s of MOCK_STUDENTS) {
    const name = s.archetype.name
    counts[name] = (counts[name] ?? 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    code: MOCK_STUDENTS.find((s) => s.archetype.name === name)?.archetype.code ?? '',
  }))
}

// ─── Parent Dashboard Types ──────────────────────────────────

export interface MockParentChild {
  id: string
  name: string
  avatarUrl: string | null
  archetype: { code: ArchetypeCode; name: string; cluster: string }
  level: number
  xp: number
  xpToNextLevel: number
  mood: string
  moodEmoji: string
  varkProfile: { visual: number; auditory: number; readWrite: number; kinesthetic: number }
  cognitiveParams: {
    analytical: number
    creative: number
    linguistic: number
    kinesthetic: number
    social: number
    observation: number
    intuition: number
  }
  badges: MockParentBadge[]
  className: string
  schoolName: string
}

export interface MockParentBadge {
  id: string
  name: string
  icon: string
  earnedAt: string | null
  description: string
}

export interface MockWeeklyHighlight {
  id: string
  type: 'badge' | 'quest' | 'skill'
  title: string
  description: string
  icon: string
  timestamp: string
}

export interface MockGrowthData {
  week: string
  analytical: number
  creative: number
  linguistic: number
  kinesthetic: number
  social: number
  observation: number
  intuition: number
}

export interface MockParentMessage {
  id: string
  teacherName: string
  teacherAvatar: string | null
  subject: string
  lastMessage: string
  timestamp: string
  unread: boolean
  thread: MockMessageItem[]
}

export interface MockMessageItem {
  id: string
  sender: 'parent' | 'teacher'
  senderName: string
  content: string
  timestamp: string
}

// ─── Parent Mock Data ─────────────────────────────────────────

export const MOCK_PARENT_CHILD: MockParentChild = {
  id: '1',
  name: 'Andi Pratama',
  avatarUrl: null,
  archetype: { code: 'THINKER', name: 'The Thinker', cluster: 'LOGICAL_SYSTEMIC' },
  level: 5,
  xp: 2450,
  xpToNextLevel: 3000,
  mood: 'Feeling Confident today!',
  moodEmoji: '😊',
  varkProfile: { visual: 25, auditory: 15, readWrite: 40, kinesthetic: 20 },
  cognitiveParams: {
    analytical: 85,
    creative: 45,
    linguistic: 60,
    kinesthetic: 35,
    social: 40,
    observation: 70,
    intuition: 65,
  },
  badges: [
    { id: 'b1', name: 'Deep Diver', icon: 'search', earnedAt: '2026-04-08', description: 'Completed 10 analytical challenges' },
    { id: 'b2', name: 'Logic Master', icon: 'brain', earnedAt: '2026-04-05', description: 'Solved 20 logic puzzles' },
    { id: 'b3', name: 'First Steps', icon: 'footprints', earnedAt: '2026-01-16', description: 'Completed first assessment' },
    { id: 'b4', name: 'Streak Hero', icon: 'flame', earnedAt: '2026-03-20', description: '7-day login streak' },
    { id: 'b5', name: 'Team Player', icon: 'users', earnedAt: '2026-03-28', description: 'Completed first group project' },
    { id: 'b6', name: 'Explorer', icon: 'compass', earnedAt: null, description: 'Try 5 different skill categories' },
    { id: 'b7', name: 'Creative Spark', icon: 'sparkles', earnedAt: null, description: 'Score 80+ on a creative task' },
    { id: 'b8', name: 'Night Owl', icon: 'moon', earnedAt: null, description: 'Complete a task after 8 PM' },
  ],
  className: 'Kelas 10-A',
  schoolName: 'SMA Negeri 1 Jakarta',
}

export const MOCK_WEEKLY_HIGHLIGHTS: MockWeeklyHighlight[] = [
  {
    id: 'h1',
    type: 'badge',
    title: 'Unlocked: Deep Diver Badge',
    description: 'Completed 10 analytical challenges with 85%+ accuracy!',
    icon: 'graduation-cap',
    timestamp: '2 days ago',
  },
  {
    id: 'h2',
    type: 'quest',
    title: 'Completed: Logic Quest Lvl 5',
    description: 'Finished all 8 puzzles in the Logic Quest series.',
    icon: 'puzzle',
    timestamp: '3 days ago',
  },
  {
    id: 'h3',
    type: 'skill',
    title: 'Top Skill: Analytical Growth +10%',
    description: 'Analytical thinking improved significantly this week!',
    icon: 'trending-up',
    timestamp: '1 day ago',
  },
]

export const MOCK_GROWTH_DATA: MockGrowthData[] = [
  { week: 'W1', analytical: 55, creative: 30, linguistic: 40, kinesthetic: 25, social: 30, observation: 45, intuition: 40 },
  { week: 'W2', analytical: 58, creative: 32, linguistic: 42, kinesthetic: 26, social: 31, observation: 48, intuition: 42 },
  { week: 'W3', analytical: 62, creative: 34, linguistic: 44, kinesthetic: 28, social: 33, observation: 52, intuition: 45 },
  { week: 'W4', analytical: 65, creative: 36, linguistic: 48, kinesthetic: 29, social: 34, observation: 55, intuition: 48 },
  { week: 'W5', analytical: 70, creative: 38, linguistic: 50, kinesthetic: 30, social: 35, observation: 58, intuition: 50 },
  { week: 'W6', analytical: 74, creative: 40, linguistic: 53, kinesthetic: 32, social: 36, observation: 62, intuition: 55 },
  { week: 'W7', analytical: 78, creative: 42, linguistic: 56, kinesthetic: 33, social: 38, observation: 66, intuition: 58 },
  { week: 'W8', analytical: 85, creative: 45, linguistic: 60, kinesthetic: 35, social: 40, observation: 70, intuition: 65 },
]

export const MOCK_PARENT_MESSAGES: MockParentMessage[] = [
  {
    id: 'm1',
    teacherName: 'Bu Ratna Dewi',
    teacherAvatar: null,
    subject: 'Perkembangan Andi minggu ini',
    lastMessage: 'Andi menunjukkan peningkatan yang bagus di analytical thinking...',
    timestamp: '2 hours ago',
    unread: true,
    thread: [
      { id: 'mt1', sender: 'teacher', senderName: 'Bu Ratna Dewi', content: 'Selamat siang Pak/Bu, saya ingin memberi update tentang perkembangan Andi di kelas minggu ini.', timestamp: '2026-04-10 09:00' },
      { id: 'mt2', sender: 'teacher', senderName: 'Bu Ratna Dewi', content: 'Andi menunjukkan peningkatan yang bagus di analytical thinking. Nilai quiz terakhir naik 15% dari minggu lalu. Saya sangat senang dengan progressnya!', timestamp: '2026-04-10 09:01' },
      { id: 'mt3', sender: 'parent', senderName: 'Parent', content: 'Terima kasih Bu Ratna! Kami senang mendengarnya. Ada yang perlu kami bantu di rumah?', timestamp: '2026-04-10 10:30' },
      { id: 'mt4', sender: 'teacher', senderName: 'Bu Ratna Dewi', content: 'Kalau bisa, bantu Andi untuk tetap konsisten mengerjakan daily missions di app. Itu sangat membantu perkembangannya.', timestamp: '2026-04-10 11:00' },
    ],
  },
  {
    id: 'm2',
    teacherName: 'Pak Budi Setiawan',
    teacherAvatar: null,
    subject: 'Group Project Update',
    lastMessage: 'Kelompok Andi sudah mulai proyek Sustainable City...',
    timestamp: '1 day ago',
    unread: false,
    thread: [
      { id: 'mt5', sender: 'teacher', senderName: 'Pak Budi Setiawan', content: 'Kelompok Andi sudah mulai proyek Sustainable City. Andi dipilih sebagai lead researcher karena kemampuan analytical-nya.', timestamp: '2026-04-09 14:00' },
      { id: 'mt6', sender: 'parent', senderName: 'Parent', content: 'Bagus sekali Pak! Andi memang suka riset. Terima kasih atas kesempatannya.', timestamp: '2026-04-09 16:00' },
    ],
  },
  {
    id: 'm3',
    teacherName: 'Bu Ratna Dewi',
    teacherAvatar: null,
    subject: 'Jadwal Asesmen Semester',
    lastMessage: 'Mohon diperhatikan jadwal asesmen kognitif semester 2...',
    timestamp: '3 days ago',
    unread: false,
    thread: [
      { id: 'mt7', sender: 'teacher', senderName: 'Bu Ratna Dewi', content: 'Mohon diperhatikan jadwal asesmen kognitif semester 2 akan dilaksanakan tanggal 20-22 April 2026. Pastikan Andi cukup istirahat ya.', timestamp: '2026-04-07 08:00' },
      { id: 'mt8', sender: 'parent', senderName: 'Parent', content: 'Baik Bu, terima kasih informasinya. Kami akan pastikan Andi siap.', timestamp: '2026-04-07 12:00' },
    ],
  },
]

// ─── Admin Dashboard Types ────────────────────────────────────

export interface MockSchool {
  id: string
  name: string
  address: string
  teacherCount: number
  studentCount: number
  createdAt: string
}

export interface MockClass {
  id: string
  name: string
  grade: 10 | 11 | 12
  academicYear: string
  schoolId: string
  schoolName: string
  teacherName: string
  studentCount: number
}

export interface MockTeacher {
  id: string
  name: string
  email: string
  schoolName: string
  classesAssigned: string[]
  status: 'active' | 'inactive'
}

export interface MockAdminStudent {
  id: string
  name: string
  schoolName: string
  className: string
  archetype: string | null
  assessmentStatus: 'completed' | 'in_progress' | 'not_started'
  onboardingStatus: 'completed' | 'pending'
}

export interface MockParent {
  id: string
  name: string
  email: string
  linkedChildren: string[]
}

export interface MockSystemConfig {
  cognitiveModuleEnabled: boolean
  varkModuleEnabled: boolean
  interestModuleEnabled: boolean
  gamificationEnabled: boolean
  xpMultiplier: number
  badgesEnabled: boolean
}

// ─── Admin Mock Data ──────────────────────────────────────────

export const MOCK_SCHOOLS: MockSchool[] = [
  {
    id: 'sch1',
    name: 'SMA Negeri 1 Jakarta',
    address: 'Jl. Budi Utomo No. 7, Jakarta Pusat',
    teacherCount: 8,
    studentCount: 120,
    createdAt: '2025-08-15',
  },
  {
    id: 'sch2',
    name: 'SMA Cendekia Bandung',
    address: 'Jl. Dago No. 45, Bandung',
    teacherCount: 5,
    studentCount: 80,
    createdAt: '2025-09-01',
  },
]

export const MOCK_CLASSES: MockClass[] = [
  {
    id: 'cls1',
    name: 'Kelas 10-A',
    grade: 10,
    academicYear: '2025/2026',
    schoolId: 'sch1',
    schoolName: 'SMA Negeri 1 Jakarta',
    teacherName: 'Bu Ratna Dewi',
    studentCount: 32,
  },
  {
    id: 'cls2',
    name: 'Kelas 11-B',
    grade: 11,
    academicYear: '2025/2026',
    schoolId: 'sch1',
    schoolName: 'SMA Negeri 1 Jakarta',
    teacherName: 'Pak Budi Setiawan',
    studentCount: 28,
  },
  {
    id: 'cls3',
    name: 'Kelas 10-A',
    grade: 10,
    academicYear: '2025/2026',
    schoolId: 'sch2',
    schoolName: 'SMA Cendekia Bandung',
    teacherName: 'Bu Sri Wahyuni',
    studentCount: 30,
  },
  {
    id: 'cls4',
    name: 'Kelas 12-A',
    grade: 12,
    academicYear: '2025/2026',
    schoolId: 'sch2',
    schoolName: 'SMA Cendekia Bandung',
    teacherName: 'Pak Hendra Gunawan',
    studentCount: 25,
  },
]

export const MOCK_TEACHERS: MockTeacher[] = [
  { id: 'tch1', name: 'Bu Ratna Dewi', email: 'ratna.dewi@sma1jkt.sch.id', schoolName: 'SMA Negeri 1 Jakarta', classesAssigned: ['Kelas 10-A'], status: 'active' },
  { id: 'tch2', name: 'Pak Budi Setiawan', email: 'budi.setiawan@sma1jkt.sch.id', schoolName: 'SMA Negeri 1 Jakarta', classesAssigned: ['Kelas 11-B'], status: 'active' },
  { id: 'tch3', name: 'Bu Sri Wahyuni', email: 'sri.wahyuni@cendekia.sch.id', schoolName: 'SMA Cendekia Bandung', classesAssigned: ['Kelas 10-A'], status: 'active' },
  { id: 'tch4', name: 'Pak Hendra Gunawan', email: 'hendra.g@cendekia.sch.id', schoolName: 'SMA Cendekia Bandung', classesAssigned: ['Kelas 12-A'], status: 'active' },
  { id: 'tch5', name: 'Bu Anisa Rahman', email: 'anisa.r@sma1jkt.sch.id', schoolName: 'SMA Negeri 1 Jakarta', classesAssigned: [], status: 'inactive' },
]

export const MOCK_ADMIN_STUDENTS: MockAdminStudent[] = [
  { id: 'as1', name: 'Andi Pratama', schoolName: 'SMA Negeri 1 Jakarta', className: 'Kelas 10-A', archetype: 'THINKER', assessmentStatus: 'completed', onboardingStatus: 'completed' },
  { id: 'as2', name: 'Siti Nurhaliza', schoolName: 'SMA Negeri 1 Jakarta', className: 'Kelas 10-A', archetype: 'CREATOR', assessmentStatus: 'completed', onboardingStatus: 'completed' },
  { id: 'as3', name: 'Budi Santoso', schoolName: 'SMA Negeri 1 Jakarta', className: 'Kelas 11-B', archetype: 'ENGINEER', assessmentStatus: 'completed', onboardingStatus: 'completed' },
  { id: 'as4', name: 'Maya Putri', schoolName: 'SMA Cendekia Bandung', className: 'Kelas 10-A', archetype: 'STORYTELLER', assessmentStatus: 'completed', onboardingStatus: 'completed' },
  { id: 'as5', name: 'Rizki Hidayat', schoolName: 'SMA Cendekia Bandung', className: 'Kelas 12-A', archetype: null, assessmentStatus: 'in_progress', onboardingStatus: 'completed' },
  { id: 'as6', name: 'Dewi Anggraini', schoolName: 'SMA Negeri 1 Jakarta', className: 'Kelas 10-A', archetype: null, assessmentStatus: 'not_started', onboardingStatus: 'pending' },
]

export const MOCK_PARENTS: MockParent[] = [
  { id: 'par1', name: 'Hadi Pratama', email: 'hadi.pratama@gmail.com', linkedChildren: ['Andi Pratama'] },
  { id: 'par2', name: 'Rina Nurhaliza', email: 'rina.n@gmail.com', linkedChildren: ['Siti Nurhaliza'] },
  { id: 'par3', name: 'Wawan Santoso', email: 'wawan.s@yahoo.com', linkedChildren: ['Budi Santoso'] },
  { id: 'par4', name: 'Sari Putri', email: 'sari.putri@gmail.com', linkedChildren: ['Maya Putri', 'Rizki Hidayat'] },
]

export const MOCK_SYSTEM_CONFIG: MockSystemConfig = {
  cognitiveModuleEnabled: true,
  varkModuleEnabled: true,
  interestModuleEnabled: true,
  gamificationEnabled: true,
  xpMultiplier: 1.0,
  badgesEnabled: true,
}

export const ADMIN_STATS = {
  totalSchools: 2,
  totalTeachers: 5,
  totalStudents: 200,
  totalParents: 150,
}

// ─── Student Dashboard — mock data for current logged-in student ──

export const MOCK_CURRENT_STUDENT = {
  id: 'student-1',
  name: 'Andi Pratama',
  archetype: 'The Thinker',
  archetypeCode: 'THINKER' as ArchetypeCode,
  school: 'SMA Negeri 1 Jakarta',
  class: 'Kelas 10-A',
  level: 5,
  currentXp: 2450,
  nextLevelXp: 3000,
  streak: 12,
  mood: 'confident',
  cognitiveParams: {
    analytical: 85,
    creative: 62,
    linguistic: 58,
    kinesthetic: 45,
    social: 70,
    observation: 75,
    intuition: 68,
  },
  vark: { visual: 30, auditory: 20, readWrite: 35, kinesthetic: 15 },
  dominantVark: 'R' as VarkTag,
}

export const MOCK_STUDENT_BADGES = [
  { id: 'b1', name: 'Deep Diver', icon: 'brain', unlocked: true, category: 'cognitive', earnedAt: '2024-03-01' },
  { id: 'b2', name: 'Logic Master', icon: 'calculator', unlocked: true, category: 'cognitive', earnedAt: '2024-03-05' },
  { id: 'b3', name: 'Pattern Seeker', icon: 'search', unlocked: true, category: 'cognitive', earnedAt: '2024-03-10' },
  { id: 'b4', name: '7-Day Warrior', icon: 'flame', unlocked: true, category: 'streak', earnedAt: '2024-03-08' },
  { id: 'b5', name: 'Team Player', icon: 'users', unlocked: true, category: 'peer', earnedAt: '2024-03-12' },
  { id: 'b6', name: 'Pathfinder', icon: 'compass', unlocked: true, category: 'career', earnedAt: '2024-03-15' },
  { id: 'b7', name: 'Innovator', icon: 'lightbulb', unlocked: false, category: 'project' },
  { id: 'b8', name: 'Monthly Champion', icon: 'trophy', unlocked: false, category: 'streak' },
  { id: 'b9', name: 'Synergizer', icon: 'zap', unlocked: false, category: 'peer' },
]

export const MOCK_QUEST_NODES = [
  { id: 'q1', title: 'Start Your Journey', completed: true, xp: 50, x: 10, y: 60 },
  { id: 'q2', title: 'Cognitive Assessment', completed: true, xp: 100, x: 25, y: 35 },
  { id: 'q3', title: 'VARK Discovery', completed: true, xp: 100, x: 40, y: 65 },
  { id: 'q4', title: 'First Project', completed: true, xp: 150, x: 55, y: 30 },
  { id: 'q5', title: 'Peer Group Formation', completed: false, xp: 200, x: 70, y: 55, current: true },
  { id: 'q6', title: 'Career Exploration', completed: false, xp: 250, x: 85, y: 35 },
  { id: 'q7', title: 'Master Project', completed: false, xp: 500, x: 95, y: 60, final: true },
]

export const MOCK_DAILY_MISSIONS = [
  { id: 'm1', title: 'Complete Logic Puzzle Lvl 3', xp: 25, completed: false, type: 'game' },
  { id: 'm2', title: 'Read: Indonesian Literature Chapter 5', xp: 15, completed: true, type: 'learn' },
  { id: 'm3', title: 'Review peer project submission', xp: 20, completed: false, type: 'group' },
]
