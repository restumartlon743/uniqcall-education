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
  Star,
  Target,
  Eye,
  BookOpen,
  Settings,
  Shield,
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'
import {
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'
import {
  useCurrentUser,
  useStudentData,
  useStudentBadges,
} from '@/hooks/use-supabase-data'

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

const careerRecs = [
  { title: 'Data Scientist', match: 92 },
  { title: 'Research Analyst', match: 88 },
  { title: 'Software Engineer', match: 85 },
  { title: 'Academic Researcher', match: 82 },
  { title: 'Systems Architect', match: 78 },
]

export function StudentProfile() {
  const { user, loading: userLoading } = useCurrentUser()
  const { student, loading: studentLoading } = useStudentData(user?.id ?? '')
  const { badges: rawBadges, loading: badgesLoading } = useStudentBadges(user?.id ?? '')

  const isLoading = userLoading || studentLoading || badgesLoading

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
        <p className="text-lg font-medium">No profile data available</p>
        <p className="text-sm mt-1">Complete your assessment to see your profile</p>
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

  const cognitiveData = [
    { param: 'Analytical', value: student.cognitiveParams.analytical, icon: <Brain className="h-4 w-4" /> },
    { param: 'Creative', value: student.cognitiveParams.creative, icon: <Lightbulb className="h-4 w-4" /> },
    { param: 'Linguistic', value: student.cognitiveParams.linguistic, icon: <BookOpen className="h-4 w-4" /> },
    { param: 'Kinesthetic', value: student.cognitiveParams.kinesthetic, icon: <Target className="h-4 w-4" /> },
    { param: 'Social', value: student.cognitiveParams.social, icon: <Users className="h-4 w-4" /> },
    { param: 'Observation', value: student.cognitiveParams.observation, icon: <Eye className="h-4 w-4" /> },
    { param: 'Intuition', value: student.cognitiveParams.intuition, icon: <Shield className="h-4 w-4" /> },
  ]
  const radarData = cognitiveData.map(({ param, value }) => ({ param, value }))

  const varkData = [
    { label: 'Visual', value: student.varkProfile?.visual || 0, color: '#8B5CF6' },
    { label: 'Auditory', value: student.varkProfile?.auditory || 0, color: '#06B6D4' },
    { label: 'Read/Write', value: student.varkProfile?.readWrite ?? student.varkProfile?.read_write ?? 0, color: '#F59E0B' },
    { label: 'Kinesthetic', value: student.varkProfile?.kinesthetic || 0, color: '#EC4899' },
  ]
  const varkTotal = varkData.reduce((s, v) => s + v.value, 0) || 1

  return (
    <div className="space-y-6">
      {/* ── Top: Avatar Card + Archetype Details ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <Card className="glass border-white/[0.06]">
          <CardContent className="p-6 text-center">
            <div className="relative mx-auto mb-4 flex items-center justify-center">
              <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#1a1040]/50 to-[#0d1530]/50 p-2">
                <ArchetypeAvatar archetypeCode={student.archetype.code} gender="male" size="md" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white">{student.name}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {student.school} &middot; {student.className}
            </p>

            <div className="mt-3 flex justify-center">
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: `${ARCHETYPE_COLORS[student.archetype.code]}20`,
                  color: ARCHETYPE_COLORS[student.archetype.code],
                  border: `1px solid ${ARCHETYPE_COLORS[student.archetype.code]}40`,
                }}
              >
                {student.archetype.name}
              </span>
            </div>

            {/* XP / Level */}
            <div className="mt-5 rounded-lg bg-white/5 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Level {student.level}</span>
                <span className="font-mono text-amber-400">
                  {student.xp} / {nextLevelXp} XP
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="font-semibold text-white">{student.streak}</span>
              <span className="text-slate-400">day streak</span>
            </div>
          </CardContent>
        </Card>

        {/* Cognitive radar (bigger) */}
        <Card className="glass border-white/[0.06] lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="mb-1 text-lg font-bold text-white">Cognitive Profile</h3>
            <p className="mb-3 text-xs text-slate-400">Detailed 7-parameter cognitive skills analysis</p>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="rgba(6,182,212,0.15)" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="param" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
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

              {/* Bars */}
              <div className="space-y-3">
                {cognitiveData.map((skill) => (
                  <div key={skill.param}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-purple-400">{skill.icon}</span>
                        {skill.param}
                      </span>
                      <span className="font-mono text-slate-400">{skill.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Middle row: VARK + Career ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* VARK Breakdown */}
        <Card className="glass border-white/[0.06]">
          <CardContent className="p-6">
            <h3 className="mb-1 text-lg font-bold text-white">VARK Learning Style</h3>
            <p className="mb-4 text-xs text-slate-400">
              Dominant: <span className="font-semibold text-cyan-400">{student.vark === 'R' ? 'Read/Write' : student.vark === 'V' ? 'Visual' : student.vark === 'A' ? 'Auditory' : 'Kinesthetic'}</span>
            </p>

            <div className="space-y-4">
              {varkData.map((v) => (
                <div key={v.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{v.label}</span>
                    <span className="font-mono text-xs text-slate-400">
                      {Math.round((v.value / varkTotal) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ backgroundColor: v.color, width: `${(v.value / varkTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Recommendations */}
        <Card className="glass border-white/[0.06]">
          <CardContent className="p-6">
            <h3 className="mb-1 text-lg font-bold text-white">Career Recommendations</h3>
            <p className="mb-4 text-xs text-slate-400">
              Based on your {student.archetype.name} archetype and cognitive profile
            </p>

            <div className="space-y-3">
              {careerRecs.map((career, i) => (
                <div
                  key={career.title}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-bold text-amber-400">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200">{career.title}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-400">
                    {career.match}% match
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom: Badges collection + Settings ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Full badge grid */}
        <Card className="glass border-white/[0.06] lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Badge Collection</h3>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {unlockedCount}/{badges.length} unlocked
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 ${
                    badge.unlocked
                      ? 'bg-white/5'
                      : 'bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400'
                        : 'bg-white/5 text-slate-600'
                    }`}
                  >
                    {badge.unlocked ? (
                      BADGE_ICONS[badge.icon] ?? <Star className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-center text-xs font-medium leading-tight ${
                      badge.unlocked ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {badge.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{badge.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="glass border-white/[0.06]">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Settings</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Notification Preferences', desc: 'Mission reminders, badge alerts' },
                { label: 'Avatar Customization', desc: 'Change your character look' },
                { label: 'Privacy Settings', desc: 'Profile visibility, data sharing' },
                { label: 'Language', desc: 'Bahasa Indonesia' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
