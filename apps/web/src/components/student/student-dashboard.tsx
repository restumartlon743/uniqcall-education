'use client'

import {
  Brain,
  Calculator,
  Search,
  Flame,
  Users,
  Compass,
  Lightbulb,
  Trophy,
  Zap,
  Lock,
  CheckCircle2,
  Star,
  Crosshair,
  Swords,
  BookOpen,
  UsersRound,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { GlowCard } from '@/components/effects/glow-card'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'
import { ARCHETYPE_COLORS } from '@/lib/mock-data'
import {
  useCurrentUser,
  useStudentData,
  useStudentBadges,
  useStudentMissions,
  useStudentQuests,
  useLeaderboard,
} from '@/hooks/use-supabase-data'

import Link from 'next/link'

const BADGE_ICONS: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5" />,
  calculator: <Calculator className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  compass: <Compass className="h-5 w-5" />,
  lightbulb: <Lightbulb className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
}

const MISSION_ICONS: Record<string, React.ReactNode> = {
  game: <Swords className="h-4 w-4" />,
  learn: <BookOpen className="h-4 w-4" />,
  group: <UsersRound className="h-4 w-4" />,
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function StudentDashboard() {
  const { user, loading: userLoading } = useCurrentUser()
  const { student, loading: studentLoading } = useStudentData(user?.id ?? '')
  const { badges: rawBadges, loading: badgesLoading } = useStudentBadges(user?.id ?? '')
  const { missions: rawMissions, loading: missionsLoading } = useStudentMissions(user?.id ?? '')
  const { quests: rawQuests, loading: questsLoading } = useStudentQuests(user?.id ?? '')
  const { leaderboard: topStudents } = useLeaderboard()

  const isLoading = userLoading || studentLoading || badgesLoading || missionsLoading || questsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!student || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Brain className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No student data available</p>
        <p className="text-sm mt-1">Complete your assessment to see your dashboard</p>
      </div>
    )
  }

  const nextLevelXp = student.level * 500
  const xpPercent = nextLevelXp > 0 ? Math.round((student.xp / nextLevelXp) * 100) : 0

  const badges = rawBadges.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon_url || b.category || 'star',
    unlocked: true,
    category: b.category,
  }))
  const unlockedCount = badges.length

  const missions = rawMissions.map((m) => ({
    id: m.id,
    title: m.title || m.mission_title || 'Mission',
    xp: m.xp_reward || 0,
    completed: m.completed ?? m.status === 'completed',
    type: m.type || m.mission_type || 'game',
  }))

  const questNodes = rawQuests
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map((q, i, arr) => {
      const total = arr.length
      return {
        id: q.id,
        title: q.title,
        completed: q.status === 'completed' || !!q.completed_at,
        xp: q.xp_reward || 0,
        x: total > 1 ? 10 + (80 * i) / (total - 1) : 50,
        y: i % 2 === 0 ? 60 : 35,
        current: q.status === 'in_progress',
        final: i === total - 1,
      }
    })

  const radarData = [
    { param: 'Analytical', value: student.cognitiveParams.analytical },
    { param: 'Creative', value: student.cognitiveParams.creative },
    { param: 'Linguistic', value: student.cognitiveParams.linguistic },
    { param: 'Kinesthetic', value: student.cognitiveParams.kinesthetic },
    { param: 'Social', value: student.cognitiveParams.social },
    { param: 'Observation', value: student.cognitiveParams.observation },
    { param: 'Intuition', value: student.cognitiveParams.intuition },
  ]
  const topSkills = [...radarData].sort((a, b) => b.value - a.value).slice(0, 3)

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Top row: Avatar | Radar | Badges ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Avatar & Stats ── */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="purple" className="relative h-full p-6">
            {/* Avatar area */}
            <div className="relative mx-auto mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-[#1a1040]/50 to-[#0d1530]/50 p-2">
                <ArchetypeAvatar archetypeCode={student.archetype.code} gender="male" size="lg" />
                {/* Level badge */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-purple-500/50 bg-[#151B3B] px-3 py-0.5 text-xs font-bold text-purple-300">
                  LVL {student.level}
                </div>
              </div>
            </div>

            <h2 className="text-center text-xl font-bold text-white">
              {student.name}
            </h2>

            {/* Archetype badge */}
            <div className="mt-1 flex justify-center">
              <span
                className="rounded-full px-3 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: `${ARCHETYPE_COLORS[student.archetype.code]}20`,
                  color: ARCHETYPE_COLORS[student.archetype.code],
                  border: `1px solid ${ARCHETYPE_COLORS[student.archetype.code]}40`,
                }}
              >
                {student.archetype.name}
              </span>
            </div>

            <p className="mt-2 text-center text-xs text-slate-400">
              {student.school} &middot; {student.className}
            </p>

            {/* XP bar */}
            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">XP Progress</span>
                <span className="font-mono text-amber-400">
                  {student.xp.toLocaleString()} / {nextLevelXp.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    boxShadow: '0 0 12px rgba(139,92,246,0.5)',
                  }}
                />
              </div>
            </div>

            {/* Streak & Mood row */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">{student.streak}</span>
                <span className="text-xs text-slate-400">day streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                <Sparkles className="h-4 w-4" />
                <span className="capitalize">Active</span>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* ── Center: Cognitive Radar ── */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="cyan" className="h-full p-6">
            <h3 className="mb-1 text-lg font-bold text-white">Cognitive Skills</h3>
            <p className="mb-2 text-xs text-slate-400">Your 7-parameter cognitive profile</p>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid
                    stroke="rgba(6,182,212,0.15)"
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="param"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Cognitive"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#A855F7', strokeWidth: 0 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Top skills summary */}
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-slate-400">Dominant skills</p>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((s) => (
                  <span
                    key={s.param}
                    className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-300"
                  >
                    {s.param} {s.value}%
                  </span>
                ))}
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* ── Right: Badges ── */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="gold" className="h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Badges</h3>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {unlockedCount}/{badges.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                    badge.unlocked
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400'
                        : 'bg-white/5 text-slate-600'
                    }`}
                    style={
                      badge.unlocked
                        ? { boxShadow: '0 0 12px rgba(245,158,11,0.2)' }
                        : undefined
                    }
                  >
                    {badge.unlocked ? (
                      BADGE_ICONS[badge.icon] ?? <Star className="h-5 w-5" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-center text-[10px] font-medium leading-tight ${
                      badge.unlocked ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Mastery level bar */}
            <div className="mt-5 rounded-lg bg-white/5 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">
                  <Star className="mr-1 inline h-3.5 w-3.5 text-amber-400" />
                  Mastery Level {student.level}
                </span>
                <span className="font-mono text-amber-400">{xpPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 10px rgba(245,158,11,0.4)' }}
                />
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      {/* ── Mini Leaderboard: Top 5 ── */}
      <motion.div variants={fadeUp}>
        <GlowCard glowColor="purple" className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Top 5 Students</h3>
            </div>
            <Link
              href="/student/leaderboard"
              className="flex items-center gap-1 text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
            >
              View full leaderboard
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {topStudents.slice(0, 5).map((entry) => {
              const isMe = entry.studentId === user?.id
              return (
                <div
                  key={entry.studentId}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isMe
                      ? 'border border-purple-500/20 bg-purple-500/5'
                      : 'bg-white/[0.02] hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      entry.rank === 1
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : entry.rank === 2
                          ? 'bg-gray-400/20 text-gray-300'
                          : entry.rank === 3
                            ? 'bg-orange-700/20 text-orange-400'
                            : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${isMe ? 'text-purple-300' : 'text-slate-200'}`}>
                    {entry.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{entry.totalXp.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
            {topStudents.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-500">No leaderboard data yet</p>
            )}
          </div>
        </GlowCard>
      </motion.div>

      {/* ── Bottom row: Missions | Quest preview ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Missions */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="cyan" className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Daily Missions</h3>
              <span className="text-xs text-slate-400">
                {missions.filter((m) => m.completed).length}/{missions.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    mission.completed
                      ? 'bg-green-500/5 border border-green-500/10'
                      : 'bg-white/5 border border-white/5 hover:border-cyan-500/20'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      mission.completed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    {mission.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      MISSION_ICONS[mission.type] ?? <Crosshair className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        mission.completed
                          ? 'text-slate-500 line-through'
                          : 'text-slate-200'
                      }`}
                    >
                      {mission.title}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      mission.completed
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    +{mission.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        {/* Quest Journey preview */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="purple" className="relative overflow-hidden p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Career Quest Journey</h3>
              <Link
                href="/student/quests"
                className="flex items-center gap-1 text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                View full map
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mini quest path */}
            <div className="relative h-32 w-full">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
              >
                {questNodes.slice(0, -1).map((node, i) => {
                  const next = questNodes[i + 1]
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke={node.completed && next.completed ? '#06B6D4' : '#1E2548'}
                      strokeWidth="0.8"
                      strokeDasharray={node.completed && next.completed ? 'none' : '2 2'}
                    />
                  )
                })}
              </svg>

              {questNodes.map((node) => {
                const isCurrent = 'current' in node && node.current
                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[8px] font-bold ${
                        node.completed
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                          : isCurrent
                            ? 'border-purple-400 bg-purple-500/20 text-purple-300 animate-glow-pulse'
                            : 'border-slate-600 bg-slate-800 text-slate-600'
                      }`}
                    >
                      {node.completed ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : isCurrent ? (
                        <Crosshair className="h-3 w-3" />
                      ) : (
                        <Lock className="h-2.5 w-2.5" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-2 text-center text-xs text-slate-400">
              Quest {questNodes.filter((n) => n.completed).length}/{questNodes.length} &middot;
              Next: {questNodes.find((n) => 'current' in n && n.current)?.title ?? 'Complete'}
            </p>
          </GlowCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
