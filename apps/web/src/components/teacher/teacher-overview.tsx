'use client'

import { cn } from '@/lib/utils'
import {
  MOCK_STUDENTS,
  MOCK_ACTIVITIES,
  ARCHETYPE_COLORS,
  getArchetypeDistribution,
} from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Target,
  Users2,
  AlertTriangle,
  FileText,
  Trophy,
  AlertCircle,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const totalStudents = MOCK_STUDENTS.length
const avgMastery = Math.round(
  MOCK_STUDENTS.reduce((sum, s) => sum + s.progress, 0) / totalStudents
)
const activeGroups = 4
const needsAttention = MOCK_STUDENTS.filter(
  (s) => s.status === 'needs_attention'
).length

const statsCards = [
  {
    label: 'Total Students',
    value: totalStudents,
    icon: Users,
    color: 'purple' as const,
    suffix: '',
  },
  {
    label: 'Average Mastery',
    value: avgMastery,
    icon: Target,
    color: 'cyan' as const,
    suffix: '%',
  },
  {
    label: 'Active Groups',
    value: activeGroups,
    icon: Users2,
    color: 'purple' as const,
    suffix: '',
  },
  {
    label: 'Needs Attention',
    value: needsAttention,
    icon: AlertTriangle,
    color: 'red' as const,
    suffix: '',
  },
]

const activityIcons = {
  submission: FileText,
  achievement: Trophy,
  alert: AlertCircle,
  new_student: Users,
}

function CustomTooltip({
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
      <p className="text-sm text-purple-400">{payload[0].value} students</p>
    </div>
  )
}

export function TeacherOverview() {
  const distribution = getArchetypeDistribution()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const isRed = stat.color === 'red'
          return (
            <div
              key={stat.label}
              className={cn(
                'glass card-glow-hover group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]',
                isRed
                  ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                  : stat.color === 'cyan'
                    ? 'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                    : 'border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p
                    className={cn(
                      'mt-1 text-3xl font-bold',
                      isRed ? 'text-red-400' : 'text-white'
                    )}
                  >
                    {stat.value}
                    {stat.suffix}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    isRed
                      ? 'bg-red-500/15 text-red-400'
                      : stat.color === 'cyan'
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'bg-purple-500/15 text-purple-400'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              {/* Bottom glow line */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-full drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]',
                  isRed
                    ? 'bg-linear-to-r from-transparent via-red-500 to-transparent'
                    : stat.color === 'cyan'
                      ? 'bg-linear-to-r from-transparent via-cyan-500 to-transparent'
                      : 'bg-linear-to-r from-transparent via-purple-500 to-transparent'
                )}
              />
            </div>
          )
        })}
      </div>

      {/* Alert Banner */}
      {needsAttention > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-4 shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.25)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-300">
                {needsAttention} Students Need Attention
              </p>
              <p className="text-sm text-red-300/70">
                These students show declining engagement or low progress. Review
                their profiles and consider intervention.
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/5 blur-2xl" />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class Distribution Chart */}
        <Card className="glass col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Archetype Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribution} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  fill="#8B5CF6"
                  barSize={32}
                >
                  {distribution.map((entry) => (
                    <rect
                      key={entry.code}
                      fill={ARCHETYPE_COLORS[entry.code] ?? '#8B5CF6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ACTIVITIES.map((activity) => {
                const Icon = activityIcons[activity.type]
                const isAlert = activity.type === 'alert'
                return (
                  <div
                    key={activity.id}
                    className="flex gap-3"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        isAlert
                          ? 'bg-red-500/15 text-red-400'
                          : activity.type === 'achievement'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-purple-500/15 text-purple-400'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-sm leading-snug',
                          isAlert ? 'text-red-300' : 'text-slate-300'
                        )}
                      >
                        {activity.message}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
