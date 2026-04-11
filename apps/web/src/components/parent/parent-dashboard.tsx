'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'
import {
  useCurrentUser,
  useParentChildren,
} from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  Hand,
  Mail,
  Bell,
  AlertCircle,
  Star,
  Smile,
  Lightbulb,
  Users,
} from 'lucide-react'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'

export function ParentDashboard() {
  const [highFiveSent, setHighFiveSent] = useState(false)
  const { user, loading: userLoading } = useCurrentUser()
  const { children, loading: childrenLoading } = useParentChildren(user?.id ?? '')

  const isLoading = userLoading || childrenLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user || children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Users className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No linked children found</p>
        <p className="text-sm mt-1">Link your child from the Settings page</p>
      </div>
    )
  }

  const child = children[0]
  const xpToNextLevel = child.level * 500
  const archetypeColor = ARCHETYPE_COLORS[child.archetype.code] ?? '#8B5CF6'
  const xpPercent = xpToNextLevel > 0 ? Math.round((child.xp / xpToNextLevel) * 100) : 0

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

        {/* Notification Badges - will show real counts later */}
        <div className="flex items-center gap-3">
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-purple-500/30 hover:bg-purple-500/10">
            <Mail className="h-5 w-5 text-slate-400 transition-colors group-hover:text-purple-400" />
          </button>
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10">
            <Bell className="h-5 w-5 text-slate-400 transition-colors group-hover:text-cyan-400" />
          </button>
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-amber-500/30 hover:bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-slate-400 transition-colors group-hover:text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Child Profile + Highlights + Growth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Section A: Child Profile Header */}
        <Card className="glass border-white/[0.06] col-span-1 lg:col-span-4">
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
              {child.archetype.name}
            </Badge>

            {/* Mood Speech Bubble */}
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-300">
                <Smile className="h-4 w-4 text-emerald-400" />
                Active and learning
              </p>
            </div>

            {/* Level & XP */}
            <div className="mt-5 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {child.level}</span>
                <span className="font-medium text-amber-400">
                  <Star className="mr-1 inline h-3 w-3" />
                  {child.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                </span>
              </div>
              <Progress value={xpPercent} indicatorClassName="from-amber-500 to-yellow-400" />
            </div>

            {/* School Info */}
            <div className="mt-4 w-full space-y-1 text-center text-xs text-muted-foreground">
              <p>{child.school}</p>
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] py-8 text-center">
              <Star className="h-10 w-10 mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">No highlights this week yet</p>
              <p className="text-xs text-slate-500 mt-1">Highlights will appear as your child progresses</p>
            </div>
          </div>

          {/* Section C: Growth Snapshot */}
          <Card className="glass border-white/[0.06]">
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="h-10 w-10 mb-3 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Growth data coming soon</p>
                <p className="text-xs text-slate-500 mt-1">Charts will appear after a few weeks of activity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section D: Interaction — High Five */}
      <Card className="glass border-white/[0.06] overflow-hidden">
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
              'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              highFiveSent
                ? 'border-emerald-400 bg-emerald-500/20'
                : 'border-purple-500/30 bg-purple-500/10 hover:border-cyan-400 hover:bg-cyan-500/10'
            )}
          >
            <Hand
              className={cn(
                'h-7 w-7 transition-colors',
                highFiveSent
                  ? 'text-emerald-400'
                  : 'text-purple-400'
              )}
            />
            {highFiveSent && (
              <span className="absolute -top-8 flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                High Five Sent!
              </span>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Weekly Report Summary */}
      <Card className="glass border-white/[0.06]">
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
