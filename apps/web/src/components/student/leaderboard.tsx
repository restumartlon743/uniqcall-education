'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Star,
  Flame,
  TrendingUp,
  Users,
} from 'lucide-react'
import { GlowCard } from '@/components/effects/glow-card'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'
import { ARCHETYPE_COLORS } from '@/lib/mock-data'
import {
  useCurrentUser,
  useStudentData,
  useLeaderboard,
} from '@/hooks/use-supabase-data'
import type { LeaderboardEntry } from '@/hooks/use-supabase-data'
import { useLanguage } from '@/lib/i18n/context'

// ─── SVG Medal Icons ──────────────────────────────────────────

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 17L5 7L9 12L12 4L15 12L19 7L22 17H2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="2" y="17" width="20" height="3" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function MedalIcon({ place, className }: { place: 1 | 2 | 3; className?: string }) {
  const colors = {
    1: { outer: '#FFD700', inner: '#FFA500' },
    2: { outer: '#C0C0C0', inner: '#A0A0A0' },
    3: { outer: '#CD7F32', inner: '#A0522D' },
  }
  const c = colors[place]
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="14" r="8" fill={c.outer} stroke={c.inner} strokeWidth="1.5" />
      <circle cx="12" cy="14" r="5" fill={c.inner} opacity="0.3" />
      <text x="12" y="17" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c.inner}>
        {place}
      </text>
      <path d="M8 2L12 6L16 2" stroke={c.outer} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Tab types ────────────────────────────────────────────────

type TabKey = 'class' | 'school' | 'global'

const TAB_KEYS: TabKey[] = ['class', 'school', 'global']
const TAB_LABEL_MAP: Record<TabKey, string> = {
  class: 'leaderboard.class_tab',
  school: 'leaderboard.school_tab',
  global: 'leaderboard.global_tab',
}

// ─── Podium Card ──────────────────────────────────────────────

