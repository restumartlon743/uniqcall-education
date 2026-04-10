'use client'

import { cn } from '@/lib/utils'
import {
  MOCK_STUDENTS,
  WEEKLY_PROGRESS,
  ARCHETYPE_COLORS,
  getArchetypeDistribution,
} from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  getArchetypeBadgeVariant,
  getProgressColor,
} from '@/lib/mock-data'
import {
  Download,
  TrendingUp,
  AlertTriangle,
  Trophy,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const topStudents = [...MOCK_STUDENTS]
  .sort((a, b) => b.progress - a.progress)
  .slice(0, 5)

const atRiskStudents = MOCK_STUDENTS.filter(
  (s) => s.status === 'needs_attention'
)

function LineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#151B3B] px-3 py-2 shadow-lg">
      <p className="mb-1 text-sm font-medium text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
          {p.dataKey === 'mastery' ? 'Mastery' : 'Engagement'}: {p.value}%
        </p>
      ))}
    </div>
  )
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { code: string } }>
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#151B3B] px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-white">{payload[0].name}</p>
      <p className="text-sm text-purple-400">{payload[0].value} students</p>
    </div>
  )
}

export function TeacherReports() {
  const distribution = getArchetypeDistribution()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Reports & Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Class performance overview and insights
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Class Progress Over Time */}
        <Card className="glass border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Class Progress Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={WEEKLY_PROGRESS}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<LineTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
                />
                <Line
                  type="monotone"
                  dataKey="mastery"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                  name="Mastery"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', r: 4 }}
                  activeDot={{ r: 6, fill: '#06B6D4' }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Archetype Distribution Pie */}
        <Card className="glass border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-purple-400" />
              Archetype Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                  stroke="none"
                >
                  {distribution.map((entry) => (
                    <Cell
                      key={entry.code}
                      fill={ARCHETYPE_COLORS[entry.code] ?? '#8B5CF6'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#94A3B8' }}
                  formatter={(value: string) => (
                    <span className="text-slate-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Students */}
        <Card className="glass border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Top Performing Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, i) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3"
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      i === 0
                        ? 'bg-amber-500/20 text-amber-400'
                        : i === 1
                          ? 'bg-slate-400/20 text-slate-300'
                          : i === 2
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-white/10 text-slate-400'
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-purple-500/30 to-cyan-500/30 text-xs font-bold text-white">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {student.name}
                    </p>
                  </div>
                  <Badge
                    variant={getArchetypeBadgeVariant(student.archetype.code)}
                    className="text-[10px]"
                  >
                    {student.archetype.name}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={student.progress}
                      className="w-16"
                      indicatorClassName={cn(
                        'bg-linear-to-r',
                        getProgressColor(student.progress)
                      )}
                    />
                    <span className="w-8 text-right text-xs text-muted-foreground">
                      {student.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Needing Intervention */}
        <Card className="glass border-amber-500/15 transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Students Needing Intervention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atRiskStudents.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No students currently need intervention.
              </p>
            ) : (
              <div className="space-y-3">
                {atRiskStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 rounded-lg bg-amber-500/5 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {student.lastActive} · Progress:{' '}
                        {student.progress}%
                      </p>
                    </div>
                    <Badge
                      variant={getArchetypeBadgeVariant(
                        student.archetype.code
                      )}
                      className="text-[10px]"
                    >
                      {student.archetype.name}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
