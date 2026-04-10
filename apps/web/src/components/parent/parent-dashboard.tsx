'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MOCK_PARENT_CHILD,
  MOCK_WEEKLY_HIGHLIGHTS,
  MOCK_GROWTH_DATA,
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap,
  Puzzle,
  TrendingUp,
  Hand,
  Mail,
  Bell,
  AlertCircle,
  Star,
  Sparkles,
  Smile,
  Lightbulb,
} from 'lucide-react'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const child = MOCK_PARENT_CHILD
const highlights = MOCK_WEEKLY_HIGHLIGHTS
const growthData = MOCK_GROWTH_DATA

const highlightIcons: Record<string, React.ElementType> = {
  'graduation-cap': GraduationCap,
  puzzle: Puzzle,
  'trending-up': TrendingUp,
}

const highlightColors: Record<string, { border: string; bg: string; text: string }> = {
  badge: { border: 'border-l-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  quest: { border: 'border-l-purple-400', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  skill: { border: 'border-l-cyan-400', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
}

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#151B3B] px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-sm text-purple-400">Score: {payload[0].value}</p>
    </div>
  )
}

export function ParentDashboard() {
  const [highFiveSent, setHighFiveSent] = useState(false)
  const archetypeColor = ARCHETYPE_COLORS[child.archetype.code] ?? '#8B5CF6'
  const xpPercent = Math.round((child.xp / child.xpToNextLevel) * 100)

  function handleHighFive() {
    setHighFiveSent(true)
    setTimeout(() => setHighFiveSent(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-3xl font-bold text-transparent">
            Family Support Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau perkembangan {child.name} secara real-time
          </p>
        </div>

        {/* Notification Badges */}
        <div className="flex items-center gap-3">
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-purple-500/30 hover:bg-purple-500/10">
            <Mail className="h-5 w-5 text-slate-400 transition-colors group-hover:text-purple-400" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
              2
            </span>
          </button>
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10">
            <Bell className="h-5 w-5 text-slate-400 transition-colors group-hover:text-cyan-400" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
              5
            </span>
          </button>
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-amber-500/30 hover:bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-slate-400 transition-colors group-hover:text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Child Profile + Highlights + Growth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Section A: Child Profile Header */}
        <Card className="glass card-glow-hover col-span-1 lg:col-span-4">
          <CardContent className="flex flex-col items-center p-6">
            {/* 3D Avatar */}
            <div className="relative mb-2 h-40 w-32 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1040]/30 to-[#0d1530]/30">
              <ArchetypeAvatar
                archetypeCode={child.archetype.code}
                gender="male"
                size="md"
                glowColor={archetypeColor}
                showPlatform={false}
              />
              {/* Mood indicator */}
              <div className="absolute bottom-2 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#151B3B] bg-emerald-500">
                <Smile className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {/* Name & Archetype */}
            <h2 className="text-xl font-bold text-white">{child.name}</h2>
            <Badge
              variant={child.archetype.code.toLowerCase() as never}
              className="mt-2"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              {child.archetype.name}
            </Badge>

            {/* Mood Speech Bubble */}
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-300">
                <Smile className="h-4 w-4 text-emerald-400" />
                {child.mood}
              </p>
            </div>

            {/* Level & XP */}
            <div className="mt-5 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {child.level}</span>
                <span className="font-medium text-amber-400">
                  <Star className="mr-1 inline h-3 w-3" />
                  {child.xp.toLocaleString()} / {child.xpToNextLevel.toLocaleString()} XP
                </span>
              </div>
              <Progress value={xpPercent} indicatorClassName="from-amber-500 to-yellow-400" />
            </div>

            {/* School Info */}
            <div className="mt-4 w-full space-y-1 text-center text-xs text-muted-foreground">
              <p>{child.schoolName}</p>
              <p>{child.className}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Highlights + Growth */}
        <div className="col-span-1 space-y-6 lg:col-span-8">
          {/* Section B: Weekly Highlights */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">
              Weekly Highlights
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {highlights.map((h) => {
                const Icon = highlightIcons[h.icon] ?? Star
                const colors = highlightColors[h.type] ?? highlightColors.badge
                return (
                  <div
                    key={h.id}
                    className={cn(
                      'glass card-glow-hover group relative overflow-hidden rounded-xl border-l-4 p-4 transition-all duration-300 hover:scale-[1.02]',
                      colors.border
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          colors.bg
                        )}
                      >
                        <Icon className={cn('h-5 w-5', colors.text)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {h.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {h.description}
                        </p>
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          {h.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section C: Growth Snapshot */}
          <Card className="glass border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Growth Snapshot</CardTitle>
                  <p className="mt-1 text-sm text-purple-400">Analytical Skill</p>
                </div>
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={growthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<GrowthTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="analytical"
                    stroke="url(#growthGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', stroke: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6, fill: '#06B6D4', stroke: '#06B6D4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section D: Interaction — High Five */}
      <Card className="glass card-glow-hover overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              Send a High Five to {child.name}!
              <Hand className="h-5 w-5 text-purple-400" />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Show your support — your encouragement boosts confidence!
            </p>
          </div>
          <button
            onClick={handleHighFive}
            disabled={highFiveSent}
            className={cn(
              'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
              highFiveSent
                ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]'
            )}
          >
            <Hand
              className={cn(
                'h-8 w-8 transition-all duration-300',
                highFiveSent
                  ? 'scale-125 text-emerald-400'
                  : 'text-purple-400'
              )}
            />
            {highFiveSent && (
              <span className="absolute -top-8 flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                High Five Sent! <Sparkles className="h-3 w-3 text-yellow-400" />
              </span>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Weekly Report Summary */}
      <Card className="glass border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Weekly Success Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">5</p>
              <p className="mt-1 text-xs text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">350</p>
              <p className="mt-1 text-xs text-muted-foreground">XP Earned This Week</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">92%</p>
              <p className="mt-1 text-xs text-muted-foreground">Engagement Score</p>
            </div>
          </div>

          {/* Home Support Tips */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
              Rekomendasi Dukungan di Rumah
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Ajak Andi berdiskusi tentang topik sains yang diminatinya</li>
              <li>• Berikan pujian untuk konsistensi mengerjakan daily missions</li>
              <li>• Dorong untuk lebih aktif di kegiatan sosial kelompok belajar</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
