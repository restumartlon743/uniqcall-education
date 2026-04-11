'use client'

import { cn } from '@/lib/utils'
import {
  getArchetypeBadgeVariant,
  ARCHETYPE_INTERVENTIONS,
} from '@/lib/mock-data'
import type { StudentData } from '@/hooks/use-supabase-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, CheckCircle2, Circle } from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useState } from 'react'

interface StudentDetailPanelProps {
  student: StudentData
  onClose: () => void
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function EngagementTooltip({
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
      <p className="text-sm text-cyan-400">{payload[0].value}%</p>
    </div>
  )
}

export function StudentDetailPanel({
  student,
  onClose,
}: StudentDetailPanelProps) {
  const [checkedActions, setCheckedActions] = useState<Set<number>>(new Set())

  const radarData = [
    { param: 'Analytical', value: student.cognitiveParams.analytical },
    { param: 'Creative', value: student.cognitiveParams.creative },
    { param: 'Linguistic', value: student.cognitiveParams.linguistic },
    { param: 'Kinesthetic', value: student.cognitiveParams.kinesthetic },
    { param: 'Social', value: student.cognitiveParams.social },
    { param: 'Observation', value: student.cognitiveParams.observation },
    { param: 'Intuition', value: student.cognitiveParams.intuition },
  ]

  const engagementData = student.engagement.map((value, i) => ({
    day: DAY_LABELS[i],
    value,
  }))

  const interventions =
    ARCHETYPE_INTERVENTIONS[student.archetype.code] ?? []

  const toggleAction = (index: number) => {
    setCheckedActions((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="ml-4 w-[380px] shrink-0 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="glass relative rounded-xl p-5">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500/40 to-cyan-500/40 text-lg font-bold text-white">
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-white">{student.name}</h3>
            <Badge
              variant={getArchetypeBadgeVariant(student.archetype.code)}
              className="mt-1"
            >
              {student.archetype.name}
            </Badge>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Level</span>
            <p className="font-semibold text-white">{student.level}</p>
          </div>
          <div>
            <span className="text-muted-foreground">XP</span>
            <p className="font-semibold text-amber-400">
              {student.xp.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">VARK</span>
            <p className="font-semibold text-white">{student.vark}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Progress</span>
            <p className="font-semibold text-white">{student.progress}%</p>
          </div>
        </div>
      </div>

      {/* Cognitive Skills Radar */}
      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Cognitive Skills Radar</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid
                stroke="rgba(255,255,255,0.1)"
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="param"
                tick={{ fill: '#94A3B8', fontSize: 10 }}
              />
              <PolarRadiusAxis
                tick={{ fill: '#64748b', fontSize: 9 }}
                domain={[0, 100]}
                axisLine={false}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Level */}
      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Engagement Level</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={engagementData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<EngagementTooltip />} />
              <Bar
                dataKey="value"
                fill="#06B6D4"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Suggested Intervention Actions */}
      <Card
        className={cn(
          'glass',
          student.status === 'needs_attention' && 'border-amber-500/20'
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Suggested Intervention Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {interventions.map((action, i) => {
              const isChecked = checkedActions.has(i)
              return (
                <button
                  key={i}
                  onClick={() => toggleAction(i)}
                  className={cn(
                    'flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left text-sm transition-all',
                    isChecked
                      ? 'bg-purple-500/10 text-purple-300'
                      : 'hover:bg-white/5 text-slate-300'
                  )}
                >
                  {isChecked ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  )}
                  <span className={isChecked ? 'line-through opacity-70' : ''}>
                    {action}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
