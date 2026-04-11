'use client'

import {
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'
import {
  useCurrentUser,
  useParentChildren,
  useStudentBadges,
} from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Lock,
  Trophy,
  Search,
  Brain,
  Footprints,
  Flame,
  Users,
  Compass,
  Sparkles,
  Moon,
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const badgeIcons: Record<string, React.ElementType> = {
  search: Search,
  brain: Brain,
  footprints: Footprints,
  flame: Flame,
  users: Users,
  compass: Compass,
  sparkles: Sparkles,
  moon: Moon,
}

const cognitiveLabels: Record<string, string> = {
  analytical: 'Analytical',
  creative: 'Creative',
  linguistic: 'Linguistic',
  kinesthetic: 'Kinesthetic',
  social: 'Social',
  observation: 'Observation',
  intuition: 'Intuition',
}

const parameterColors: Record<string, string> = {
  analytical: '#8B5CF6',
  creative: '#EC4899',
  linguistic: '#F59E0B',
  kinesthetic: '#F97316',
  social: '#10B981',
  observation: '#06B6D4',
  intuition: '#6366F1',
}

export function ParentGrowth() {
  const { user, loading: userLoading } = useCurrentUser()
  const { children, loading: childrenLoading } = useParentChildren(user?.id ?? '')
  const child = children?.[0] ?? null
  const { badges: rawBadges, loading: badgesLoading } = useStudentBadges(child?.id ?? '')

  const isLoading = userLoading || childrenLoading || badgesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Users className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No linked children found</p>
        <p className="text-sm mt-1">Link your child from the Settings page</p>
      </div>
    )
  }

  const xpToNextLevel = child.level * 500
  const xpPercent = xpToNextLevel > 0 ? Math.round((child.xp / xpToNextLevel) * 100) : 0
  const archetypeColor = ARCHETYPE_COLORS[child.archetype.code] ?? '#8B5CF6'

  const radarData = Object.entries(child.cognitiveParams).map(([key, value]) => ({
    subject: cognitiveLabels[key] ?? key,
    value,
    fullMark: 100,
  }))

  const varkData = [
    { name: 'Visual', value: child.varkProfile?.visual || 0, fill: '#8B5CF6' },
    { name: 'Auditory', value: child.varkProfile?.auditory || 0, fill: '#06B6D4' },
    { name: 'Read/Write', value: child.varkProfile?.readWrite ?? child.varkProfile?.read_write ?? 0, fill: '#F59E0B' },
    { name: 'Kinesthetic', value: child.varkProfile?.kinesthetic || 0, fill: '#EC4899' },
  ]

  const earnedBadges = rawBadges.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon_url || b.category || 'star',
    earnedAt: b.earned_at,
    description: b.description,
  }))
  const lockedBadges: typeof earnedBadges = []

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-3xl font-bold text-transparent">
          Growth Detail
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full cognitive profile and progress for {child.name}
        </p>
      </div>

      {/* Top Grid: Radar + Level/XP + VARK */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Radar Chart */}
        <Card className="glass col-span-1 lg:col-span-5">
          <CardHeader>
            <CardTitle>Cognitive Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke={archetypeColor}
                  fill={archetypeColor}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right: Level + VARK */}
        <div className="col-span-1 space-y-6 lg:col-span-7">
          {/* Level & XP Card */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: archetypeColor }}
                    >
                      {child.level}
                    </span>
                    <Badge variant={child.archetype.code.toLowerCase() as never}>
                      {child.archetype.name}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">XP Progress</p>
                  <p className="mt-1 text-lg font-bold text-amber-400">
                    {child.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={xpPercent} indicatorClassName="from-amber-500 to-yellow-400" />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {xpToNextLevel - child.xp} XP to Level {child.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* VARK Profile */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>VARK Learning Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={varkData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]
                      return (
                        <div className="rounded-lg border border-white/10 bg-[#151B3B] px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium text-white">{d.payload.name}</p>
                          <p className="text-sm" style={{ color: d.payload.fill }}>{d.value}%</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                    {varkData.map((entry) => (
                      <rect key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Individual Parameter Trends */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Parameter Trends</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.keys(cognitiveLabels).map((param) => (
            <Card key={param} className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: parameterColors[param] }}>
                  {cognitiveLabels[param]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">
                    {child.cognitiveParams[param as keyof typeof child.cognitiveParams]}
                  </span>
                </div>
                <div className="flex items-center justify-center py-4 text-xs text-slate-500">
                  Trend data coming soon
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Badge Collection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Badge Collection</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {earnedBadges.map((badge) => {
            const Icon = badgeIcons[badge.icon] ?? Trophy
            return (
              <div
                key={badge.id}
                className="glass flex flex-col items-center gap-2 rounded-xl border-white/[0.06] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
                  <Icon className="h-6 w-6 text-amber-400" />
                </div>
                <p className="text-center text-sm font-medium text-white">{badge.name}</p>
                <p className="text-center text-[10px] text-muted-foreground">{badge.description}</p>
                <p className="text-[10px] text-amber-400/70">{badge.earnedAt}</p>
              </div>
            )
          })}
          {lockedBadges.map((badge) => {
            const Icon = badgeIcons[badge.icon] ?? Trophy
            return (
              <div
                key={badge.id}
                className="glass flex flex-col items-center gap-2 rounded-xl border-dashed p-4 opacity-50"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <Icon className="h-6 w-6 text-slate-500" />
                  <Lock className="absolute -bottom-1 -right-1 h-4 w-4 text-slate-500" />
                </div>
                <p className="text-center text-sm font-medium text-slate-400">{badge.name}</p>
                <p className="text-center text-[10px] text-muted-foreground">{badge.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
