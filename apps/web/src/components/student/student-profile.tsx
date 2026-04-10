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
  Sparkles,
  Settings,
  Shield,
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
import {
  MOCK_CURRENT_STUDENT,
  MOCK_STUDENT_BADGES,
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'

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

const student = MOCK_CURRENT_STUDENT
const badges = MOCK_STUDENT_BADGES
const unlockedCount = badges.filter((b) => b.unlocked).length
const xpPercent = Math.round((student.currentXp / student.nextLevelXp) * 100)

const cognitiveData = [
  { param: 'Analytical', value: student.cognitiveParams.analytical, icon: <Brain className="h-4 w-4" /> },
  { param: 'Creative', value: student.cognitiveParams.creative, icon: <Sparkles className="h-4 w-4" /> },
  { param: 'Linguistic', value: student.cognitiveParams.linguistic, icon: <BookOpen className="h-4 w-4" /> },
  { param: 'Kinesthetic', value: student.cognitiveParams.kinesthetic, icon: <Target className="h-4 w-4" /> },
  { param: 'Social', value: student.cognitiveParams.social, icon: <Users className="h-4 w-4" /> },
  { param: 'Observation', value: student.cognitiveParams.observation, icon: <Eye className="h-4 w-4" /> },
  { param: 'Intuition', value: student.cognitiveParams.intuition, icon: <Shield className="h-4 w-4" /> },
]

const radarData = cognitiveData.map(({ param, value }) => ({ param, value }))

const varkData = [
  { label: 'Visual', value: student.vark.visual, color: '#8B5CF6' },
  { label: 'Auditory', value: student.vark.auditory, color: '#06B6D4' },
  { label: 'Read/Write', value: student.vark.readWrite, color: '#F59E0B' },
  { label: 'Kinesthetic', value: student.vark.kinesthetic, color: '#EC4899' },
]
const varkTotal = varkData.reduce((s, v) => s + v.value, 0)

const careerRecs = [
  { title: 'Data Scientist', match: 92 },
  { title: 'Research Analyst', match: 88 },
  { title: 'Software Engineer', match: 85 },
  { title: 'Academic Researcher', match: 82 },
  { title: 'Systems Architect', match: 78 },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function StudentProfile() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Top: Avatar Card + Archetype Details ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="purple" className="p-6 text-center">
            <div className="relative mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-[#1a1040]/50 to-[#0d1530]/50 p-2">
                <ArchetypeAvatar archetypeCode={student.archetypeCode} gender="male" size="md" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white">{student.name}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {student.school} &middot; {student.class}
            </p>

            <div className="mt-3 flex justify-center">
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: `${ARCHETYPE_COLORS[student.archetypeCode]}20`,
                  color: ARCHETYPE_COLORS[student.archetypeCode],
                  border: `1px solid ${ARCHETYPE_COLORS[student.archetypeCode]}40`,
                }}
              >
                {student.archetype}
              </span>
            </div>

            {/* XP / Level */}
            <div className="mt-5 rounded-lg bg-white/5 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Level {student.level}</span>
                <span className="font-mono text-amber-400">
                  {student.currentXp} / {student.nextLevelXp} XP
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1 }}
                  style={{ boxShadow: '0 0 10px rgba(139,92,246,0.4)' }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="font-semibold text-white">{student.streak}</span>
              <span className="text-slate-400">day streak</span>
            </div>
          </GlowCard>
        </motion.div>

        {/* Cognitive radar (bigger) */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlowCard glowColor="cyan" className="p-6">
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
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      {/* ── Middle row: VARK + Career ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* VARK Breakdown */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="cyan" className="p-6">
            <h3 className="mb-1 text-lg font-bold text-white">VARK Learning Style</h3>
            <p className="mb-4 text-xs text-slate-400">
              Dominant: <span className="font-semibold text-cyan-400">{student.dominantVark === 'R' ? 'Read/Write' : student.dominantVark}</span>
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
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: v.color, boxShadow: `0 0 8px ${v.color}40` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(v.value / varkTotal) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        {/* Career Recommendations */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="gold" className="p-6">
            <h3 className="mb-1 text-lg font-bold text-white">Career Recommendations</h3>
            <p className="mb-4 text-xs text-slate-400">
              Based on your {student.archetype} archetype and cognitive profile
            </p>

            <div className="space-y-3">
              {careerRecs.map((career, i) => (
                <div
                  key={career.title}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3"
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
          </GlowCard>
        </motion.div>
      </div>

      {/* ── Bottom: Badges collection + Settings ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Full badge grid */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlowCard glowColor="gold" className="p-6">
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
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                    badge.unlocked
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400'
                        : 'bg-white/5 text-slate-600'
                    }`}
                    style={
                      badge.unlocked
                        ? { boxShadow: '0 0 14px rgba(245,158,11,0.25)' }
                        : undefined
                    }
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
          </GlowCard>
        </motion.div>

        {/* Settings */}
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="purple" className="p-6">
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
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-purple-500/20 hover:bg-white/5"
                >
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
