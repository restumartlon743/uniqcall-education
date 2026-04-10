'use client'

import { CheckCircle2, Lock, Crosshair, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlowCard } from '@/components/effects/glow-card'
import { MOCK_QUEST_NODES, MOCK_CURRENT_STUDENT } from '@/lib/mock-data'

const nodes = MOCK_QUEST_NODES
const student = MOCK_CURRENT_STUDENT
const completedCount = nodes.filter((n) => n.completed).length
const totalXpEarned = nodes.filter((n) => n.completed).reduce((s, n) => s + n.xp, 0)

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function QuestMap() {
  const completedPath = buildSvgPath(
    nodes.filter((n) => n.completed).map((n) => ({ x: n.x, y: n.y }))
  )
  const fullPath = buildSvgPath(nodes.map((n) => ({ x: n.x, y: n.y })))

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Header stats */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
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
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-slate-300">
            Level <span className="font-bold text-white">{student.level}</span>
          </span>
        </div>
      </motion.div>

      {/* Quest Map */}
      <motion.div variants={fadeUp}>
        <GlowCard glowColor="purple" className="relative p-6 lg:p-8">
          <h2 className="mb-6 text-xl font-bold text-white text-glow-purple">
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
                  filter="url(#glow)"
                />
              )}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isCurrent = 'current' in node && node.current
              const isFinal = 'final' in node && node.final

              return (
                <motion.div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {/* Node circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative flex items-center justify-center rounded-full border-2 transition-all ${
                        node.completed
                          ? 'h-11 w-11 border-cyan-400 bg-gradient-to-br from-cyan-500/30 to-purple-500/20 text-cyan-300'
                          : isCurrent
                            ? 'h-14 w-14 border-purple-400 bg-gradient-to-br from-purple-600/30 to-cyan-600/20 text-purple-300'
                            : isFinal
                              ? 'h-12 w-12 border-amber-500/30 bg-amber-500/5 text-amber-600'
                              : 'h-10 w-10 border-slate-600/50 bg-slate-800/50 text-slate-600'
                      }`}
                      style={
                        node.completed
                          ? { boxShadow: '0 0 16px rgba(6,182,212,0.3)' }
                          : isCurrent
                            ? { boxShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)' }
                            : undefined
                      }
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

                      {/* Pulsing ring for current */}
                      {isCurrent && (
                        <div className="absolute inset-0 animate-ping rounded-full border border-purple-400/30" />
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
                </motion.div>
              )
            })}
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  )
}

function Trophy(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