function PodiumCard({
  entry,
  place,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  place: 1 | 2 | 3
  isCurrentUser: boolean
}) {
  const { t } = useLanguage()
  const accentMap = {
    1: { glow: 'rgba(255,215,0,0.4)', border: 'border-yellow-500/40', bg: 'from-yellow-500/10 to-amber-500/5' },
    2: { glow: 'rgba(192,192,192,0.3)', border: 'border-gray-400/30', bg: 'from-gray-400/10 to-gray-500/5' },
    3: { glow: 'rgba(205,127,50,0.3)', border: 'border-orange-700/30', bg: 'from-orange-700/10 to-orange-800/5' },
  }
  const accent = accentMap[place]
  const sizeClass = place === 1 ? 'h-20 w-20' : 'h-16 w-16'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: place * 0.1, duration: 0.5 }}
      className={`relative flex flex-col items-center ${place === 1 ? 'order-2 -mt-4' : place === 2 ? 'order-1 mt-4' : 'order-3 mt-4'}`}
    >
      <div
        className={`relative rounded-2xl border bg-gradient-to-b ${accent.bg} ${accent.border} p-4 backdrop-blur-xl ${isCurrentUser ? 'ring-2 ring-purple-500/50' : ''}`}
        style={{ boxShadow: `0 0 25px ${accent.glow}` }}
      >
        {place === 1 && (
          <CrownIcon className="absolute -top-5 left-1/2 h-8 w-8 -translate-x-1/2 text-yellow-400" />
        )}
        <div className="flex flex-col items-center">
          <div className={`relative ${sizeClass} overflow-hidden rounded-xl border-2 ${accent.border} bg-gray-900/50`}>
            <ArchetypeAvatar archetypeCode={entry.archetypeCode} gender="male" size={place === 1 ? 'lg' : 'md'} />
          </div>
          <MedalIcon place={place} className="mt-2 h-7 w-7" />
          <p className="mt-1 max-w-[100px] truncate text-center text-sm font-bold text-white">
            {entry.name}
          </p>
          <span
            className="mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: `${ARCHETYPE_COLORS[entry.archetypeCode] || '#8B5CF6'}20`,
              color: ARCHETYPE_COLORS[entry.archetypeCode] || '#8B5CF6',
              border: `1px solid ${ARCHETYPE_COLORS[entry.archetypeCode] || '#8B5CF6'}40`,
            }}
          >
            {entry.archetypeName}
          </span>
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{entry.totalXp.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">{t('leaderboard.xp')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Rank Row ─────────────────────────────────────────────────

function RankRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: entry.rank * 0.02, duration: 0.3 }}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/5 ${
        isCurrentUser
          ? 'border border-purple-500/30 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
          : 'border border-transparent bg-white/[0.02]'
      }`}
    >
      {/* Rank */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-bold text-slate-300">
        {entry.rank}
      </div>

      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gray-900/50">
        <ArchetypeAvatar archetypeCode={entry.archetypeCode} gender="male" size="sm" />
      </div>

      {/* Name + Archetype */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
          {entry.name}
        </p>
        <span
          className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium"
          style={{
            backgroundColor: `${ARCHETYPE_COLORS[entry.archetypeCode] || '#8B5CF6'}15`,
            color: ARCHETYPE_COLORS[entry.archetypeCode] || '#8B5CF6',
          }}
        >
          {entry.archetypeName}
        </span>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1 shrink-0">
        <Star className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-sm font-bold text-amber-400">{entry.totalXp.toLocaleString()}</span>
      </div>

      {/* Level */}
      <div className="hidden sm:flex shrink-0 items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5">
        <TrendingUp className="h-3 w-3 text-purple-400" />
        <span className="text-xs font-semibold text-purple-300">{t('leaderboard.level')} {entry.level}</span>
      </div>

      {/* Streak */}
      <div className="hidden md:flex shrink-0 items-center gap-1">
        <Flame className="h-3.5 w-3.5 text-orange-400" />
        <span className="text-xs font-semibold text-orange-300">{entry.streak}</span>
      </div>
    </motion.div>
  )
}

// ─── Main Leaderboard ─────────────────────────────────────────

export function Leaderboard() {
  const { t } = useLanguage()
  const { user, loading: userLoading } = useCurrentUser()
  const { student, loading: studentLoading } = useStudentData(user?.id ?? '')
  const [activeTab, setActiveTab] = useState<TabKey>('class')


  const { leaderboard: globalBoard, loading: globalLoading } = useLeaderboard()
  const { leaderboard: classBoard, loading: classLoading } = useLeaderboard(
    student ? (student as any).classId : undefined
  )

  const isLoading = userLoading || studentLoading || globalLoading || classLoading

  // For class/school tabs we filter the global board client-side when student data is available
  const leaderboard = (() => {
    if (activeTab === 'global') return globalBoard
    if (activeTab === 'class' && student) {
      return globalBoard.filter((e) => {
        // If we have a class board, use it; otherwise fallback to global
        return classBoard.length > 0 ? classBoard.some((c) => c.studentId === e.studentId) : true
      })
    }
    if (activeTab === 'school') {
      // school is stored as string on student; match by name
      return globalBoard
    }
    return globalBoard
  })()

  const currentUserId = user?.id ?? ''
  const currentEntry = leaderboard.find((e) => e.studentId === currentUserId)
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  const currentXp = currentEntry?.totalXp ?? 0
  const xpInLevel = currentXp % 500
  const xpPercent = Math.round((xpInLevel / 500) * 100)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Trophy className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('leaderboard.title')}</h1>
          <p className="text-sm text-slate-400">{t('leaderboard.top_students')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/5 p-1 backdrop-blur-xl">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Users className="h-4 w-4" />
            {t(TAB_LABEL_MAP[tab])}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2/3: Podium + List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Podium */}
          {top3.length > 0 && (
            <GlowCard glowColor="purple" className="p-6">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {top3.length > 1 && (
                  <PodiumCard
                    entry={top3[1]}
                    place={2}
                    isCurrentUser={top3[1].studentId === currentUserId}
                  />
                )}
                {top3.length > 0 && (
                  <PodiumCard
                    entry={top3[0]}
                    place={1}
                    isCurrentUser={top3[0].studentId === currentUserId}
                  />
                )}
                {top3.length > 2 && (
                  <PodiumCard
                    entry={top3[2]}
                    place={3}
                    isCurrentUser={top3[2].studentId === currentUserId}
                  />
                )}
              </div>
            </GlowCard>
          )}

          {/* Full ranking list */}
          <GlowCard glowColor="cyan" className="p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white px-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              {t('leaderboard.ranking')}
            </h3>

            {rest.length === 0 && top3.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Trophy className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">{t('leaderboard.no_data')}</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1.5"
              >
                {rest.map((entry) => (
                  <RankRow
                    key={entry.studentId}
                    entry={entry}
                    isCurrentUser={entry.studentId === currentUserId}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </GlowCard>
        </div>

        {/* Right 1/3: Your Stats */}
        <div className="space-y-6">
          <GlowCard glowColor="gold" className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Star className="h-5 w-5 text-amber-400" />
              {t('leaderboard.your_stats')}
            </h3>

            {currentEntry ? (
              <div className="space-y-4">
                {/* Rank */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-400">{t('leaderboard.your_rank')}</span>
                  <span className="text-2xl font-bold text-purple-300">#{currentEntry.rank}</span>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    {t('leaderboard.level')}
                  </span>
                  <span className="text-xl font-bold text-purple-300">{currentEntry.level}</span>
                </div>

                {/* XP */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <Star className="h-4 w-4 text-amber-400" />
                    {t('leaderboard.xp')}
                  </span>
                  <span className="text-xl font-bold text-amber-400">
                    {currentEntry.totalXp.toLocaleString()}
                  </span>
                </div>

                {/* Streak */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <Flame className="h-4 w-4 text-orange-400" />
                    {t('leaderboard.streak')}
                  </span>
                  <span className="text-xl font-bold text-orange-400">{currentEntry.streak}</span>
                </div>

                {/* XP Progress to Next Level */}
                <div className="rounded-xl bg-white/5 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t('leaderboard.next_level')}</span>
                    <span className="font-mono text-purple-300">
                      {xpInLevel} / 500
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                {t('leaderboard.no_data')}
              </div>
            )}
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
