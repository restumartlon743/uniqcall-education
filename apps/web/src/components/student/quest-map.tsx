'use client'

import { CheckCircle2, Lock, Crosshair, Star, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  useCurrentUser,
  useStudentData,
  useStudentQuests,
} from '@/hooks/use-supabase-data'

function buildSvgPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const cx = (prev.x + cur.x) / 2
    d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`
  }
  return d
}

export function QuestMap() {
  const { user, loading: userLoading } = useCurrentUser()
  const { student, loading: studentLoading } = useStudentData(user?.id ?? '')
  const { quests: rawQuests, loading: questsLoading } = useStudentQuests(user?.id ?? '')

  const isLoading = userLoading || studentLoading || questsLoading

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
        <Crosshair className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No quest data available</p>
        <p className="text-sm mt-1">Start your journey to see your quest map</p>
      </div>
    )
  }

  const nodes = rawQuests
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

  const completedCount = nodes.filter((n) => n.completed).length
  const totalXpEarned = nodes.filter((n) => n.completed).reduce((s, n) => s + n.xp, 0)

  const completedPath = buildSvgPath(
    nodes.filter((n) => n.completed).map((n) => ({ x: n.x, y: n.y }))
  )
  const fullPath = buildSvgPath(nodes.map((n) => ({ x: n.x, y: n.y })))

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-300">
            <span className="font-bold text-white">{completedCount}</span>/{nodes.length} Quests
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-amber-400">{totalXpEarned.toLocaleString()} XP</span>
          <span className="text-slate-400">earned</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-sm">
          <Trophy className="h-4 w-4 text-purple-400" />
          <span className="text-slate-300">
            Level <span className="font-bold text-white">{student.level}</span>
          </span>
        </div>
      </div>

      {/* Quest Map */}
      <Card className="glass border-white/[0.06]">
        <CardContent className="p-6 lg:p-8">
          <h2 className="mb-6 text-xl font-bold text-white">
            Career Quest Journey
          </h2>

          <div className="relative mx-auto" style={{ height: 420, maxWidth: 900 }}>
            {/* SVG lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Full path (dimmed) */}
              <path
                d={fullPath}
                stroke="#1E2548"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Completed path (glowing cyan) */}
              {completedPath && (
                <path
                  d={completedPath}
                  stroke="#06B6D4"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isCurrent = 'current' in node && node.current
              const isFinal = 'final' in node && node.final

              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {/* Node circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative flex items-center justify-center rounded-full border-2 ${
                        node.completed
                          ? 'h-11 w-11 border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : isCurrent
                            ? 'h-14 w-14 border-purple-400 bg-purple-500/10 text-purple-300'
                            : isFinal
                              ? 'h-12 w-12 border-amber-500/30 bg-amber-500/5 text-amber-600'
                              : 'h-10 w-10 border-slate-600/50 bg-slate-800/50 text-slate-600'
                      }`}
                    >
                      {node.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isCurrent ? (
                        <Crosshair className="h-6 w-6 animate-pulse" />
                      ) : isFinal ? (
                        <Trophy className="h-5 w-5" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`mt-2 max-w-[90px] text-center text-[10px] font-medium leading-tight lg:text-xs ${
                        node.completed
                          ? 'text-slate-300'
                          : isCurrent
                            ? 'text-purple-300'
                            : 'text-slate-500'
                      }`}
                    >
                      {node.title}
                    </span>

                    {/* XP badge */}
                    <span
                      className={`mt-1 rounded-full px-1.5 py-px text-[9px] font-bold ${
                        node.completed
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : isCurrent
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-white/5 text-slate-600'
                      }`}
                    >
                      +{node.xp} XP
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
